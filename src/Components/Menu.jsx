import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useLanguage } from '../context/LanguageContext';
import api from '../APIServices/api';
import Header from './Header';
import CustomAlertModal from './HomePageScreens/CustomAlertModal';
import { ScrollView } from 'react-native';


const Menu = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const [poid, setPOID] = useState('');
  const { t } = useLanguage();
  const [showModal, setModalShow] = useState(false)
  const handleLogout = async () => {

    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('APP_LANGUAGE');
      setModalShow(false);
      setTimeout(() => {
        Toast.show({
          type: 'Success',
          text1: 'Logged out successfully!',
        });

        navigation.replace("Login");

      }, 1000);
      // Show alert after clearing async storage


    } catch (error) {
      console.error("Error clearing async storage: ", error);
    }
  }
  useEffect(() => {

    const getUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          const parsedUser = JSON.parse(user);
          setPOID(parsedUser.po_id);
          console.log("User POID:", parsedUser.po_id);
        }

      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    }
    getUser();
  }, []);
  const handleAccountDelete = async () => {
    Alert.alert(
      t('⚠️ Delete Account'),
      t('Are you sure you want to delete your account?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('OK'),
          onPress: async () => {
            try {
              const response = await api.post('/account-delete', {
                po_id: poid,
              });
              const result = response.data;
              console.log("Account Deletion:", result);

              if (result.success) {
                await AsyncStorage.removeItem('user');
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('APP_LANGUAGE');
                setTimeout(() => {
                  Toast.show({
                    type: 'Success',
                    text1: 'Account deleted successfully!',
                  });
                  navigation.replace("Login");
                }, 1000);
              } else {
                Alert.alert(t('Error'), result.msg || t('Unable to delete account.'));
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(t('Network Error'), t('Something went wrong. Please check your connection.'));
            }
          },
        },
      ],
    );
  };
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor('#6A6BBF'); 
      StatusBar.setBarStyle('light-content');
    }, [])
  );
  return (
    <SafeAreaView style={[styles.mainView, { width,  height }]}>
      <StatusBar backgroundColor={'#6A6BBF'} barStyle={'light-content'}  />
      <Header title={'Menu'} textColor={'#fff'} iconColor={'#fff'} />
      {/* <Text>Menu</Text> */}

      <ScrollView
        style={styles.menuViewContainer}
        showsVerticalScrollIndicator={false}

        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}  
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Language')}
          style={styles.menuView}>
          <Ionicons name={'language'} size={24} color={'white'} />
          <Text style={styles.menuText}>{t('Change Language')}</Text>
          <Ionicons name={'chevron-forward'} size={25} color={'#fff'} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PrivacyPolicy')}
          style={styles.menuView}>
          <Ionicons name={'document-text-outline'} size={24} color={'white'} />
          <Text style={styles.menuText}>{t('Privacy Policy')}</Text>
          <Ionicons name={'chevron-forward'} size={25} color={'#fff'} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TermsAndConditions')}
          style={styles.menuView}>
          <Ionicons name={'document-outline'} size={24} color={'white'} />
          <Text style={styles.menuText}>{t('Terms And Conditions')}</Text>
          <Ionicons name={'chevron-forward'} size={25} color={'#fff'} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AboutUs')}
          style={styles.menuView}>
          <MaterialIcons
            name={'groups'} size={24} color={'white'} />
          <Text style={styles.menuText}>{t('About Us')}</Text>
          <Ionicons name={'chevron-forward'} size={25} color={'#fff'} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ContactUs')}
          style={styles.menuView}>
          <Ionicons name={'chatbubble-outline'} size={24} color={'white'} />
          <Text style={styles.menuText}>{t('Contact Us')}</Text>
          <Ionicons name={'chevron-forward'} size={25} color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.menuView}>
          <Ionicons name={'lock-closed-outline'} size={24} color={'white'} />
          <Text style={styles.menuText}>{t('Reset Password')}</Text>
          <Ionicons name={'chevron-forward'} size={25} color={'#fff'} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setModalShow(true)}
          style={styles.menuView}>
          <Feather name={'log-out'} size={24} color={'white'} />
          <Text style={styles.menuText}>{t('Log Out')}</Text>
          <Ionicons name={'chevron-forward'} size={25} color={'#fff'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAccountDelete}
          activeOpacity={0.7}
          style={styles.menuView}>
          <MaterialCommunityIcons name={'trash-can-outline'} size={24} color={'white'} />
          <Text style={styles.menuText}>{t('Delete Account')}</Text>
          <Ionicons name={'chevron-forward'} size={25} color={'#fff'} />
        </TouchableOpacity>

        <CustomAlertModal
          visible={showModal}
          message={t('Do you want to logout?')}
          title={'Confirm ?'}
          type='confirm'
          onClose={() => setModalShow(false)}
          onPress={handleLogout}
          onCancel={() => setModalShow(false)}
          showCancel={true}
          onBackButtonPress={() => setModalShow(false)}
        />
      </ScrollView>


    </SafeAreaView>
  )
}

export default Menu

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#6A6BBF',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 10,
  },

  menuView: {
    flexDirection: 'row',
    width: '80%',
    height: 60,
    borderBottomWidth: 0.6,
    borderBottomColor: '#fff',
    margin: 5,
    alignItems: 'center',
  
   
  },
  menuViewContainer: {
    width: '100%',
    height: '60%',
    // backgroundColor: '#6A6BBF',
    // backgroundColor : 'rgba(0,0,0,0.5)',
    borderRadius: 20,


  },
  menuText: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
    marginLeft: 5,
    fontWeight: '500',
  }
})