import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert, useWindowDimensions, TextInput, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { useLanguage } from '../../context/LanguageContext';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'react-native-image-picker';
import Header from '../Header';
import api from '../../APIServices/api';
import Feather from 'react-native-vector-icons/dist/Feather';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';


const UploadReport = () => {
    // const [selectedImages, setSelectedImages] = useState([]);
    const { width, height } = useWindowDimensions();
    const [poid, setPoid] = useState('');
    const { t } = useLanguage();
    const [reportType, setReportType] = useState('');
    const [reportName, setReportName] = useState('');
    const [hpvResult, setHpvResult] = useState('');
    const [image, setImage] = useState(null);
    const [imageList, setImageList] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otherDetails, setOtherDetails] = useState('');
    const [titer, setTiter] = useState('');

    useEffect(() => {

        const getUser = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                if (user) {
                    const parsedUser = JSON.parse(user);
                    setPoid(parsedUser.po_id);
                    console.log("User POID:", parsedUser.po_id);
                }

            } catch (error) {
                console.error("Error retrieving user data:", error);
            }
        }
        getUser();
    }, []);
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };
    const selectImage = () => {

        // StatusBar.setHidden(true);

        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
                // StatusBar.setHidden(false);
            } else if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Image selection failed.');
                // StatusBar.setHidden(false);
            } else if (response.assets && response.assets.length > 0) {
                const selectedUri = response.assets[0].uri;
                console.log("Selected URI:", selectedUri);
                // Open cropper with selected image
                ImageCropPicker.openCropper({
                    path: selectedUri,
                    freeStyleCropEnabled: true,
                    cropperToolbarTitle: 'Crop your image',
                    hideBottomControls: false,

                    // Quality-related settings:
                    compressImageQuality: 1, // 1 means 100% quality
                    compressImageMaxWidth: 2000, // optional: prevents super high-res bloat
                    compressImageMaxHeight: 2000, // optional: keeps large size but manageable

                    // Add this if you want original EXIF orientation preserved
                    includeExif: true,
                })
                    .then((croppedImage) => {
                        console.log("Cropped Image:", croppedImage);
                        setImage({
                            uri: croppedImage.path,
                            type: croppedImage.mime,
                            name: 'report_image.jpg',
                        });

                        // StatusBar.setHidden(false); // Re-show status bar after cropping
                    })
                    .catch((error) => {
                        console.log('Crop cancelled or failed:', error);
                        // StatusBar.setHidden(false); // Ensure status bar is restored
                    });
            } else {
                // StatusBar.setHidden(false);
                console.log('No image selected');
            }
        });
    }
    const selectMultipleImage = () => {
    

        launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, async (response) => {
            if (response.didCancel) {
                
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Image selection failed.');
                
            } else if (response.assets && response.assets.length > 0) {
                const croppedImages = [];

                for (const asset of response.assets) {
                    try {
                        const croppedImage = await ImageCropPicker.openCropper({
                            path: asset.uri,
                            freeStyleCropEnabled: true,
                            cropperToolbarTitle: 'Crop your image',
                            hideBottomControls: false,

                            // Quality-related settings:
                            compressImageQuality: 1,
                            compressImageMaxWidth: 2000, // optional: prevents super high-res bloat
                            compressImageMaxHeight: 2000, // optional: keeps large size but manageable

                            // Add this if you want original EXIF orientation preserved
                            includeExif: true,
                        });

                        croppedImages.push({
                            uri: croppedImage.path,
                            type: croppedImage.mime,
                            name: `report_image_${Date.now()}.jpg`,
                            id:  Date.now(),
                        });
                    } catch (error) {
                        console.log('Crop cancelled or failed:', error);
                    }
                }

                if (croppedImages.length > 0) {
                    setImageList(croppedImages); // use setImageList if managing multiple images
                }

                
            } else {
                
                console.log('No image selected');
            }
        });
    };

    const handleTestReportSubmit = async () => {

        if (!poid || !reportType || !date || !image) {
            Alert.alert('Warning', 'Please fill all required fields.');
            return;
        }

        // Check for reportName when reportType is 'test'
        if (reportType === 'Test') {
            if (!reportName) {
                Alert.alert('Warning', 'Please select a report name.');
                return;
            }
            if (reportName === 'other' && !otherDetails) {
                Alert.alert('Warning', 'Please enter other report details.');
                return;
            }
        }

      
        const formData = new FormData();
        formData.append('po_id', poid); // Append POID
        formData.append('report_type', reportType); // Append reportType
        formData.append('selected_date', date.toISOString().split('T')[0]); // Append formatted date

        // // If reportType is 'test', append reportName and other details if applicable
        if (reportType === 'Test') {
            formData.append('report_title', reportName); // Append reportName
            if (reportName === 'other') {
                // formData.append('other_details', otherDetails); // Append other details
                formData.append('report_title', otherDetails); // Append other details
            }
        }
        const correctedUri = image.uri.startsWith('file://') ? image.uri : `file://${image.uri}`;

        formData.append('files_name', {

            uri: correctedUri,
            name: image.name || 'report_image.jpg',
            type: image.type || 'image/jpeg',
        });

        console.log('Form Test Data', formData)
        setLoading(true); // Show loading state

        try {
            const response = await api.post('/upload-report', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set content type for file upload

                    },
                }
            );

            const result = response.data; // Get response data
            console.log('Result', result);
            if (result.success) {
                Alert.alert('Success', 'Report uploaded successfully!'); // Success message
                // Reset form fields
                setReportType('');
                setReportName('');
                setOtherDetails('');
                setHpvResult('');
                setTiter('');
                setDate(new Date());
                setImage(null); // Clear the image
                console.log("Uploaded Report:", result);
            } else {
                console.log(result.errors_msg); // Log errors from the backend
                Alert.alert('Error', result.msg || 'Unable to upload'); // Show error message

            }
        } catch (error) {
            console.error("Error uploading report:", error); // Log error
            Alert.alert('Error', 'Something went wrong while uploading the report.'); // Error message
        } finally {
            setLoading(false); // Hide loading state
        }
    };
    const handleHPVReportSubmit = async () => {
        if (!poid.trim()) {
            Alert.alert('Warning', 'Please enter poid.');
            return;
        }
        if (!imageList) {
            Alert.alert('Warning', 'Please select images.');
            return;
        }

        // Check for hpvResult and titer if reportType is 'hpv'
        if (reportType === 'HPV') {
            if (!hpvResult) {
                Alert.alert('Warning', 'Please select an HPV result.');
                return;
            }
            if (hpvResult === 'Positive' && !titer) {
                Alert.alert('Warning', 'Please enter the titer value.');
                return;
            }
        }

        const formData = new FormData();
        formData.append('po_id', poid); // Append POID
        formData.append('report_type', reportType); // Append reportType
        formData.append('selected_date', date.toISOString().split('T')[0]); // Append formatted date
        // // If reportType is 'hpv', append hpvResult and titer if applicable
        if (reportType === 'HPV') {
            // formData.append('hpv_result', hpvResult); // Append hpvResult
            formData.append('result_type', hpvResult); // Append hpvResult
            if (hpvResult === 'Positive') {
                // formData.append('titer', titer); // Append titer if HPV result is positive
                formData.append('report_title', titer); // Append titer if HPV result is positive
            }
            else {
                formData.append('report_title', hpvResult)
            }
        }

        imageList.forEach((image, index) => {
            const correctedUri = image.uri.startsWith('file://') ? image.uri : `file://${image.uri}`;

            formData.append('files_name_multiple[]', {
                uri: correctedUri,
                name: image.name || `report_image_${index + 1}.jpg`,
                type: image.type || 'image/jpeg',
            });
        });

        console.log('Form HPV Data', formData)
        setLoading(true); // Show loading state

        try {
            const response = await api.post('/upload-report', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set content type for file upload
                    },
                }
            );

            const result = response.data; // Get response data
            console.log('Result', result);
            if (result.success) {
                Alert.alert('Success', 'Report uploaded successfully!'); // Success message
                // Reset form fields
                setReportType('');
                setReportName('');
                setOtherDetails('');
                setHpvResult('');
                setTiter('');
                setDate(new Date());
                setImageList(null); // Clear the images
                console.log("Uploaded Report:", result);
            } else {
                console.log(result.errors_msg); // Log errors from the backend
                Alert.alert('Error', result.msg || 'Unable to upload'); // Show error message

            }
        } catch (error) {
            console.error("Error uploading report:", error); // Log error
            Alert.alert('Error', 'Something went wrong while uploading the report.'); // Error message
        } finally {
            setLoading(false); // Hide loading state
        }
    }
    // handle reset
    const handleReset = () => {
        // setPoid('');
        setReportType('');
        setReportName('');
        setHpvResult('');
        setImage(null);
        setImageList(null);
        setDate(new Date());
        Alert.alert('Success', 'Form reset successfully!');

    };
    useFocusEffect(
        React.useCallback(() => {
          StatusBar.setBackgroundColor('#6A6BBF'); 
          StatusBar.setBarStyle('light-content');
        }, [])
      );
    return (
        <SafeAreaView style={[styles.mainView, { height: height, width: width }]} >
            <StatusBar barStyle="light-content" backgroundColor="#6A6BBF" />
            {/* <StatusBar barStyle="dark-content" backgroundColor="#ffffff" /> */}

            <Header title={t('Upload Report')} textColor={'#fff'} iconColor={'#fff'} />

            <ScrollView style={{ width: '90%' }}
                contentContainerStyle={{
                    paddingBottom: 40,
                    marginTop: 20,
                    justifyContent: 'center',


                }}
                showsHorizontalScrollIndicator={false}

                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.label}>{t("POID")}</Text>
                <View>
                    <View style={styles.inputView}>

                        <TextInput
                            style={styles.input}
                            placeholder={t("Enter POID")}
                            placeholderTextColor="black"
                            value={poid}
                            onChangeText={setPoid}
                        />
                    </View>


                    <Text style={styles.label}>{t('Select Report Type')}</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={reportType}
                            style={styles.pickerText}
                            onValueChange={(itemValue) => {
                                setReportType(itemValue);
                                setReportName('');
                                setHpvResult('');
                            }}
                        >
                            <Picker.Item label={t("Select")} value="" />
                            <Picker.Item label={t("Test Report")} value="Test" />
                            <Picker.Item label={t("HPV Report")} value="HPV" />
                        </Picker>
                    </View>

                    {reportType === 'Test' && (
                        <>
                            <Text style={styles.label}>{t('Report Name')}</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={reportName}
                                    style={styles.pickerText}
                                    onValueChange={(itemValue) => setReportName(itemValue)}
                                >
                                    <Picker.Item label={t("Select Report")} value="" />
                                    <Picker.Item label={t("Colposcopy Report")} value="Colposcopy" />
                                    <Picker.Item label={t("USG Breast Report")} value="USG Breast" />
                                    <Picker.Item label={t("Mamogram Report")} value="Mamogram" />
                                    <Picker.Item label={t("MRI Report")} value="MRI" />
                                    <Picker.Item label={t("Genetic Test Report")} value="Genetic Test" />
                                    <Picker.Item label={t("Ultrasound Abdominal")} value="Ultrasound Abdominal" />
                                    <Picker.Item label={t("Histopath Breast Report")} value="Histopath Breast" />
                                    <Picker.Item label={t("Histopath Cervix Report")} value="Histopath Cervix" />
                                    <Picker.Item label={t("Gyne Colposcopy Report")} value="Gyne Colposcopy" />
                                    <Picker.Item label={t("Pap- Smear Report")} value="Pap- Smear" />
                                    <Picker.Item label={t("Other Report")} value="other" />
                                </Picker>
                            </View>
                            {reportName === 'other' && (
                                <>
                                    <Text style={styles.label}>{t('Other Details')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={t("Enter other details")}
                                        value={otherDetails}
                                        onChangeText={setOtherDetails}
                                        placeholderTextColor={"#fff"}
                                    />
                                </>
                            )}
                            <Text style={styles.label}>{t('Upload Image')}</Text>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                // style={styles.uploadBtn}
                                style={styles.uploadBtnView}

                                onPress={selectImage}>

                                {image ? (
                                    <Image
                                        source={{ uri: image.uri }}
                                        style={styles.previewImage}
                                        resizeMode="contain"
                                    />
                                ) : (

                                    <Image source={require('./homeimages/ImageUpload.jpeg')}
                                        resizeMode="cover"
                                        style={{ width: 200, height: 200, borderRadius: 10, opacity: 0.8 }}
                                    />

                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {reportType === 'HPV' && (
                        <>
                            <Text style={styles.label}>{t('HPV Result')}</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={hpvResult}
                                    style={styles.pickerText}
                                    onValueChange={(itemValue) => setHpvResult(itemValue)}
                                >
                                    <Picker.Item label={t("Select Result")} value="" />
                                    <Picker.Item label={t("Positive")} value="Positive" />
                                    <Picker.Item label={t("Negative")} value="Negative" />
                                </Picker>
                            </View>
                            {hpvResult === 'Positive' && (
                                <>
                                    <Text style={styles.label}>{t('Titer')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={t("Enter Titer")}
                                        value={titer}
                                        onChangeText={setTiter}
                                    />
                                </>
                            )}
                            {/* images  */}
                            <Text style={styles.label}>{t('Upload Image')}</Text>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={styles.uploadBtnView}

                                onPress={selectMultipleImage}>

                                {imageList && imageList.length > 0 ? (
                                    imageList.map((image, index) => (
                                        <ScrollView horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 10 }} >
                                            <Image
                                                key={index}
                                                source={{ uri: image.uri }}
                                                style={[styles.previewImage, {
                                                    width: 150,
                                                    height: 200,
                                                }]}
                                                resizeMode="contain"
                                            />
                                        </ScrollView>
                                    ))
                                ) : (
                                    <Image
                                        source={require('./homeimages/ImageUpload.jpeg')}
                                        resizeMode="cover"
                                        style={{ width: 200, height: 200, borderRadius: 10, opacity: 0.8 }}
                                    />
                                )}

                            </TouchableOpacity>
                        </>
                    )}
                    {/* Select Date */}
                    <Text style={styles.label}>{t('Select Date')} *</Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                        <Text style={styles.dateText}>

                            {/* { date ? date.toLocaleDateString() : 'Select Date' } */}
                            {date.toDateString()}

                        </Text>
                        <Feather name="calendar" size={20} color="black" />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={reportType === 'Test' ? handleTestReportSubmit : handleHPVReportSubmit}
                            disabled={loading || !reportType}
                            style={[styles.submitBtn, loading && { opacity: 0.6 }, !reportType && { opacity: 0.6 }]}>
                            {loading ? <ActivityIndicator color={'#fff'} size={20} /> : (<Text style={styles.btnText}>{t('Submit')}</Text>)
                            }

                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.9}
                     
                            onPress={handleReset}
                            style={styles.cancelBtn}

                            >
                            <Text style={[styles.btnText,]}>{t("Reset")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

export default UploadReport;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#fff',
        fontWeight: '600',
        marginLeft: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        flex: 1,
        color: '#fff',

    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
    },
    uploadBtn: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    uploadBtnText: {
        color: 'black',
        fontWeight: '600',
    },
    previewImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    datePicker: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#eee',
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitBtn: {
        flex: 1,
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#dc3545',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',

    },
    btnText: {
        color: '#fff',
        fontWeight: '600',
    },
    pickerText: {
        color: '#fff',
        fontSize: 16,
    },
   
    uploadBtnView: {
        // backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        // shadowColor: '#000',
        // shadowOpacity: 0.1,
        // shadowOffset: { width: 0, height: 2 },
        // elevation: 3,
    }
});
