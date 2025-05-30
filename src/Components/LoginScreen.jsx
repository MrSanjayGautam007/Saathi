import { ActivityIndicator, Alert, BackHandler, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message';
import { useLanguage } from '../context/LanguageContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../APIServices/api'
import Feather from 'react-native-vector-icons/dist/Feather';
import Clipboard from '@react-native-clipboard/clipboard';
const LoginScreen = () => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const [po_id, setPOID] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [poidError, setPOIDError] = useState("");
    const [badPOID, setBadPOID] = useState(false);
    const [badPassword, setBadPassword] = useState(false);
    const [fcmToken, setFCMToken] = useState(null);
    const [showPassword, setShowPassword] = useState(true);
    const { t } = useLanguage();
    const passwordRef = useRef(null); // reference to password input
    useEffect(() => {

        const getfcmToken = async () => {
            const fcmToken = await AsyncStorage.getItem('fcmToken');
            console.log('FCM Token:', fcmToken);
            setFCMToken(fcmToken);
        }

        getfcmToken();
    }, []);
    const handleLogin = async () => {
        if (!po_id.trim()) {
            setBadPOID(true);
            return;
        }
        if (!password.trim()) {
            setBadPassword(true);
            return;
        }
        setLoading(true);

        try {
            const response = await api.post('/po-login', {
                po_id,
                password,
                firebase_token: fcmToken,
            });
            const result = response.data;
            if (result.success) {
                // Save user data
                const userData = {
                    id: result.id,
                    po_id: result.po_id
                };

                await AsyncStorage.setItem("user", JSON.stringify(userData));
                setTimeout(() => {
                    Toast.show({
                        type: 'Success',
                        text1: result.msg || "Login successful!",
                    });
                    navigation.replace("MyHome");
                }, 1000);
            } else {
                const message = result.msg?.toLowerCase() || "";

                if (message.includes("poid not found")) {
                    setPOIDError("POID does not exist.");
                    Alert.alert("Login Failed", "PO ID does not exist. Please check and try again.");
                } else if (message.includes("blocked")) {
                    Alert.alert("Account Blocked", "You have been blocked. Please contact Admin.");
                } else if (message.includes("invalid password")) {
                    Alert.alert("Login Failed", "Incorrect password. Please try again.");
                } else {
                    Alert.alert("Login Failed", result.msg || "Login failed.");
                }
            }
        } catch (error) {
            if (error.message === "Network Error") {
                Alert.alert("Network Error", "No internet connection. Please check your connection and try again.");
            } else {
                console.log("Login exception:", error);
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    const textFill = (text, fieldName) => {

        if (fieldName === 'POID') {
            setPOID(text);
            setBadPOID(false);
            return
        }
        else if (fieldName === 'password') {
            setPassword(text);
            setBadPassword(false);
            return;
        }
    }
    const handleExit = () => {
        if (Platform.OS === "android") {
            BackHandler.exitApp(); // Exit app on Android
        } else {
            Alert.alert("Not Allowed", "iOS does not allow apps to exit programmatically.");
        }
    };
    useFocusEffect(
        React.useCallback(() => {
          StatusBar.setBackgroundColor('#6A6BBF'); 
          StatusBar.setBarStyle('light-content');
        }, [])
      );
    return (
        <SafeAreaView style={[styles.mainView, { height: height, width: width }]} >
            <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />

            <View style={styles.containerView}>
                <View
                    style={styles.poidView}
                >
                    <TextInput placeholder={t('POID')} style={styles.inputStyle}
                        placeholderTextColor={'#6A6BBF'}
                        value={po_id}
                        onChangeText={(text) => textFill(text, 'POID')}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()} // jump to next field
                        blurOnSubmit={false}
                    />
                </View>
                {badPOID && (<Text style={styles.badText}>{t('POID is required')}</Text>)}
                <View style={styles.passewordView}>
                    <TextInput placeholder={t('Password')} style={styles.inputStyle}
                        placeholderTextColor={'#6A6BBF'}
                        value={password}
                        ref={passwordRef}
                        onChangeText={(text) => textFill(text, 'password')}
                        secureTextEntry={showPassword}
                        textContentType='password'
                        returnKeyType="done"
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType='password'
                        onSubmitEditing={() => handleLogin()}
                        blurOnSubmit={true}

                    />
                    {
                        password && (<TouchableOpacity
                            activeOpacity={0.7}
                            style={{ marginRight: 10 }}
                            onPress={() => setShowPassword(!showPassword)}>
                            {
                                showPassword ? (<Feather name='eye' size={20} color={'#6A6BBF'} />) : (<Feather name='eye-off' size={20} color={'#6A6BBF'} />)
                            }
                        </TouchableOpacity>)
                    }


                </View>
                {badPassword && (<Text style={styles.badText}>{t('Password is required')}</Text>)}
                <View style={styles.forgotView}>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>

                        <Text style={styles.forgotText}>{t('Forgot your password? Click Here')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.loginContainer}>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleLogin}
                        style={[styles.btnContainer, { backgroundColor: '#6A6BBF' }]}
                    disabled={loading} // Disable button while loading

                    >
                        {loading ? (
                            <ActivityIndicator color={'#fff'} size={20} />
                        ) : (<Text style={[styles.btnText, { color: '#fff', }]}>{t('Login')}</Text>)}

                    </TouchableOpacity>
                    {
                        Platform.OS === 'android' && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleExit}
                                // onPress={() => navigation.navigate('MyHome')}
                                style={[styles.btnContainer, { backgroundColor: '#E5E5FE' }]}>
                                <Text style={[styles.btnText, { color: 'black' }]}>{t('Cancel')}</Text>
                            </TouchableOpacity>
                        )
                    }

                </View>
            </View>

        </SafeAreaView>

    )
}

export default LoginScreen

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerView: {
        backgroundColor: "#FFFFFF",
        height: 380,
        width: 328,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5,
        // justifyContent: 'center',
        // padding: 40,
    },
    poidView: {
        width: 295,
        height: 54,
        borderRadius: 16,
        borderColor: '#6A6BBF',
        borderWidth: 2,
        borderRadius: 16,
        marginTop: 70,
    },
    passewordView: {
        width: '90%',
        height: 54,
        borderRadius: 16,
        borderColor: '#6A6BBF',
        borderWidth: 2,
        borderRadius: 16,
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
    ,
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
    forgotView: {
        // justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 20,

    },
    forgotText: {

        fontWeight: '400',
        fontSize: 14,
        // lineHeight: 15,
        color: 'black',
        fontFamily: 'Roboto',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 60,
    },
    btnContainer: {
        width: 118,
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
        // lineHeight: 28,
        color: '#6A6BBF',
        fontFamily: 'Roboto',
        textAlign: 'center',
    },
    badText: {
        color: 'red',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginVertical: 5,
    }
})