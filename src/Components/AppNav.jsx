import { StatusBar, StyleSheet, Text, View, Image, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createStaticNavigation, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Languages from './Languages'
import LoginScreen from './LoginScreen'
import ForgotPassword from './ForgotPassword'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import UserProfile from './UserProfile'
import Home from './Home'
import Feather from 'react-native-vector-icons/dist/Feather';
import FontAwesome6 from 'react-native-vector-icons/dist/FontAwesome6';
import HealthFeed from './HealthFeed'
import Menu from './Menu'
import Activities from './Activities'
import AdminMessages from './AdminMessages'
import Blogs from './Blogs'
import EducationalContents from './EducationalContents'
import SplashScreen from './SplashScreen'
import AppointmentRequest from './HomePageScreens/AppointmentRequest'
import UserDetails from './HomePageScreens/UserDetails'
import SelfBreastExamination from './HomePageScreens/SelfBreastExamination'
import UploadReport from './HomePageScreens/UploadReport'
import { LanguageProvider } from '../context/LanguageContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import PrivacyPolicy from './MenuScreens/PrivacyPolicy'
import TermsAndConditions from './MenuScreens/TermsAndConditions'
import ContactUs from './MenuScreens/ContactUs'
import AboutUs from './MenuScreens/AboutUs'
import CoreProforma from './UserDetailsComponents/CoreProforma'
import PoTobaccoProforma from './UserDetailsComponents/PoTobaccoProforma'
import PoFemaleProforma from './UserDetailsComponents/PoFemaleProforma'
import FollowUp from './UserDetailsComponents/FollowUp'
import SBESubmit from './HomePageScreens/SBESubmit'
import BlogsDetails from './HomePageScreens/BlogsDetails'
import CoreProformaDetails from './UserDetailsComponents/CorePerformaDetails'
import FemaleProformaDetails from './UserDetailsComponents/FemaleProformaDetails'
import UpcommingReminders from './HomePageScreens/UpcommingReminders'
import { createStackNavigator } from '@react-navigation/stack';
// const Stack = createNativeStackNavigator();
const Stack = createStackNavigator()
const Bottom = createBottomTabNavigator();

const MyHome = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    return (
        <Bottom.Navigator screenOptions={{
            animation: 'shift',
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
                backgroundColor: "#E5E5FE",
                // height: -60,
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
            },

            tabBarActiveTintColor: "#512DA8",
            tabBarInactiveTintColor: "skyblue",
            // tabBarShowLabel: false, // Hides tab names
        }}
        >
            <Bottom.Screen name='Home' component={MyHomeStack}
                options={{


                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/images/Home.png')}
                            style={{
                                width: 28,
                                height: 28,
                                position: "absolute",
                                // top: 5,
                                tintColor: focused ? "#DC143C" : "#512DA8", // Works for monochrome PNGs
                            }}
                        />

                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{
                            color: focused ? "#DC143C" : "#512DA8",
                            fontSize: 10,
                            fontWeight: "bold"
                        }}>Home</Text>
                    )

                }}


            />
            <Bottom.Screen name='SBE' component={SBEStack}
                options={{

                    // title: 'SBE',
                    tabBarIcon: ({ focused }) => (

                        <Image
                            source={require('../assets/images/Admin.png')}
                            style={{
                                width: 28,
                                height: 28,
                                position: "absolute",
                                // top: 5,
                                tintColor: focused ? "#DC143C" : "#512DA8", // Works for monochrome PNGs
                            }}
                        />

                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{
                            color: focused ? "#DC143C" : "#512DA8",
                            fontSize: 10,
                            fontWeight: "bold"
                        }}>SBE</Text>
                    )
                }}

            />
            <Bottom.Screen name='User' component={MyUserDetailsStack}
                options={{
                    // title: 'Your Details',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/images/HealthFeed.png')}
                            style={{
                                width: 28,
                                height: 28,
                                position: "absolute",
                                // top: 5,
                                tintColor: focused ? "#DC143C" : "#512DA8",
                            }}
                        />

                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{
                            color: focused ? "#DC143C" : "#512DA8",
                            fontSize: 10,
                            fontWeight: "bold"
                        }}>Your Details</Text>
                    )
                }}

            />
            <Bottom.Screen name='MenuStack' component={MyMenuStack}
                options={{
                    // title: 'Menu',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/images/Menu.png')}
                            style={{
                                width: 28,
                                height: 28,
                                position: "absolute",
                                // top: 5,
                                tintColor: focused ? "#DC143C" : "#512DA8", // Works for monochrome PNG
                            }}
                        />

                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{
                            color: focused ? "#DC143C" : "#512DA8",
                            fontSize: 10,
                            fontWeight: "bold"
                        }}>Menu</Text>
                    )
                }}

            />

        </Bottom.Navigator>
    )
};

const SBEStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            orientation: 'portrait'
        }}>
            <Stack.Screen name='SBE' component={SelfBreastExamination} />
            <Stack.Screen name='SBESubmit' component={SBESubmit} />
        </Stack.Navigator>
    )
}
const MyMenuStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'fade_from_right',
            orientation: 'portrait'
        }}>
            <Stack.Screen name='Menu' component={Menu} />
            <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicy} />
            <Stack.Screen name='TermsAndConditions' component={TermsAndConditions} />
            <Stack.Screen name='ContactUs' component={ContactUs} />
            <Stack.Screen name='AboutUs' component={AboutUs}
            />
            <Stack.Screen name='CoreProforma' component={CoreProforma} />

        </Stack.Navigator>
    )
}

const MyHomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            orientation: 'portrait'
        }}
        //  initialRouteName='UploadReport'
        >
            <Stack.Screen name='HomePage' component={Home} />
            <Stack.Screen name='Activities' component={Activities} />
            <Stack.Screen name='AdminMessages' component={AdminMessages} />
            <Stack.Screen name='MyBlogsStack' component={MyBlogsStack} />
            {/* <Stack.Screen name='EducationalContents' component={EducationalContents} /> */}
            <Stack.Screen name='AppointmentRequest' component={AppointmentRequest} />
            <Stack.Screen name='MyUserDetailsStack' component={MyUserDetailsStack} />
            {/* <Stack.Screen name='UserDetails' component={UserDetails} /> */}
            <Stack.Screen name='SBE' component={SelfBreastExamination} />
            <Stack.Screen name='UploadReport' component={UploadReport} />
            <Stack.Screen name='SBESubmit' component={SBESubmit} />
            <Stack.Screen name='BlogsDetails' component={BlogsDetails} />
            <Stack.Screen name='UpcommingReminders' component={UpcommingReminders} />
        </Stack.Navigator>
    )
}
const MyBlogsStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            orientation: 'portrait'
        }}>
            <Stack.Screen name='Blogs' component={Blogs} />
            <Stack.Screen name='BlogsDetails' component={BlogsDetails} />
        </Stack.Navigator>
    )
}
const MyUserDetailsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                orientation: 'portrait'
            }}
        >
            <Stack.Screen name='UserDetails' component={UserDetails} />
            <Stack.Screen name='CoreProforma' component={CoreProforma} />
            <Stack.Screen name='PoTobaccoProforma' component={PoTobaccoProforma} />
            <Stack.Screen name='PoFemaleProforma' component={PoFemaleProforma} />
            <Stack.Screen name='FollowUp' component={FollowUp} />
            <Stack.Screen name='CoreProformaDetails' component={CoreProformaDetails} />
            <Stack.Screen name='FemaleProformaDetails' component={FemaleProformaDetails} />
        </Stack.Navigator>
    )
}
const AppNav = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                orientation: 'portrait'
            }}
            // initialRouteName='Login'
            // initialRouteName={initialScreen}
            >
                <Stack.Screen name='SplashScreen' component={SplashScreen}
                    options={{
                        animation: 'default'
                    }}

                />
                <Stack.Screen name='Language' component={Languages} />
                <Stack.Screen name='Login' component={LoginScreen} />
                <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
                <Stack.Screen
                    name='MyHome' component={MyHome} />
            </Stack.Navigator>
            <Toast
                config={{
                    Success: ({ text1, ...rest }) => (
                        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: 15, borderRadius: 10, }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>

                        </View>
                    ),
                    Failure: ({ text1, ...rest }) => (
                        <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
                        </View>
                    ),
                    NotSelect: ({ text1, ...rest }) => (
                        <View style={{ backgroundColor: 'green', padding: 15, borderRadius: 10 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
                        </View>
                    )
                }}
            />
        </NavigationContainer>


    )
}

export default AppNav
