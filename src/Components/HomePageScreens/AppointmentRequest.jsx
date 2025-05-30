import { Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View, Modal, LayoutAnimation, Platform, UIManager, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Header from '../Header'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../APIServices/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomAlertModal from './CustomAlertModal'
import { Button } from 'react-native-paper';


const LoginScreen = () => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const [poid, setPOID] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [showModalSuccess, setShowModalSuccess] = useState(false);
    const [showModalFailed, setShowModalFailed] = useState(false);
    const [badPOID, setBadPOID] = useState(false);
    const [badMobile, setBadMobile] = useState(false);
    const [badName, setBadName] = useState(false);
    const [badAge, setBadAge] = useState(false);
    const [successMessage, setSuccessMessage] = useState('')
    const [failedMessage, setFailedMessage] = useState('')
    const { t } = useLanguage();

    useEffect(() => {

        const getUser = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                if (user) {
                    const parsedUser = JSON.parse(user);
                    setPOID(parsedUser.po_id);
                    console.log("User POID:", parsedUser.po_id);
                }

            } catch (error) {
                console.error("Error retrieving user data:", error);
            }
        }
        getUser();
    }, []);
    // <Modal 
    // transparent={true}
    //     visible={showModal}
    //     onRequestClose={() => setModalShow(!showModal)}
    //     animationType="fade">
    //     <View style={styles.centerView}>
    //         <View style={styles.modalView}>
    //             <Text style={styles.modalText}>{successMessage}</Text>

    //             {/* <TouchableOpacity onPress={() => setModalShow(false)} style={styles.modalButton}>
    //                 <Text style={styles.modalButtonText}>{t('OK')}</Text>
    //             </TouchableOpacity> */}
    //         </View>
    //     </View>
    // </Modal>
    const handleAppointment = async () => {
        // if (!poid.trim()) {
        //     setBadPOID(true);
        //     return;

        // }
        if (!name.trim()) {
            setBadName(true);
            return;
        }
        if (!age.trim()) {
            setBadAge(true);
            return;
        }
        if (!mobile.trim()) {
            setBadMobile(true);
            return;
        }

        setLoading(true);
        // const user = await AsyncStorage.getItem("user");
        // console.log(user);
        console.log(poid, name, age, mobile);
        try {
            const response = await api.post('/submit-appointment', {

                po_id: poid,
                name: name,
                age: age,
                mobile: mobile,
            });


            const result = response.data;
            // console.log("Appointment result:", result);
            if (result.success) {

                setShowModalSuccess(true); // or use Alert.alert
                setSuccessMessage(result.msg || 'Your Appointment request has been sent. Admin will contact you soon')
                setName('');
                setAge('');
                setMobile('');
                // Alert.alert("Success", result.msg); //  show success from API         
            } else {

                // Alert.alert("Error", result.msg || "Something went wrong.");
                setShowModalFailed(true)
                setFailedMessage(result.msg || "Something went wrong.")

            }

        } catch (error) {
            console.error("Appointment error:", error);

            setShowModalFailed(true)
            setFailedMessage("Network Error. Please check your connection and try again.")
        } finally {
            setLoading(false);
        }
    };

    const textFill = (text, fieldName) => {

        if (fieldName === 'name') {
            setName(text);
            setBadName(false);
            return
        }
        else if (fieldName === 'age') {
            setAge(text);
            setBadAge(false);
            return;
        }
        else {
            setMobile(text)
            setBadMobile(false)
        }

    }
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBackgroundColor('#6A6BBF');
            StatusBar.setBarStyle('light-content');
        }, [])
    );
    return (
        <SafeAreaView style={styles.mainView} >
            <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />
            <Header title={t('Request an Appointment')} textColor={"#fff"} iconColor={'#fff'} />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.containerView, {

                    height: badAge || badName || badMobile ? 400 : 350,

                }]}>
                    <View
                        style={styles.inputFieldView}
                    >
                        <TextInput placeholder={t('Name')} style={styles.inputStyle}
                            placeholderTextColor={'#6A6BBF'}
                            value={name}
                            // onChangeText={setName}
                            onChangeText={(text) => textFill(text, 'name')}
                            maxLength={20}

                        />
                    </View>
                    {badName && (<Text style={styles.badText}>{t('The name field is required')}</Text>)}

                    <View style={styles.inputFieldView}>
                        <TextInput
                            placeholder={t('Age')}
                            style={styles.inputStyle}
                            placeholderTextColor={'#6A6BBF'}
                            keyboardType='numeric'
                            value={age}
                            // onChangeText={setAge}
                            onChangeText={(text) => textFill(text, 'age')}
                            maxLength={2}
                        />
                    </View>
                    {badAge && (<Text style={styles.badText}>{t('The age field is required')}</Text>)}
                    <View style={styles.inputFieldView}>
                        <TextInput placeholder={t('Phone Number')} style={styles.inputStyle}
                            keyboardType='numeric'
                            placeholderTextColor={'#6A6BBF'}
                            value={mobile}
                            // onChangeText={setMobile}
                            onChangeText={(text) => textFill(text, 'mobile')}
                            maxLength={10}

                        />
                    </View>
                    {badMobile && (<Text style={styles.badText}>{t('The mobile field is required')}</Text>)}

                    <View style={styles.submitContainer}>

                        {/* <TouchableOpacity
                            onPress={handleAppointment}
                            style={[styles.btnContainer, { backgroundColor: '#6A6BBF' }]}

                        >
                            {loading ? <ActivityIndicator color={'#fff'} size={20} /> : (<Text style={[styles.btnText, { color: '#fff' }]}>{t('Submit')}</Text>)
                            }

                        </TouchableOpacity> */}
                        <Button
                            mode='elevated'
                            onPress={handleAppointment}
                            // loading={loading}
                            disabled={loading} // Disable button while loading
                            style={[styles.btnContainer, { backgroundColor: '#6A6BBF' }]}
                        > {loading ? <ActivityIndicator color={'#fff'} size={20} /> : (<Text style={[styles.btnText, { color: '#fff' }]}>{t('Submit')}</Text>)
                            }</Button>
                        {/* <TouchableOpacity style={[styles.btnContainer, { backgroundColor: '#E5E5FE' }]}

                            onPress={() => navigation.goBack()}
                        >
                            <Text style={[styles.btnText, { color: 'black' }]}>{t('Cancel')}</Text>
                        </TouchableOpacity> */}
                        <Button
                            mode='elevated'
                            onPress={() => navigation.goBack()}
                        // style={[styles.btnContainer, { backgroundColor: '#E5E5FE', width: 110, }]}
                        > <Text style={[styles.btnText, { color: 'black' }]}>{t('Cancel')}</Text></Button>

                    </View>

                </View>

            </ScrollView>

            <CustomAlertModal
                visible={showModalSuccess}
                message={successMessage || 'Your Appointment request has been sent. Admin will contact you soon'}
                title={'Success'}
                type='success'
                // showCancel={true}
                autoDismiss={true}
                dismissTime={5000}
                onClose={() => setShowModalSuccess(!showModalSuccess)}
                onPress={() => setShowModalSuccess(!showModalSuccess)}
            // onBackButtonPress={() => setShowModalSuccess(!showModalSuccess)}

            />
            <CustomAlertModal
                visible={showModalFailed}
                message={failedMessage}
                title={'Error'}
                type='error'
                showCancel={true}
                autoDismiss={true}
                dismissTime={3000}
                onClose={() => setShowModalFailed(!showModalFailed)}
                onPress={() => setShowModalFailed(!showModalFailed)}
            // onBackButtonPress={() => setShowModalFailed(!showModalFailed)}

            />

        </SafeAreaView>

    )
}

export default LoginScreen

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',

    },
    containerView: {
        backgroundColor: "#FFFFFF",
        height: 500,
        width: 328,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5,
        justifyContent: 'center',

        // padding: 40,
    },
    inputFieldView: {
        width: 295,
        height: 54,
        borderRadius: 16,
        borderColor: '#6A6BBF',
        borderWidth: 1,
        borderRadius: 16,
        // marginTop: 10,
        marginVertical: 10,
    },
    inputStyle: {
        width: '90%',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 28,
        marginLeft: 20,
        color: '#6A6BBF',
        fontFamily: 'Roboto',
        flex: 1,

    },

    submitContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 20,
    },
    btnContainer: {
        width: 100,
        height: 40,
        // backgroundColor: '#6A6BBF',
        borderRadius: 56,
        alignItems: 'center',
        justifyContent: 'center',
        // borderColor: '#6A6BBF',
        // borderWidth: 1,
        gap: 34,
        elevation: 5,
    },
    btnText: {
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 28,
        color: '#6A6BBF',
        fontFamily: 'Roboto',
        textAlign: 'center',
    },
    // modal styles
    centerView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        height: 120,
        width: '75%',
        alignItems: "center",
        justifyContent: "center",

    },
    modalText: {
        // marginBottom: 5,
        textAlign: "center",
        fontSize: 15,
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
        // marginBottom: 5,
    }
})
