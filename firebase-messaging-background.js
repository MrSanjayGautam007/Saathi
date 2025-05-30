import { getMessaging } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';

getMessaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    sound: 'notification',
    importance: AndroidImportance.HIGH,
  });
  // Display a notification
  
  // 🔔 Notifee: Background Tap/Dismiss Event Handler
  //
  // notifee.onBackgroundEvent(async ({ type, detail }) => {
  //   console.log('📲 [Notifee] Background event:', type, detail);
  
  //   if (type === EventType.PRESS) {
  //     // Handle tap action (e.g. log or navigate on launch)
  //     console.log('🔗 User tapped the notification:', detail.notification?.id);
  //   }
  
  //   if (type === EventType.DISMISSED) {
  //     console.log('❌ Notification dismissed:', detail.notification?.id);
  //   }
  // if (type === EventType.ACTION_PRESS) {
  //     console.log('🔗 User pressed the action:', detail.pressAction?.id);
  //   }
  // });
});

