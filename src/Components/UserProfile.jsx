import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserProfile = () => {
    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();
  return (
    <SafeAreaView style={[styles.mainView, { width: width, height: height }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text>User</Text>
            </TouchableOpacity>
        </SafeAreaView>
  )
}

export default UserProfile

const styles = StyleSheet.create({})