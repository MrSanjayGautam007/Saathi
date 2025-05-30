import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../APIServices/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';

const PoFemaleProforma = () => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const [poid, setPoid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [groupedData, setGroupedData] = useState([]);

    useEffect(() => {
        const getUser = async () => {
            const user = await AsyncStorage.getItem('user');
            if (user) {
                const parsedUser = JSON.parse(user);
                setPoid(parsedUser.po_id);
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        if (poid) fetchFemaleProforma();
    }, [poid]);

    const fetchFemaleProforma = async () => {
        setLoading(true);
        try {
            const response = await api.get('/female-roforma-list', { params: { po_id: poid } });
            const result = response.data;

            if (result.success && Array.isArray(result.data)) {
                groupByDate(result.data);
            } else {
                Alert.alert('Error', result.msg || 'Unable to fetch data.');
            }
        } catch (error) {
            console.error('Error fetching Female Proforma:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupByDate = (data) => {
        const grouped = {};
        data.forEach(item => {
            const date = moment(item.proforma_date).format('DD-MM-YYYY');
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(item);
        });

        const groupedArray = Object.keys(grouped).map(date => ({
            date,
            records: grouped[date],
        }));

        setGroupedData(groupedArray);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.dateCard}
            onPress={() => navigation.navigate('FemaleProformaDetails', { date: item.date, records: item.records })}
        >
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.recordCount}>{item.records.length} Record(s)</Text>
        </TouchableOpacity>
    );
    useFocusEffect(
        React.useCallback(() => {
          StatusBar.setBackgroundColor('#6A6BBF'); 
          StatusBar.setBarStyle('light-content');
        }, [])
      );
    return (
        <SafeAreaView style={[styles.mainView, { width, height }]}>
            <StatusBar barStyle="light-content" backgroundColor="#6A6BBF" />
            <Header title="Female Proforma" textColor="#fff" iconColor="#fff" />
            {loading ? (
                <ActivityIndicator size={50} color="#fff" style={styles.centered} />
            ) : (
                <FlatList
                    data={groupedData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.date}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={
                        <Text style={styles.noRecordText}>No records found.</Text>
                    }
                />
            )}
            {/* {Object.keys(groupedData).length === 0 && (
                <Text style={styles.noRecordText}>No records found.</Text>
            )} */}
        </SafeAreaView>
    );
};

export default PoFemaleProforma;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
    },
    dateCard: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 12,
        marginBottom: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    recordCount: {
        fontSize: 14,
        color: '#666',
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
    },
});
