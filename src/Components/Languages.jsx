import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';
const Languages = () => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const { changeLanguage, t } = useLanguage();

    const handleSelect = async (lang) => {
        await changeLanguage(lang);
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            navigation.replace('MyHome'); //  user exists
        } else {
            navigation.replace('Login'); //  user needs to login
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

                <View style={styles.selectView}>
                    <Text style={styles.languageText}>Please select your language</Text>
                    <Text style={styles.languageText}>कृपया अपनी भाषा चुनें</Text>
                </View>
                <View style={styles.loginContainer}>
                    <View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.btnContainer, { backgroundColor: '#6A6BBF' ,borderColor: '#fff'}]}
                            // onPress={() => navigation.navigate('Login')}
                            onPress={() => handleSelect('en')}
                        >
                            <Text style={[styles.btnText, { color: '#fff' }]}>E</Text>
                        </TouchableOpacity>
                        <Text style={[styles.bottomLangText, { color: 'black' }]}>English</Text>
                    </View>
                    <View >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.btnContainer, { backgroundColor: '#E5E5FE' }]}
                            // onPress={() => navigation.navigate('Login')}
                            onPress={() => handleSelect('hi')}
                        >
                            <Text style={[styles.btnText, { color: 'black' }]}>हिं</Text>
                        </TouchableOpacity>
                        <Text style={[styles.bottomLangText, { color: '#6A6BBF' }]}>Hindi</Text>
                    </View>

                </View>

            </View>

        </SafeAreaView>

    )
}

export default Languages

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerView: {
        backgroundColor: "#FFFFFF",
        height: 431,
        width: 335,
        borderRadius: 25,
        alignItems: 'center',
        // justifyContent: 'center',
        // padding: 40,
        elevation: 5,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 80,
    },
    selectView: {
        marginTop: 30,
    },
    languageText: {
        fontSize: 20,
        fontWeight: '400',
        fontFamily: 'Roboto',
        marginVertical: 5
    },
    btnContainer: {
        width: 126,
        height: 126,
        // backgroundColor: '#6A6BBF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#6A6BBF',
        borderWidth: 1,
        gap: 34,
        elevation: 5,
        marginBottom: 10,
    },
    btnText: {

        fontWeight: '500',
        fontSize: 40,
        // lineHeight: 50,
        color: '#6A6BBF',
        fontFamily: 'Roboto',
        textAlign: 'center',

    },
    bottomLangText: {
        textAlign: "center",
        width: 126,
        height: 24,
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        // fontFamily:'Roboto'


    }
})