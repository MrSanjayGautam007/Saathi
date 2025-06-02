import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, useWindowDimensions, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';
import api from '../../APIServices/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../../context/LanguageContext';
import { useFocusEffect } from '@react-navigation/native';
const SBESubmit = () => {
    const [poid, setPoid] = useState('');
    const [breastType, setBreastType] = useState('');
    const [painInBreast, setPainInBreast] = useState('');
    const [skinChange, setSkinChange] = useState('No');
    const [skinChangeType, setSkinChangeType] = useState('');
    const [nippleChange, setNippleChange] = useState('No');
    const [nippleChangeType, setNippleChangeType] = useState('');
    const [lump, setLump] = useState('');
    const [axilla, setAxilla] = useState('');
    const [other, setOther] = useState('');
    const [loading, setLoading] = useState(false);
    const { width, height } = useWindowDimensions();
    const { t } = useLanguage();

    useEffect(() => {
        const getUser = async () => {
            const user = await AsyncStorage.getItem("user");
            if (user) {
                setPoid(JSON.parse(user).po_id);
            }
        };
        getUser();
    }, []);

    const validateForm = () => {
        if (!breastType || !painInBreast || !lump || !axilla) {
            Alert.alert('Error', 'Please answer all required fields.');
            return false;
        }
        if (skinChange === 'Yes' && !skinChangeType) {
            Alert.alert('Error', 'Please select skin change type.');
            return false;
        }
        if (nippleChange === 'Yes' && !nippleChangeType) {
            Alert.alert('Error', 'Please select nipple change type.');
            return false;
        }
        return true;
    };
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);


        const formData = new FormData();
        formData.append('po_id', poid);
        formData.append('breast_type', breastType);
        formData.append('pain_in_breast', painInBreast);
        formData.append('any_obvious_skin_changes', skinChange === 'Yes' ? skinChangeType : 'No');
        formData.append('any_obvious_skin_changes_details', skinChange === 'Yes' ? skinChangeType : 'None');  //  always send something
        formData.append('any_nipple_change', nippleChange === 'Yes' ? nippleChangeType : 'No');
        formData.append('any_nipple_change_details', nippleChange === 'Yes' ? nippleChangeType : 'None');  // always send something
        formData.append('lump', lump);
        formData.append('axilla', axilla);
        formData.append('any_other_specify', other);
        try {
            const res = await api.post('/self-breast-examination', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Accept: 'application/json',
                },
            });

            if (res.data.success) {
                Alert.alert('Success', 'Self Breast Examination Report Submitted!');
                console.log('Submitted Successfully:', res.data);
                // resetForm();
                setBreastType('');
                setPainInBreast('');
                setSkinChange('No');
                setSkinChangeType('');
                setNippleChange('No');
                setNippleChangeType('');
                setLump('');
                setAxilla('');
                setOther('');
            } else {
                Alert.alert('Error', res.data.message || 'Submission failed.');
            }
        } catch (err) {
            console.error('API Error:', err);
            // console.error('API Error:', err.response?.data || err.message);
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };


    const resetForm = () => {
        setBreastType('');
        setPainInBreast('');
        setSkinChange('No');
        setSkinChangeType('');
        setNippleChange('No');
        setNippleChangeType('');
        setLump('');
        setAxilla('');
        setOther('');
        Alert.alert('Success', 'Form reset successfully!');
    };
    useFocusEffect(
        React.useCallback(() => {
          StatusBar.setBackgroundColor('#6A6BBF'); 
          StatusBar.setBarStyle('light-content');
        }, [])
      );
    return (
        <SafeAreaView style={[styles.mainView, { height, width }]}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />
            <Header title={t('SBE Submit')}  textColor={'#fff'} iconColor={'#fff'} />
            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 10,}}
            >
                {/* Breast Type */}
                <Text style={styles.label}>{t('Breast Type')} *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        style={styles.picker}
                        selectedValue={breastType}
                        onValueChange={setBreastType}
                    >
                        <Picker.Item label={t("Select Breast Type")} value="" />
                        <Picker.Item label={t("Left")} value="Left" />
                        <Picker.Item label={t("Right")} value="Right" />
                        <Picker.Item label={t("Both")} value="Both" />

                    </Picker>
                </View>

                {/* Pain in Breast */}
                <Text style={styles.label}>{t("Pain in Breast")} *</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={painInBreast}
                        style={styles.picker}
                        onValueChange={setPainInBreast}>
                        <Picker.Item label={t("Select Pain Type")} value="" />
                        <Picker.Item label={t("Cyclical")} value="Cyclical" />
                        <Picker.Item label={t("Non cyclical")} value="Non cyclical" />
                        <Picker.Item label={t("On touch")} value="On touch" />
                        <Picker.Item label={t("No")} value="No" />
                    </Picker>
                </View>


                {/* Skin Changes */}
                <Text style={styles.label}>{t('Any Obvious Skin Changes')}?</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={skinChange}
                        style={styles.picker}
                        onValueChange={setSkinChange}>
                        <Picker.Item label={t("No")} value="No" />
                        <Picker.Item label={t("Yes")} value="Yes" />
                    </Picker>
                </View>


                {skinChange === 'Yes' && (
                    <>
                        <Text style={styles.label}>{t("Type of Skin Change")}</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={skinChangeType}
                                style={styles.picker}
                                onValueChange={setSkinChangeType}>
                                <Picker.Item label={t("Select Type")} value="" />
                                <Picker.Item label={t("Dimplins")} value="Dimplins" />
                                <Picker.Item label={t("Redness")} value="Redness" />
                                <Picker.Item label={t("Excoriation")} value="Excoriation" />
                                <Picker.Item label={t("Flaky skin")} value="Flaky skin" />
                                <Picker.Item label={t("Orange peel")} value="Orange peel" />
                            </Picker>
                        </View>

                    </>
                )}

                {/* Nipple Changes */}
                <Text style={styles.label}>{t('Any Nipple Change')}?</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={nippleChange}
                        style={styles.picker}
                        onValueChange={setNippleChange}>
                        <Picker.Item label={t("No")} value="No" />
                        <Picker.Item label={t("Yes")} value="Yes" />
                    </Picker>

                </View>

                {nippleChange === 'Yes' && (
                    <>
                        <Text style={styles.label}>{t('Type of Nipple Change')}</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={nippleChangeType}
                                style={styles.picker}
                                onValueChange={setNippleChangeType}>
                                <Picker.Item label={t("Select Type")} value="" />
                                <Picker.Item label={t("Nipple invension")} value="Nipple invension" />
                                <Picker.Item label={t("Nipple Discharge")} value="Nipple Discharge" />
                                <Picker.Item label={t("Soreness of nipple")} value="Soreness of nipple" />
                            </Picker>
                        </View>

                    </>
                )}

                {/* Lump */}
                <Text style={styles.label}>{t("Lump")} *</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={lump}
                        style={styles.picker}
                        onValueChange={setLump}>
                        <Picker.Item label={t("Select Lump")} value="" />
                        <Picker.Item label={t("Yes")} value="Yes" />
                        <Picker.Item label={t("No")} value="No" />
                        <Picker.Item label={t("Multinodularity")} value="Multinodularity" />
                    </Picker>
                </View>


                {/* Axilla */}
                <Text style={styles.label}>{t('Axilla')} *</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={axilla}
                        style={styles.picker}
                        onValueChange={setAxilla}>
                        <Picker.Item label={t("Select Axilla")} value="" />
                        <Picker.Item label={t("No lump")} value="No lump" />
                        <Picker.Item label={t("Lump")} value="Lump" />
                        <Picker.Item label={t("Fullness")} value="Fullness" />
                    </Picker>
                </View>


                {/* Other */}
                <Text style={styles.label}>{t('Any other finding? Specify')}</Text>
                <TextInput
                    value={other}
                    onChangeText={setOther}
                    placeholder={t("Enter details")}
                    style={styles.input}
                    placeholderTextColor={'#fff'}
                />

                {/* Submit */}
                <View style={styles.btnContainer}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleSubmit} style={styles.button} disabled={loading}>
                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>{t('Submit')}</Text>}
                </TouchableOpacity>

                {/* Reset */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={resetForm} style={styles.button}>
                    <Text style={styles.buttonText}>{t('Reset')}</Text>
                </TouchableOpacity>
                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        // alignItems: 'center',
        paddingHorizontal: 10,
    },
    container: {
        // padding: 16,
        backgroundColor: '#6A6BBF',
        flexGrow: 1,
    },

    label: {
        marginTop: 20,
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
        color: '#fff',
    },
    button: {
        backgroundColor: '#baeef5',
        padding: 15, borderRadius: 10,
        alignItems: 'center',
        marginTop: 30
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold'
    },
    pickerContainer: {
        borderWidth: 0.5,
        borderColor: '#000',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 5,
        backgroundColor: '#fff',
    },
    picker: {
        // height: 50,
        color: '#333', // picker text color
    },
    btnContainer:{
 
        justifyContent: 'space-between',
        // marginTop: 20,
        paddingHorizontal: 20,
        marginBottom: 30,
      
       
    }
});

export default SBESubmit;

