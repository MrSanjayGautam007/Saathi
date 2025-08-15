import { ActivityIndicator, FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, RefreshControl, Animated, Alert } from 'react-native'
import React, { use, useEffect, useRef, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Image } from 'react-native';
import { bloglist } from '../APIServices/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';
import { getFCMToken } from '../Firebase_Notifications/NotificationService';
import api from '../APIServices/api';
import Spinner from 'react-native-spinkit';
import NetworkStatusToast from './HomePageScreens/NetworkStatusToast';
import { Button } from 'react-native-paper';
import { Skeleton } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient'
import HomeScreenSkeleton from './SkelatonLoader/HomeScreenSkeleton';

const Home = () => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const [username, setUsername] = useState('User');
    const [blogList, setBlogList] = useState([]);
    const [user, setUser] = useState('');
    const [reminders, setReminders] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [loading, setLoading] = useState(true);
    const [poid, setPoid] = useState('');
    const { t } = useLanguage();
    const [fcmToken, setFcmToken] = useState('');
    const [refreshLoading, setRefreshLoading] = useState(false);

    // 🔹 Fetch User
    useEffect(() => {
        fetchUser();
    }, []);
    const fetchUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                await getReminders(parsedUser.po_id);
            }
        } catch (error) {
            console.error("Failed to load user", error);
        } finally {
            setLoadingUser(false);
        }
    };
    // 🔹 Fetch Blogs
    useEffect(() => {


        fetchBlogs();

        const getFCMToken = async () => {
            // const token = await getFCMToken();
            const token = await AsyncStorage.getItem('fcmToken');
            setFcmToken(token);
            console.log('FCM Token:', token);
        }
        getFCMToken();
    }, []);
    const fetchBlogs = async () => {
        setLoadingBlogs(true);
        try {
            const data = await bloglist();
            if (data?.success) {
                setBlogList(data.msg);
                console.log("Blog List:", data.msg);
            } else {
                console.warn("Blog fetch failed:", data?.msg);
            }
        } catch (error) {
            console.error("Failed to fetch blogs", error);
            Alert.alert("Error", "Failed to fetch blogs");
        } finally {
            setLoadingBlogs(false);
        }
    };
    const onRefreshGetData = () => {
        setRefreshLoading(true);
        try {
            fetchUser();
            fetchBlogs();
            getReminders(user.po_id);
        } catch (error) {
            console.log("Error refreshing data:", error);
        }
        finally {
            setRefreshLoading(false);
        }

    }
    const getReminders = async (poid) => {
        setLoading(true);
        try {
            const response = await api.get('/show-notification', {
                params: {
                    po_id: poid,
                },
            });

            console.log("Reminder List:", response.data);
            const result = response.data;
            if (result.success) {
                setReminders(result.data);
                console.log("Reminders:", reminders);

            } else {
                console.log("No reminders found");
            }

        } catch (error) {
            console.error("Error fetching reminders:", error);
        } finally {
            setLoading(false);
        }

    }
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBackgroundColor('#6A6BBF');
            StatusBar.setBarStyle('light-content');
        }, [])
    );
    const BlogLoader = () => {
        return (
            <View style={[styles.blogListView, { flexDirection: 'row', height: 'auto', width: '90%' }]}>
                {[1, 2, 3].map((_, index) => (
                    <View key={index} style={[styles.blogImageView,]}>
                        <Skeleton
                            width={'100%'}
                            height={'100%'}
                            animation='wave'

                            LinearGradientComponent={LinearGradient}
                        />

                    </View>
                ))}
            </View>
        )
    }
    return (
        <SafeAreaView style={[styles.mainView, { width, height }]}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />
            {
                loadingUser ? (
                    // <ActivityIndicator size={50} color="#Fff" style={styles.center} />
                
                    <HomeScreenSkeleton />
                ) : (

                    <View>
                        <View style={styles.helloUserView}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',

                            }}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.userIcon}>
                                    <Feather name={'user'} size={25} color={'#6A6BBF'} />
                                </TouchableOpacity>

                                <Text style={styles.helloText}>👋{t('Hello')}, {user ? user.po_id : 'User'}</Text>

                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.userIcon, {}]}
                                onPress={() => navigation.navigate('AdminMessages')}
                            >
                                <Feather name={'bell'} size={25} color={'#6A6BBF'} />
                            </TouchableOpacity>

                        </View>

                        <ScrollView contentContainerStyle={{
                            alignItems: "center", flexGrow: 1
                            , justifyContent: "center", paddingBottom: 100,
                        }}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshLoading}
                                    onRefresh={() => onRefreshGetData()}
                                />
                            }
                        >

                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={loading}
                                style={styles.reminderView}
                                onPress={() => navigation.navigate('UpcommingReminders')}
                            >

                                {
                                    loading ? (
                                        // <Spinner type='Wave' size={35} color="#512DA8" style={styles.center} />
                                        <Skeleton
                                            width={'100%'}
                                            height={'100%'}
                                            animation='wave'
                                            LinearGradientComponent={LinearGradient}
                                        />


                                    ) : (
                                        <>
                                            <Text style={styles.upcomingText}>{t('Upcoming Reminders')}</Text>
                                            {
                                                reminders && reminders.length > 0 ? (
                                                    reminders.slice(0, 1).map((item, index) => (
                                                        <Text key={index} style={styles.nextFollowText}>
                                                            📌  {item.title} {item.date} 📌
                                                        </Text>
                                                    ))
                                                ) : (
                                                    <Text style={styles.nextFollowText}>{t('No upcoming reminders')}</Text>
                                                )
                                            }
                                        </>
                                    )
                                }

                            </TouchableOpacity>
                            <View style={styles.whatWouldView}>
                                <Text
                                    style={styles.whatWouldViewText}
                                >{t('What would you like to do?')} </Text>
                            </View>

                            <View style={styles.cardMainView}>
                                <View style={styles.cardView}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => navigation.navigate('AppointmentRequest')}

                                        style={styles.cardTextContainer}>
                                        <Text style={styles.cardViewText}>{t('Appointment Request')}</Text>

                                        <Image source={require('../assets/images/Ellipse9.png')}

                                            style={styles.imageEllipseView} />
                                        <Image
                                            source={require('../assets/images/fluentcalender.png')}
                                            style={styles.overlayImage}
                                        />
                                    </TouchableOpacity>

                                </View>

                                <View style={styles.cardView}>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => navigation.navigate('MyUserDetailsStack')}
                                        style={[styles.cardTextContainer, { alignItems: "center" }]}>
                                        <Text style={styles.cardViewText}>{t('Your details')}</Text>

                                        <Image source={require('../assets/images/Ellipse92.png')}

                                            style={[styles.imageEllipseView, { width: 73, height: 80, borderRadius: 10 }]} />
                                        <MaterialCommunityIcons name={'card-account-details-outline'} size={25} color={'blue'}
                                            style={[styles.overlayImage, { right: -11, top: 10 }]} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.cardView}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.cardTextContainer}
                                        onPress={() => navigation.navigate('UploadReport')}
                                    >
                                        <Text style={styles.cardViewText}>{t('Upload reports')}</Text>


                                        <Image source={require('../assets/images/Ellipse10.png')}

                                            style={[styles.imageEllipseView, { width: 73, height: 69, borderRadius: 16 }]} />
                                        <Image
                                            source={require('../assets/images/GroupEd.png')}
                                            style={styles.overlayImage}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.cardView}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => navigation.navigate('SBE')}
                                        style={styles.cardTextContainer}>

                                        <View style={{ marginRight: 70, }}>
                                            <Text numberOfLines={2} style={styles.cardViewText}>{t('Self Breast Examination')}</Text>
                                        </View>
                                        <Image source={require('../assets/images/Ellipse11.png')}

                                            style={[styles.imageEllipseView, { width: 60, height: 78, borderRadius: 20 }]} />
                                        <Image
                                            source={require('../assets/images/GroupPerson.png')}
                                            style={styles.overlayImage}
                                        />
                                    </TouchableOpacity>

                                </View>
                            </View>

                            {/* blog starts here */}
                            <View style={styles.blogView}>
                                <Text style={styles.blogText}>
                                    {t('Latest blogs')}
                                </Text>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('MyBlogsStack')}
                                    style={styles.viewMoreBtn}>
                                    <Text style={styles.btnText}>{t('View More')}</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                loadingBlogs ? (
                                    // <ActivityIndicator size="large" color="#Fff" style={styles.center} />
                                    // // <Spinner type='Circle' size={40} color="#Fff" style={styles.center} />
                                    <BlogLoader />

                                ) : (
                                    <View style={{
                                        width: '90%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <FlatList
                                            data={blogList.slice(0, 3)} //  show only first 2 blogs
                                            keyExtractor={(item, index) => index.toString()}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            // scrollEnabled={false}
                                            renderItem={({ item }) => (
                                                <View
                                                    style={styles.blogListView}>
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={() => navigation.navigate('BlogsDetails', { item })} style={styles.blogImageView}>
                                                        <Image
                                                            source={
                                                                item.image
                                                                    ? { uri: `https://bcssprojects.in/Saathi/public/${item.image}` }
                                                                    : require('../assets/images/NotFound.jpeg')
                                                            }
                                                            style={styles.images}
                                                        />
                                                        <Text numberOfLines={2} ellipsizeMode='tail'
                                                            style={styles.blogImageText}>{item.title}</Text>
                                                    </TouchableOpacity >
                                                </View>
                                            )}
                                            ListEmptyComponent={() => (
                                                <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 20, color: '#fff' }}>
                                                    Blogs will appear here
                                                </Text>
                                            )}
                                        />
                                    </View>
                                )
                            }
                            <NetworkStatusToast />
                        </ScrollView>

                    </View >
                )
            }

        </SafeAreaView >
    )
}

export default Home

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        // justifyContent:'center',
        backgroundColor: '#6A6BBF',
    },
    helloUserView: {

        flexDirection: 'row',
        paddingHorizontal: 5,
        height: 52,
        alignItems: 'center',


    },
    userIcon: {
        height: 40,
        width: 40,
        backgroundColor: '#fff',
        borderRadius: 40,
        alignItems: "center",
        justifyContent: 'center',
        // flexDirection:"row",
        // marginRight: 10,
        marginHorizontal: 10,
        padding: 5,
    },
    helloTextView: {
        // width: 155,

        height: 52,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 10,
        // marginRight: 70
        alignItems: 'center',

    },
    helloText: {
        // width: 155,
        height: 32,
        fontWeight: "500",
        fontSize: 22,
        textAlign: 'center',
        color: '#fff',
        // fontFamily:'Roboto'

    },
    reminderView: {
        width: '90%',
        height: 98,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: '#E5E5FE',
        borderColor: '#EDE7F6',
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 15,
        overflow: 'hidden'
    },
    upcomingText: {
        width: 180,
        height: 24,
        // gap: 10,
        // fontFamily: 'Roboto',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 5,

    },
    nextFollowText: {
        width: '90%',
        gap: 10,
        // fontfamily: 'Roboto',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: '#000000',
        textAlign: 'center',
    },
    whatWouldView: {
        width: 312,
        height: 52,
        gap: 10,
        padding: 10,
        alignSelf: 'flex-start',
        marginVertical: 5,
    },
    whatWouldViewText: {
        fontWeight: '500',
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        color: '#ffff'
    },

    cardMainView: {
        // flex: 1,
        width: '95%',
        // height: 175,
        flexDirection: "row",
        flexWrap: "wrap", 
        justifyContent: "space-between", 
        alignContent: "space-between", //  Ensures wrapping works properly
        gap: 10, // Adds spacing between cards
        padding: 5, // Padding inside the container
      

    },
    cardView: {
        // width: 161,
        height: 88,
        width: "48%", // 48% to fit two items in a row
        // aspectRatio: 1, // Keeps square shape
        borderRadius: 20, // Rounded corners
        backgroundColor: '#FFFFFF',
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: "relative", // Needed for absolute positioning
        overflow: "hidden", // Ensures the image stays inside

    },
    cardViewText: {
        fontWeight: '500',
        fontSize: 14,
        // lineHeight: 20,
        width: '90%',
        // height: 40,
        // marginRight: 10,

    },
    cardTextContainer: {
        width: 129,
        height: 60,
        gap: 10,
        paddingTop: 10,
        flexDirection: "row",

    },
    imageEllipseView: {
        width: 60, // Reduce image size to fit inside
        height: 60, // Keep aspect ratio
        position: "absolute",
        top: -25, // Position at the top
        right: -35, // Keep inside the container
        borderRadius: 35,
    },
    overlayImage: {
        width: 24, // Adjust size for the overlay image
        height: 24,
        position: "absolute",
        right: -15, // Moves the overlay image slightly above
        zIndex: 1, // Ensures it appears on top
    },
    blogView: {
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        // width: 335,
        height: 52,
        paddingVertical: 30,
        marginVertical: 5,
    },
    blogText: {
        width: 153,
        height: 52,
        gap: 10,
        padding: 10,
        // font-family: Roboto;
        fontWeight: '500',
        fontSize: 24,
        // lineHeight: 32,
        textAlign: 'center',
        color: '#fff'

    },
    viewMoreBtn: {
        width: 89,
        height: 28,
        borderRadius: 20,
        gap: 3,
        backgroundColor: '#EDE7F6',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    btnText: {
       
        fontWeight: '500',
        fontSize: 12,
        textAlign: 'center',
        color: 'black',

    },
    blogListView: {
        flex: 1,
        width: '90%',
        height: 220,
        alignItems: 'center',
        marginBottom: 10,

    },
    blogImageView: {
        width: 130,
        height: 160,
        gap: 5,
        // padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginHorizontal: 5,
        borderWidth: 0.5,
        borderColor: '#EDE7F6',
        elevation: 5,
        overflow: 'hidden'
    },
    images: {
        width: '100%',
        height: 110,
        borderRadius: 20,
        // paddingTop: 10,
    },
    blogImageText: {
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 20,
        // textAlign: 'center',
        color: '#000',
        paddingHorizontal:10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',



    },
    // network status toast
    toast: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 34,
        borderRadius: 8,
        zIndex: 1000,
        elevation: 10,
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },

})