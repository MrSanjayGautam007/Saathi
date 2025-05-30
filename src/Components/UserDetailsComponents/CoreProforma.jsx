import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../APIServices/api';

const CoreProforma = () => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const [poid, setPoid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [coreProforma, setCoreProforma] = useState([]);
    const [groupedData, setGroupedData] = useState({});

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                if (user) {
                    const parsedUser = JSON.parse(user);
                    setPoid(parsedUser.po_id);
                }
            } catch (error) {
                console.error("Error retrieving user data:", error);
            }
        }
        getUser();
    }, []);

    useEffect(() => {
        if (poid) {
            fetchCoreProforma();
        }
    }, [poid]);

    const fetchCoreProforma = async () => {
        setLoading(true);
        try {
            const response = await api.get('/core-roforma-list', {
                params: {
                    po_id: poid,
                }
            });
            const result = response.data;
            if (result.success && Array.isArray(result.data)) {
                setCoreProforma(result.data);
                groupByDate(result.data);
            } else {
                Alert.alert("Error", result.msg || "Unable to fetch core proforma.");
            }
        } catch (error) {
            console.error("Error fetching Core Proforma:", error);
        } finally {
            setLoading(false);
        }
    };

    const groupByDate = (data) => {
        const grouped = {};

        data.forEach(item => {
            if (item.physicalActivity && item.physicalActivity.length > 0 && item.physicalActivity[0].created_date) {
                const rawDate = item.physicalActivity[0].created_date.split(' ')[0]; // "2025-03-27"
                const [year, month, day] = rawDate.split('-');
                const formattedDate = `${day}-${month}-${year}`;

                if (!grouped[formattedDate]) {
                    grouped[formattedDate] = [];
                }
                grouped[formattedDate].push(item);
            }
        });

        // Sort descending by date
        const sortedGrouped = Object.fromEntries(
            Object.entries(grouped).sort((a, b) => {
                const [aDay, aMonth, aYear] = a[0].split('-');
                const [bDay, bMonth, bYear] = b[0].split('-');
                return new Date(`${bYear}-${bMonth}-${bDay}`) - new Date(`${aYear}-${aMonth}-${aDay}`);
            })
        );

        setGroupedData(sortedGrouped);
    };

    useFocusEffect(
        React.useCallback(() => {
          StatusBar.setBackgroundColor('#6A6BBF'); 
          StatusBar.setBarStyle('light-content');
        }, [])
      );
    return (
        <SafeAreaView style={[styles.mainView, {  width,  height }]}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />
            <Header title={'Core Proforma'} textColor={'#fff'} iconColor={'#fff'} />

            {loading ? (
                <ActivityIndicator size={50} color="#fff" style={styles.centered} />
            ) : (
                <ScrollView contentContainerStyle={styles.containerView}>
                    {Object.keys(groupedData).map((date, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.dateBox}
                            onPress={() => navigation.navigate('CoreProformaDetails', { date, records: groupedData[date] })}
                        >
                            <Text style={styles.dateText}>{date}</Text>
                            <Text style={styles.countText}>{groupedData[date].length} Record</Text>
                        </TouchableOpacity>
                    ))}
                    {Object.keys(groupedData).length === 0 && (
                        <Text style={styles.noRecordText}>No records found.</Text>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default CoreProforma;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    containerView: {
        padding: 15,
    },
    dateBox: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    countText: {
        color: '#555'
    },
    noRecordText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
      },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#6A6BBF',
    }
});
