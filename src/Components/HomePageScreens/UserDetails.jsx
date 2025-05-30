
import { StyleSheet, Text, useWindowDimensions, View, TouchableOpacity, StatusBar, ScrollView, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
import Spinner from 'react-native-spinkit';
import NetworkStatusToast from './NetworkStatusToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';

const UserDetails = () => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
   const [fcmToken, setFcmToken] = useState('');
    const { t } = useLanguage();
    useEffect(() => {
        const getFCMToken = async () => {
            // const token = await getFCMToken();
            const token = await AsyncStorage.getItem('fcmToken');
            setFcmToken(token);
            copyToClipboard(token);
            console.log('FCM Token:', token);
        }
        getFCMToken();
       
    }, []);
    const copyToClipboard = (fcmCopy) => {
        Clipboard.setString(fcmCopy);
        // Alert.alert('Success','FCM token copied to clipboard!');
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
            <Header title={t('Your details')} textColor={'#fff'} iconColor={'#fff'} />
            {/* <Text style={styles.header}>User Details</Text> */}
            {/* <ScrollView contentContainerStyle={styles.containerView}> */}
            <View style={styles.sectionContainer}
            >
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('CoreProforma')}
                    style={styles.sectionBox}>
                    <Text style={styles.sectionText}>Core Proforma</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    onPress={() => navigation.navigate('PoTobaccoProforma')}

                    style={styles.sectionBox}>

                    <Text style={styles.sectionText}>Po Tobacco Proforma</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('PoFemaleProforma')}
                    style={styles.sectionBox}>
                    <Text style={styles.sectionText}>Po Female Proforma</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    onPress={() => navigation.navigate('FollowUp')}
                    style={styles.sectionBox}>
                    <Text style={styles.sectionText}>Follow Up</Text>
                </TouchableOpacity> */}
            </View>
           

        </SafeAreaView>
    );
}

export default UserDetails;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingHorizontal: 10,
    },

    sectionContainer: {
        height: '80%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionBox: {
        backgroundColor: '#fff',
        width: '90%',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    sectionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    containerView: {
        backgroundColor: "#FFFFFF",
        height: 431,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    
});
