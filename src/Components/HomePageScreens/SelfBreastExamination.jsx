import { ActivityIndicator, Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../Header';
import { useLanguage } from '../../context/LanguageContext';
import Feather from 'react-native-vector-icons/dist/Feather';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import YoutubePlayer from 'react-native-youtube-iframe';

import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../APIServices/api';
import Spinner from 'react-native-spinkit';

const SelfBreastExamination = () => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const videoHeight = (width / 16) * 9; // For 16:9 ratio
    const { t } = useLanguage();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [poid, setPoid] = useState('');
    const [loading, setLoading] = useState(false);
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };
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
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBackgroundColor('#6A6BBF');
            StatusBar.setBarStyle('light-content');
        }, [])
    );
    const handleSubmit = async () => {
        const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
        // console.log("Formatted Date:", formattedDate);
        setLoading(true);
        try {
            const response = await api.post('/save-upcoming-self-breast-examination', {
                po_id: poid,
                date: formattedDate,
            });
            console.log("Response:", response.data);
            const result = response.data;
            if (result.success) {
                // console.log("Self Breast Examination Reminder set successfully");
                Alert.alert('Success', 'Self Breast Examination Reminder set successfully');
            } else {
                // console.log("Failed to set reminder");
                Alert.alert('Failed', 'Failed to set reminder');
            }
        } catch (error) {
            // console.error("Something went wrong Please Check Your internet connection:", error);
            Alert.alert('Error', 'Something went wrong Please Check Your internet connection');
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />

            <SafeAreaView style={[styles.mainView, { width, height }]} >

                <Header title={t('Self Breast Examination')} textColor={'#fff'} iconColor={'#fff'} />
                <ScrollView
                    contentContainerStyle={{
                        alignItems: 'center',
                        paddingBottom: 40,
                    }}
                    showsVerticalScrollIndicator={false}
                    style={styles.containerView}
                    bounces={false}
                >
                    <View >
                        <Image source={require('./homeimages/Selfexam11.png')}
                            style={{ width: 250, height: 250, borderRadius: 10, marginTop: 20 }}
                            resizeMode='cover' />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.headingText}>{t('What is self breast examination?')}</Text>
                        <Text style={styles.SBEText}>{t('Self Breast Examination (SBE) is a simple method where you check your own breasts regularly to look for any lumps, changes, or unusual signs.')}
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setModalVisible(true)}
                        style={styles.btnContainer}>
                        <Feather name='info' size={20} color={'#000'} />
                        <Text style={styles.btnText}>{t('Learn How to Do it')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('SBESubmit')}
                        style={styles.btnContainer}>
                        <Feather name='upload' size={20} color={'#000'} />
                        <Text style={styles.btnText}>{t('Upload Self Breast Examination Report')}</Text>
                    </TouchableOpacity>
                    <View
                        style={styles.setSBEView}
                    >
                        <Text style={styles.setSBEText}>{t('Set Upcoming Self Breast Examination')} *</Text>

                        <Text style={styles.label}>{t('Select Date')} *</Text>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                            <Text style={styles.dateText}>
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

                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleSubmit}
                        style={styles.submitBtn}
                    >
                        {
                            loading ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (<Text style={styles.submitBtnText}>{t('Submit')}</Text>)
                        }

                    </TouchableOpacity>
                    {/* Learn how to do self breast examination */}

                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType='fade'
                        onRequestClose={() => setModalVisible(false)}
                        hardwareAccelerated={true}
                        statusBarTranslucent={true}
                        presentationStyle="overFullScreen"

                    >
                        {/* <TouchableWithoutFeedback onPress={() => setModalVisible(false)}> */}
                            <View style={styles.modalContainer}>
                                {/* <TouchableWithoutFeedback onPress={()=>{}}> */}
                                    <View style={[styles.modalContent,]}>

                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={styles.closeButton}
                                            onPress={() => setModalVisible(!modalVisible)}>
                                            <Feather name='x' size={20} color={'#000'} />
                                        </TouchableOpacity>
                                        <ScrollView
                                            showsVerticalScrollIndicator={false}
                                            contentContainerStyle={{
                                                padding: 10,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%',

                                            }}
                                        >
                                            <Text style={styles.modalText}>{t('Watch the video below to learn how to do self breast examination.')}</Text>

                                            <View style={styles.youtubeVideoView}>

                                                <YoutubePlayer
                                                    height={videoHeight}

                                                    play={false}
                                                    videoId={'biTZmXL0Nu8'}

                                                />
                                            </View>

                                        </ScrollView>
                                    </View>
                                {/* </TouchableWithoutFeedback> */}
                            </View>
                        {/* </TouchableWithoutFeedback> */}
                    </Modal>

                </ScrollView>

            </SafeAreaView>
        </>
    )
}

export default SelfBreastExamination

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        alignItems: 'center',
        padding: 10,
    },
    containerView: {

        height: '100%',
        paddingBottom: 20,
    },
    textContainer: {
        width: '90%',
        height: 147,
        gap: 20,
        marginTop: 20,
    },
    headingText: {
        fontWeight: '400',
        fontSize: 20,
        color: '#fff',
        alignSelf: 'flex-start'
    },
    SBEText: {

        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        color: '#fff',
        textAlign: 'left',
        marginTop: 10,

    },
    btnContainer: {
        width: '100%',
        height: 40,
        gap: 14,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        elevation: 10,

    },
    btnText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '600',

    },

    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // width: '100%',
        // height: 700,
        // overflow: 'hidden',
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        height: '65%',
        // padddingTop: 60, 
    },
    closeButton: {
        alignSelf: 'flex-start',
        marginBottom: 10,
        backgroundColor: '#fff',
        height: 30,
        width: 30,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: 20,
        marginLeft: 10,

    },
    closeButtonText: {
        fontSize: 16,
        color: '#000',
    },
    modalText: {
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
        // marginTop: 10,
        // textAlign: 'center',

    },
    modalButton: {
        marginTop: 20,
        backgroundColor: '#6A6BBF',
        padding: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    SBEProcessText: {
        fontFamily: 'Roboto',
        fontWeight: '500',
        fontSize: 16,
        // lineHeight: 20,
        color: '#000000',
        textAlign: 'left',
        marginTop: 10,
        paddingVertical: 5,
    },
    youtubeVideoView: {
        width: '100%',
        height: 350,
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        // alignItems: 'center',
        // marginTop: 10,
        // elevation: 5,
    },
    setSBEView: {
        width: '100%',
        height: 120,
        gap: 14,
        borderRadius: 50,
        marginBottom: 20,
        marginLeft: 10,
        alignItems: 'center',
        // justifyContent: 'center',

    },
    setSBEText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    datePicker: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#eee',
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        width: '85%',

    },
    dateText: {
        fontSize: 16,
        color: '#000',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
        fontWeight: '600',
        alignSelf: 'flex-start',

    },
    submitBtn: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        marginVertical: 20,
    },
    submitBtnText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
    }
})