import { StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../Header';
import { useFocusEffect } from '@react-navigation/native';

const FollowUp = () => {
    const { width, height } = useWindowDimensions();
    useFocusEffect(
        React.useCallback(() => {
          StatusBar.setBackgroundColor('#6A6BBF'); 
          StatusBar.setBarStyle('light-content');
        }, [])
      );
    return (
        <SafeAreaView style={[styles.mainView, { width: width, height: height }]}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#6A6BBF'} />
            <Header title={'Follow Up'} textColor={'#fff'} iconColor={'#fff'} />
            {/* <Text style={styles.header}>Core Proforma</Text> */}
            {/* <ScrollView contentContainerStyle={styles.containerView}> */}
            {/* <View style={styles.containerView}> */}
        
            <View style={{ flex: 1, backgroundColor: '#6A6BBF', alignItems: 'center', justifyContent: 'center' }}>
                
            </View>
        </SafeAreaView>
    )
}

export default FollowUp

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        alignItems: 'center',
        paddingHorizontal: 10,
        // justifyContent: 'center'
    },
    containerView: {
        backgroundColor: "#FFFFFF",
        height: 431,
    }
})