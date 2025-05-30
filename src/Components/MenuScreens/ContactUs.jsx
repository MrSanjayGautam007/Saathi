import { ActivityIndicator, Alert, StatusBar, StyleSheet, Text, View, useWindowDimensions, Linking, TouchableOpacity } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../Header';
import api from '../../APIServices/api';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../context/LanguageContext';
import Spinner from 'react-native-spinkit';
import { useFocusEffect } from '@react-navigation/native';


const ContactUs = () => {
    const { width, height } = useWindowDimensions();
    const [loading, setLoading] = useState(false);
    const [contactUs, setContactUs] = useState([]);

    const { t } = useLanguage();
    const handleCall = () => {
        if (contactUs?.mobile) {
            Linking.openURL(`tel:${contactUs.mobile}`);
        }
    };

    const handleEmail = () => {
        if (contactUs?.email) {
            Linking.openURL(`mailto:${contactUs.email}`);
        }
    };

    useEffect(() => {
        const getContactUs = async () => {
            try {

                setLoading(true);

                const response = await api.get('/contact-us');
                const result = response.data;

                if (result.success) {
                    // Only update if data has changed
                    const latestData = result.data;
                    setContactUs(latestData);
                    await AsyncStorage.setItem("contactInfo", JSON.stringify(latestData));
                    console.log("Contact info updated from API.");
                } else {
                    Alert.alert("Error", result.msg || "Unable to fetch contact info.");
                }
            } catch (error) {
                console.error("Error loading contact info:", error);
                Alert.alert("Error", "Something went wrong. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        getContactUs();
    }, []);
    useFocusEffect(
        React.useCallback(() => {
          StatusBar.setBackgroundColor('#6A6BBF'); 
          StatusBar.setBarStyle('light-content');
        }, [])
      );
    return (
        <SafeAreaView style={[styles.mainView, { height: height, width: width }]}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />
            <Header title={t('Contact Us')} textColor={'#fff'} iconColor={"#fff"} />
            <View style={styles.containerView} >
                {loading ? (
                  
                    <ActivityIndicator size="large" color="#fff" style={styles.centered} />
                ) : contactUs ? (
                    <View style={styles.card}>

                        {/* Mobile */}
                        <Text style={styles.label}>{t('Mobile')}:</Text>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.row} onPress={handleCall}>
                            <Icon name="phone" size={20} color="#4F46E5" />
                            <Text style={styles.value}>{contactUs?.mobile}</Text>
                        </TouchableOpacity>

                        {/* Email */}
                        <Text style={styles.label}>{t('Email')}:</Text>
                        <TouchableOpacity
                            activeOpacity={0.7}

                            style={styles.row} onPress={handleEmail}>
                            <Icon name="mail" size={20} color="#4F46E5" />
                            <Text style={styles.value}>{contactUs?.email}</Text>
                        </TouchableOpacity>

                        {/* Address */}
                        <Text style={styles.label}>{t('Address')}:</Text>
                        <View style={styles.row}>
                            <Icon name="map-pin" size={20} color="#4F46E5" />
                            <Text style={styles.value}>{contactUs?.address}</Text>
                        </View>

                        {/* Working Days */}
                        <Text style={styles.label}>{t('Working Days')}:</Text>
                        <View style={styles.row}>
                            <Icon name="calendar" size={20} color="#4F46E5" />
                            <Text style={styles.value}>{contactUs?.weeks}</Text>
                        </View>

                        {/* Working Hours */}
                        <Text style={styles.label}>{t('Working Hours')}:</Text>
                        <View style={styles.row}>
                            <Icon name="clock" size={20} color="#4F46E5" />
                            <Text style={styles.value}>{contactUs?.times}</Text>
                        </View>

                    </View>
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>{t('No contact info found')}.</Text>
                )}
            </View>
        </SafeAreaView>
    )
}

export default ContactUs

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: 5,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        margin: 16,
        elevation: 5, // For shadow on Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 }, // For shadow on iOS
        shadowOpacity: 0.1,
        shadowRadius: 6,
        width: '90%',

    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: 'black',
        marginTop: 16,
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 10,
    },
    value: {
        fontSize: 16,
        color: '#111827',
        marginLeft: 12,
        flex: 1,
        flexWrap: 'wrap',
    },
    containerView: {
        // backgroundColor: "#FFFFFF",
        // height: 431,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})