
import React, { use, useEffect } from 'react';
import { ImageBackground, StatusBar, View, Dimensions, Platform, Text, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = () => {
    const navigation = useNavigation();
    // const { width, height } = Dimensions.get('window');
    const { height, width } = useWindowDimensions();
    const adjustedHeight = Platform.OS === 'android' ? height + StatusBar.currentHeight : height;

    useEffect(() => {
        let timer;
        const checkAppFlow = async () => {
            const language = await AsyncStorage.getItem("APP_LANGUAGE");
            const token = await AsyncStorage.getItem("userToken");
            const user = await AsyncStorage.getItem("user");

            if (!language) {
                timer = setTimeout(() => {
                    navigation.replace("Language"); //  First time
                }, 1500);

            } else if (user) {
                // User is logged in and language is set
                timer = setTimeout(() => {
                    navigation.replace("MyHome"); //  Logged in
                }, 1500);
                
            } else {
                // User is not logged in but language is set
                timer = setTimeout(() => {
                    navigation.replace("Login"); //  Language selected, but not logged in
                }, 1500);

            }
        };

        checkAppFlow();
        return () => {
            if (timer) clearTimeout(timer); // Cleanup timer
        };
    }, []);

    return (

        <ImageBackground
            source={require('../assets/images/SplashScreens.png')}
            resizeMode="cover"
            style={{
                //  width: width,
                width: '100%',
                height: adjustedHeight,

                flex: 1,
            }}
        >
            <SafeAreaView>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            </SafeAreaView>
        </ImageBackground>


    );
};

export default SplashScreen;
