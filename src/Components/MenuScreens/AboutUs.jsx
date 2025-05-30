import { ActivityIndicator, StatusBar, StyleSheet, Text, View, useWindowDimensions, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../Header';
import api from '../../APIServices/api';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../context/LanguageContext';
import Spinner from 'react-native-spinkit';
import { useFocusEffect } from '@react-navigation/native';


const AboutUs = () => {

    const { width, height } = useWindowDimensions();
    const [aboutUs, setAboutUs] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();
 
    useEffect(() => {
        const getAboutUs = async () => {
            // const storedData = await AsyncStorage.getItem("aboutInfo");

            // if (storedData) {
            //     const parsedData = JSON.parse(storedData);
            //     setAboutUs(parsedData);
            //     console.log("Loaded contact from AsyncStorage:", parsedData);
            // } else {
            //     setLoading(true);
            // }

            setLoading(true);
            try {
                const response = await api.get('/about-us');
                const result = response.data;

                if (result?.success) {
                    const content = result.data?.contents; // Correct key
                    setAboutUs(content);
                    console.log('About us:', content);
                    await AsyncStorage.setItem("aboutInfo", JSON.stringify(content));
                } else {
                    console.warn('Failed to fetch About us:', result.msg || 'Unknown error');
                    Alert.alert('Error', result.msg || 'Unable to fetch About us.');
                }
            } catch (error) {
                console.error('Error fetching About us:', error);
                Alert.alert('Network Error', 'Something went wrong. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };
        getAboutUs();
    }, []);

    const tagsStyles = {
        body: {
            color: '#fff', // white text
            fontSize: 16,
            lineHeight: 26,
            fontFamily: 'System',
        },
        p: {
            marginBottom: 16,
            color: '#fff',
        },
        h1: {
            fontSize: 28,
            fontWeight: '700',
            marginBottom: 16,
            color: '#fff',
        },
        h2: {
            fontSize: 24,
            fontWeight: '600',
            marginBottom: 14,
            color: '#fff',
        },
        h3: {
            fontSize: 20,
            fontWeight: '500',
            marginBottom: 12,
            color: '#fff',
        },
        ul: {
            paddingLeft: 20,
            marginBottom: 16,
            color: '#fff',
        },
        li: {
            marginBottom: 10,
            lineHeight: 24,
            color: '#fff',
        },
        a: {
            color: '#00BFFF', // light blue for links
            textDecorationLine: 'underline',
        },
        strong: {
            fontWeight: 'bold',
            color: '#fff',
        },
        em: {
            fontStyle: 'italic',
            color: '#fff',
        },
    };
    useFocusEffect(
        React.useCallback(() => {
          StatusBar.setBackgroundColor('#6A6BBF'); 
          StatusBar.setBarStyle('light-content');
        }, [])
      );
    return (
        <SafeAreaView style={[styles.mainView, { height: height, width: width }]}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />
            <Header title={t('About Us')} textColor={'#fff'} iconColor={"#fff"} />

            {loading ? (
                <ActivityIndicator size="large" color="#fff" style={styles.centered} />
               
            ) : (
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                >
                    {aboutUs ? (
                        <RenderHtml
                            contentWidth={width}
                            source={{ html: aboutUs }}
                            // baseStyle={styles.policyText}
                            tagsStyles={tagsStyles}
                        />
                    ) : (
                        <Text style={styles.policyText}>
                            About us is not available at the moment.
                        </Text>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default AboutUs

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        alignItems: 'center',
        // justifyContent: 'center'
        padding: 5
    },

    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scroll: {
        width: '100%',
    },
    content: {
        padding: 16,
    },
    policyText: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },

})