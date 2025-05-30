import { Alert, FlatList, SectionList, StatusBar, StyleSheet, Text, TextInput, useWindowDimensions, View, RefreshControl } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Header from './Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { ScrollView } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../APIServices/api';
import moment from 'moment';
import Spinner from 'react-native-spinkit';
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';


const AdminMessages = () => {
    const { width, height } = useWindowDimensions();
    const [poid, setPOID] = useState('');
    // console.log(width, height);
    const [loading, setLoading] = useState(false);
    const [adminMessages, setAdminMessages] = useState([]);
    const { t } = useLanguage();
    const hasLoadedOnce = useRef(false); // 🔐 used to prevent re-fetch
    const getAdminMessages = async (poid) => {
        if (!poid) return;
        // setLoading(true);
        try {
            const response = await api.get('/notification-list', {
                params: {
                    po_id: poid
                },
            });
            const result = response.data;

            if (result.success && Array.isArray(result.data)) {
                setAdminMessages(result.data);
            } else {
                console.warn('Notification fetch failed:', result.msg);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            //   setLoading(false);
        }
    };

    useEffect(() => {
        const loadUserAndMessages = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                if (user) {
                    const parsedUser = JSON.parse(user);
                    const userPoid = parsedUser.po_id;
                    setPOID(userPoid);
                    console.log("User POID:", userPoid);

                    if (!hasLoadedOnce.current) {
                        setLoading(true); //  Only show loader on first load
                        await getAdminMessages(userPoid); //  pass poid directly
                        hasLoadedOnce.current = true;
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error("Error retrieving user data:", error);
                setLoading(false); //  Handle error case
            }
        };

        loadUserAndMessages();
    }, []);
    // const getAdminMessages = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await api.get('/notification-list', {
    //             params: {
    //                 po_id: poid,
    //             }
    //         });
    //         const result = response.data;

    //         console.log("Admin Messages:", result);

    //         if (result.success && Array.isArray(result.data)) {
    //             setAdminMessages(result.data);
    //             // console.log("Admin Messages Data:", result.data.msg); 
    //             // Alert.alert("Success", "Admin messages fetched successfully.");
    //         } else {
    //             Alert.alert("Error", result.msg || "Unable to fetch admin messages.");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching admin messages:", error);
    //         Alert.alert("Error", "Something went wrong while fetching messages.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    // const sortedMessages = [...adminMessages].sort((a, b) => {
    //     return new Date(b.selected_date) - new Date(a.selected_date);
    // });
    const groupMessagesByDate = (messages) => {
        const grouped = {};

        messages.forEach((msg) => {
            const dateStr = msg.selected_date || moment(msg.created_at).format('YYYY-MM-DD');
            const dateMoment = moment(dateStr);

            // Choose group title
            let groupKey = '';
            if (dateMoment.isSame(moment(), 'day')) {
                groupKey = 'Today';
            } else if (dateMoment.isSame(moment().subtract(1, 'day'), 'day')) {
                groupKey = 'Yesterday';
            } else if (dateMoment.isAfter(moment().subtract(7, 'days'))) {
                groupKey = dateMoment.format('dddd'); // Monday, Tuesday, etc.
            } else if (dateMoment.isSame(moment(), 'year')) {
                groupKey = dateMoment.format('MMMM YYYY'); // March 2025
            } else {
                groupKey = dateMoment.format('YYYY');
            }

            if (!grouped[groupKey]) grouped[groupKey] = [];

            grouped[groupKey].push({
                ...msg,
                _sortDate: dateMoment.toDate(), // used for sorting
                _displayDate: dateMoment.format('Do MMMM, YYYY'),
            });
        });

        // Convert object to array of sections
        const sortedSections = Object.entries(grouped)
            .map(([title, data]) => ({
                title,
                data: data.sort((a, b) => b._sortDate - a._sortDate), // Sort messages inside section
                _sectionSortDate: data[0]._sortDate, // used for sorting sections
            }))
            .sort((a, b) => b._sectionSortDate - a._sectionSortDate); // Sort sections (latest first)

        return sortedSections;
    };

    // const renderItem = ({ item }) => (
    //     <View style={styles.messageContainer}>
    //         <Text style={styles.titleText}>{item.title}</Text>
    //         <Text style={styles.messageText}>{item.desciption || 'No message text'}</Text>
    //         <Text style={styles.dateText}>Sent on {item.selected_date}</Text>
    //     </View>
    // );

    const handleManualRefresh = async () => {
        setLoading(true);
        try {
            const response = await api.get('/notification-list', {
                params: { po_id: poid },
            });
            const result = response.data;

            if (result.success && Array.isArray(result.data)) {
                setAdminMessages(result.data);
            } else {
                console.warn('Manual refresh failed:', result.msg);
            }
        } catch (error) {
            console.error('Manual refresh error:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.messageContainer}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.messageText}>{item.desciption}</Text>
            <Text style={styles.dateText}>{item._displayDate}</Text>
        </View>
    );

    useFocusEffect(
        React.useCallback(() => {
          StatusBar.setBackgroundColor('#6A6BBF'); 
          StatusBar.setBarStyle('light-content');
        }, [])
      );
    return (
        <SafeAreaView style={[styles.mainView, {  width,  height }]}>
            <StatusBar backgroundColor={"#6A6BBF"} barStyle={"light-content"} />
            <Header title={t('Admin Messages')}  textColor={'#fff'} iconColor={'#fff'} />

            {
                loading ? (

                    // <ActivityIndicator size="large" color="#512DA8" style={styles.centered} />

                    <ActivityIndicator size={40} color={'#fff'} style={styles.centered} />

                ) :
                    adminMessages.length === 0 ? (
                        <Text style={styles.emptyText}>No messages found.</Text>
                    ) : (

                        // <FlatList
                        //     data={sortedMessages}
                        //     keyExtractor={(item, index) => index.toString()}
                        //     renderItem={renderItem}
                        //     contentContainerStyle={styles.list}
                        // />
                        <SectionList
                            sections={groupMessagesByDate(adminMessages)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                            renderSectionHeader={({ section: { title } }) => (
                                <Text style={styles.sectionHeader}>{title}</Text>
                            )}
                            contentContainerStyle={styles.list}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={handleManualRefresh}
                                />
                            }
                            showsVerticalScrollIndicator={false}
                        />
                    )
            }

        </SafeAreaView>
    )
}

export default AdminMessages

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        alignItems: 'center',
        paddingHorizontal: 10,
    },

    sentOn: {
        fontSize: 12,
        color: '#AAADAD',
        // fontStyle: 'italic',
        marginBottom: 8,
        left: 80
    },
    // new styles
    list: {
        padding: 16,
    },
    messageContainer: {
        backgroundColor: '#adfcda',
        // borderRadius: 12,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
        borderTopStartRadius: 30,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        // height: 100,
        width: '100%',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    titleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#512DA8',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        marginTop: 6,
        textAlign: 'right',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        // backgroundColor: '#f0f0f0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginTop: 12,
        color: '#fff',
    },
})