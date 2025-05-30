/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { getMessaging } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import './firebase-messaging-background'; // Import the background handler
// Register background handler
// getMessaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
// });


AppRegistry.registerComponent(appName, () => App);
