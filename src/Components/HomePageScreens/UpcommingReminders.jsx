import { StatusBar, StyleSheet, Text, useWindowDimensions, View, ScrollView, RefreshControl, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import api from '../../APIServices/api'
import { useLanguage } from '../../context/LanguageContext'
import Header from '../Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Spinner from 'react-native-spinkit'
import { ActivityIndicator } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'


const UpcommingReminders = () => {
    const { width, height } = useWindowDimensions();
    const { t } = useLanguage();
    const [user, setUser] = useState('');
    const [reminders, setReminders] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
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

        fetchUser();
    }, []);
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
            StatusBar.setBarStyle('dark-content');
        }, [])
    );
    return (
        <SafeAreaView style={[styles.mainView, { width, height }]}>
            <StatusBar backgroundColor={"#6A6BBF"} barStyle={"light-content"} />
            <Header title={t('Upcoming Reminders')} textColor={'#fff'} iconColor={'#fff'} />
            {
                loadingUser ? (
                    <ActivityIndicator size={35} color={'#fff'} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
                ) : (
                    <ScrollView style={{ width: '100%', height: '100%' }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            alignItems: 'center',
                            paddingBottom: 20,
                            justifyContent: 'center',
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={() => getReminders(user.po_id)}
                            />
                        }
                    >
                        {/* <View style={styles.lable}>
                            <Text style={styles.lableText}>
                                S.N.
                            </Text>
                            <Text style={styles.lableText}>
                                Title
                            </Text>
                            <Text style={styles.lableText}>
                                Date
                            </Text>
                        </View> */}
                        {
                            reminders && reminders.length > 0 ? (

                                reminders.map((reminder, index) => (

                                    <View key={index} style={styles.card}>
                                        <Text>{index + 1}. </Text>
                                        <Text style={styles.titleText} >{reminder.title}</Text>
                                        <Text style={styles.dateText}>{reminder.date}</Text>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.noReminderView}>
                                    <Text style={styles.noReminderText} numberOfLines={1} ellipsizeMode='tail'>
                                        {t('No Reminders Found')}
                                    </Text>
                                </View>
                            )
                        }


                    </ScrollView>
                )
            }

        </SafeAreaView>
    )
}

export default UpcommingReminders

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        alignItems: 'center',
        paddingHorizontal: 15,

    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 6,
        marginHorizontal: 12,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '100%',
        maxWidth: 400,
        borderWidth: 0.1,
        borderColor: '#ccc',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,

    },
    titleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
        overflow: 'hidden',
        maxWidth: '40%',
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
    noReminderView: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noReminderText: {
        fontSize: 18,
        color: '#fff',
    },
    lable: {
        // backgroundColor: '#fff',
        padding: 15,
        marginVertical: 6,
        marginHorizontal: 12,
        width: '100%',
        maxWidth: 400,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    lableText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
        overflow: 'hidden',
        maxWidth: '40%',
        textAlign: 'center',
        flexWrap: 'wrap',
    },
})