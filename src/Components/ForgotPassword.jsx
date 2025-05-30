import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View, Modal, ActivityIndicator, Alert, TouchableWithoutFeedback, ScrollView } from 'react-native'
import React, { useState, useTransition } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BlurView } from "@react-native-community/blur";
import { useLanguage } from '../context/LanguageContext';
import api from '../APIServices/api';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ForgotPassword = () => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const [poid, setPOID] = useState('');
    const [showModal, setModalShow] = useState(false);
    const [badPOID, setBadPOID] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [poidError, setPOIDError] = useState('');
    const [onFocus, setOnFocus] = useState(false);
    const { t } = useLanguage();

    const handleResetPassword = async () => {
        const userData = await AsyncStorage.getItem('user');
        let timer;
        if (!poid.trim()) {
            setBadPOID(true);
            return;
        }
        setLoading(true);
        try {
            const response = await api.post('/password-reset-request', {
                po_id: poid
            });
            const result = response.data;

            if (result.success) {
                setMessage(result.msg);
                setModalShow(true);
                timer = setTimeout(() => {
                    if (userData) {
                        navigation.goBack();
                    } else {
                        navigation.replace('Login'); //  user exists
                    }
                }, 4000);
            } else {
                const msg = result.msg?.toLowerCase() || "";

                if (msg.includes("poid not found")) {
                    setPOIDError("POID does not exist.");
                    // Alert.alert("PO ID Error", "PO ID does not exist. Please check and try again.");
                } else {
                    // Alert.alert("Error", result.msg || "Something went wrong.");
                    // Alert.alert("PO ID Error", "PO ID does not exist. Please check and try again.");
                    setMessage("PO ID does not exist. Please check and try again.");
                    setModalShow(true);
                }
            }
        } catch (error) {
            if (error.message === "Network Error") {
                Alert.alert("Network Error", "No internet connection. Please check your connection and try again.");
            } else {
                console.log("Password reset exception:", error);
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
        if (timer) {
            return () => clearTimeout(timer);
        }
    };
    const textFill = (text, fieldName) => {

        if (fieldName === 'POID') {
            setPOID(text);
            setBadPOID(false);
            return;
        }
    }
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBackgroundColor('#6A6BBF');
            StatusBar.setBarStyle('light-content');
        }, [])
    );
    return (
        <SafeAreaView style={[styles.mainView, { height, width }]}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />
            <Header title={t('Reset Password')} textColor={'#fff'} iconColor={'#fff'} />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', }}
                style={{ width: '95%', }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}

            >
                <View style={[styles.containerView,]}>
                    <View style={styles.textContainer}>
                        <Text style={styles.resetPassText}>{t('Reset Password')}</Text>
                        <Text style={styles.passText}>{t('Enter the POID number associated with this account and click submit')}</Text>
                    </View>
                    <View style={[styles.passwordView, onFocus && { borderColor: 'red' }]}>
                        <TextInput placeholder={t('POID')} style={styles.inputStyle}
                            placeholderTextColor={'#6A6BBF'}
                            value={poid}
                            onChangeText={(text) => textFill(text, 'POID')}
                            onFocus={() => setOnFocus(true)}
                        // autoFocus={true}

                        />
                    </View>
                    {badPOID && (<Text style={styles.badText}>{t('The po id field is required')}</Text>)}
                    <TouchableOpacity
                        onPress={handleResetPassword}
                        activeOpacity={0.9}
                        style={[styles.btnContainer, { backgroundColor: poid ? "#6A6BBF" : '#E5E5FE' }]}>
                        {loading ? (
                            <ActivityIndicator color={'#fff'} size={20} />
                        ) : (<Text style={[styles.btnText, { color: poid ? '#fff' : 'black', }]}>{t('Submit')}</Text>)}
                    </TouchableOpacity>
                </View>
            </ScrollView>



            <Modal transparent={true}
                visible={showModal}
                onRequestClose={() => setModalShow(!showModal)}
                animationType="fade"
                hardwareAccelerated={true}
                statusBarTranslucent={true}
                presentationStyle="overFullScreen"
            >
                <TouchableWithoutFeedback onPress={() => setModalShow(!showModal)}>
                    <View style={styles.centerView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{message}</Text>
                            {/* <TouchableOpacity onPress={() => setModalShow(false)} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>{t('OK')}</Text>
                        </TouchableOpacity> */}
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        alignItems: 'center',
        paddingHorizontal: 10,

    },
    containerView: {
        backgroundColor: "#FFFFFF",
        height: 431,
        width: '100%',
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5,


    },
    passwordView: {
        width: '90%',
        height: 54,
        borderRadius: 16,
        borderColor: '#6A6BBF',
        borderWidth: 2,
        borderRadius: 16,
        marginTop: 30
        // marginVertical: 30
    },
    inputStyle: {
        width: '90%',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 28,
        marginLeft: 20,
        color: '#6A6BBF',
        fontFamily: 'Roboto',
    },
    btnText: {
        fontWeight: '600',
        fontSize: 14,
        // lineHeight: 28,
        color: '#6A6BBF',
        fontFamily: 'Roboto',
        textAlign: 'center',
    },
    textContainer: {
        marginTop: 70,
        width: 285,
        height: 40,
        marginBottom: 30,
    },
    btnContainer: {
        width: 216,
        height: 40,

        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        elevation: 5,
        marginTop: 80,
        // borderColor: '#6A6BBF',
        // borderWidth: 1,
        // gap: 34,
        //  backgroundColor: '#6A6BBF',

    },
    resetPassText: {
        fontSize: 24,
        fontWeight: '500',
        lineHeight: 32,
        // fontFamily:'Roboto'
    },
    passText: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 5,
    },
    // Modal styles
    centerView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalView: {
        backgroundColor: "white",
        padding: 35,
        borderRadius: 20,
        shadowColor: "#000",
        // For android
        elevation: 10,
        //for ios
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        // height: 300,
        width: '75%',
        alignItems: "center",
        justifyContent: "center",
        minHeight: 170,
        maxHeight: 300,

    },
    modalText: {
        // marginBottom: 15,
        textAlign: "center",
        fontSize: 16,
        fontWeight: '500',
        // lineHeight: 20,
        color: 'black'
    },
    modalButton: {
        backgroundColor: "#6A6BBF",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
        // marginTop: 10,
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    badText: {
        color: 'red',
        alignSelf: 'flex-start', 
        marginLeft: 20,
        marginVertical: 5,
       
    }
   

})