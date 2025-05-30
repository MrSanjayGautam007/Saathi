import { FlatList, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from './Header'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
const EducationalContents = () => {
    const { width, height } = useWindowDimensions();
    const appointmentData = [
        {
            id: '1',
            image: require('../assets/images/LadyPatient2.png'),
            message: 'More Women at Younger Ages being Diagnosed with Cancer',
        },
        {
            id: '2',
            image: require('../assets/images/LadyPatient1.png'),
            message: 'More Women at Younger Ages being Diagnosed with Cancer',
        },
        {
            id: '3',
            image: require('../assets/images/LadyPatient2.png'),
            message: 'More Women at Younger Ages being Diagnosed with Cancer',
        },

    ];
    const renderItem = ({ item }) => (

        <View style={styles.card}>
            <Image source={item.image} style={styles.imageStyle} />
            <Text numberOfLines={2} style={styles.message}>{item.message}</Text>
        </View>

    )


    return (
        <SafeAreaView style={[styles.mainView, { width: width, height: height }]}

        >
            <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
            <Header title={'Educational Content'} />
            <View style={styles.inputView}>
                <Ionicons name={'search-outline'} size={24} color={'#AAADAD'} />
                <TextInput placeholder='Search Help' placeholderTextColor={"#AAADAD"} style={styles.inputStyle} />
            </View>
            {/* text */}
            <View style={styles.textView}>
                <Text style={styles.cancerText}>Breast Cancer</Text>
                <TouchableOpacity style={styles.moreInfo}>
                    <Text style={styles.moreInfoText}> More Info</Text>
                </TouchableOpacity>

            </View>
            {/* List */}
            <View style={styles.flatView}>
                <FlatList
                    horizontal
                    data={appointmentData}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                />
            </View>
            {/* text */}
            <View style={styles.textView}>
                <Text style={styles.cancerText}>Cervical Cancer</Text>
                <TouchableOpacity style={styles.moreInfo}>
                    <Text style={styles.moreInfoText}> More Info</Text>
                </TouchableOpacity>

            </View>
            {/* List */}
            <View style={styles.flatView}>
                <FlatList
                    horizontal
                    data={appointmentData}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                />
            </View>
            <View style={styles.FAQView}>
                <Text style={styles.FAQViewText}>Frequently Asked Questions</Text>
                <View style={styles.FAQinsideView}>
                    <Text style={styles.FAQViewTextInside}>What is Saathi ? Who is it for?
                    </Text><AntDesign name={'plus'} size={20} color={'#512DA8'}/></View>
                <View style={styles.FAQinsideView}>
                    <Text style={styles.FAQViewTextInside}>I'm having trouble logging in Saathi.</Text>
                    <AntDesign name={'plus'} size={20} color={'#512DA8'}/></View>
                <View style={[styles.FAQinsideView, { borderBottomWidth: 1, }]}>
                    <Text style={styles.FAQViewTextInside}>How is my personal information kept safe in Saathi?</Text>
                    <AntDesign name={'plus'} size={20} color={'#512DA8'}/></View>
            </View>
        </SafeAreaView>
    )
}

export default EducationalContents

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    inputView: {
        width: '90%',
        // height: 34,
        borderRadius: 20,
        // borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 10,
        gap: 10,
        // justifyContent: 'center'
        flexDirection: 'row',
        backgroundColor: '#E5E5FE',
        alignItems: 'center'

    },
    inputStyle: {
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: 'black',
        flex: 1,

    },
    textView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        height: 44,
        padding: 10,
        marginVertical: 10,
    },
    cancerText: {
        // width: 102,
        height: 24,
        // fontFamily: 'Roboto',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#512DA8',


    },
    moreInfo: {
        // width: 70,
        height: 30,
        gap: 10,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#512DA8',
        justifyContent: 'center',
        alignItems: 'center'
    },
    moreInfoText: {
        color: '#FFFFFF',
        // fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 13,
    },
    flatView: {
        width: 380,
        // height: 150,
        gap: 24,
        alignItems: 'center',
        justifyContent: 'center',


    },
    imageStyle: {
        width: 100,
        height: 100,
        borderRadius: 11,
        resizeMode: 'cover'

    },
    card: {
        height: 150,
        width: 110,
        marginHorizontal: 5,
        borderRadius: 10,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    message: {
        marginVertical: 5,
        fontSize: 12,
        textAlign: 'center',
        color: '#080909',
        fontWeight: '600',
        fontSize: 11,
    },
    FAQView: {
        width: '100%',
        height: 194,
        // borderWidth: 1,
        alignItems: 'center'

    },
    FAQViewText: {
        width: 222,
        height: 44,
        color: '#512DA8',
        padding: 10,
        // fontFamily: 'Roboto',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
    },
    FAQinsideView: {
        width: 340,
        height: 50,
        // borderEndWidth: 1,
        borderTopWidth: 1,
        // borderLeftWidth: 1,
        borderColor: '#6A6BBF',
        // justifyContent: "space-around",
        alignItems: 'center',
        flexDirection: 'row',
        
    },
    FAQViewTextInside: {
        marginLeft: 5,
        color: '#6A6BBF',
        flex: 1,
    }
})