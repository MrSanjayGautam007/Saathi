// src/Services/NotificationService.js

import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance, AndroidStyle, AndroidVisibility } from '@notifee/react-native';
// Initialize messaging
const app = getApp();
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
    try {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 33) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    {
                        title: 'Notification Permission Required',
                        message: 'This app needs to show notifications',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Android 13+: Notification permission granted');
                    getFCMToken();
                } else {
                    Alert.alert('Permission Denied');
                }
            } else {
                console.log('Android <13: Permission auto granted');
                getFCMToken();
            }
        } else if (Platform.OS === 'ios') {
            const settings = await notifee.requestPermission();

            if (
                settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
                settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
            ) {
                console.log('iOS: Notification permission granted');
                getFCMToken();
            } else {
                Alert.alert('Permission Denied on iOS');
            }
        }
    } catch (error) {
        console.warn('Permission request error:', error);
    }
};
export const getFCMToken = async () => {
    try {
        const token = await messaging.getToken();
        console.log('FCM Token:', token);
        if (token) {
            // Save the token to AsyncStorage
            await AsyncStorage.setItem('fcmToken', token);
        } else {
            console.log('No FCM token received');
        }
        return token;
    } catch (error) {
        console.warn('FCM token error:', error);
    } finally {
        console.log('FCM token retrieval complete');
    }
};
export const listenForForegroundNotifications = () => {
    return onMessage(messaging, async remoteMessage => {
        console.log('New foreground FCM message:', remoteMessage);
        // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage)); 
        // Display a notification using Notifee
        await onDisplayNotification(remoteMessage);
    });
};
export const onDisplayNotification = async (remoteMessage) => {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'notification', 

    });
    // Display a notification
    const imageUrl = remoteMessage.notification?.android?.imageUrl;
    console.log('Image URL:', imageUrl);
    await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
            channelId,
            smallIcon: 'ic_launcher',
            ...(imageUrl
                ? {
                    style: {
                        type: AndroidStyle.BIGPICTURE,
                        picture: imageUrl,
                    },
                }
                : {}),
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
                id: 'default',
            },
            // autoCancel: true, // dismisses banner automatically after few seconds
        },
    });
}


