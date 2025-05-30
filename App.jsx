import { Alert, PermissionsAndroid, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AppNav from './src/Components/AppNav'
import { LanguageProvider } from './src/context/LanguageContext'
import Toast from 'react-native-toast-message';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging';
import { listenForForegroundNotifications, requestNotificationPermission } from './src/Firebase_Notifications/NotificationService'

// 🆕 Modular imports
// import { getApp } from '@react-native-firebase/app';
// import { getMessaging, onMessage } from '@react-native-firebase/messaging';

const App = () => {

  useEffect(() => {
    requestNotificationPermission();

    const unsubscribe = listenForForegroundNotifications();
    return unsubscribe;
  }, []);
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AppNav />
      </LanguageProvider>
    </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({})
