import { StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from './Header';
import { Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const Activities = () => {
    const { width, height } = useWindowDimensions();
    return (
        <SafeAreaView style={[styles.mainView, { width: width, height: height }]}>
            <StatusBar backgroundColor={"#fff"} barStyle={'dark-content'} />
            <Header title={'Activities'} />
            <View style={[styles.imageBox, { width: width }]}>
                <Image source={require('../assets/images/image29.png')} style={styles.imageStyle} />
            </View>
            {/* Activity view */}
            <View style={styles.activitiesView}>
                <View style={styles.activityInsideView}>
                    <Image source={require('../assets/images/imageDoDoes.png')} style={styles.activityImage} />
                    <View style={{
                        width: 240,
                        height: 106
                    }}>
                        <Text style={styles.textStyleHead}>Do’s & Don’ts</Text>
                        <Text style={styles.textStyleHead2}>Focus on a healthy lifestyle with a balanced diet, regular exercise (as tolerated), and adequate hydration, while don't smoke, drink excessively, or expose yourself to infections</Text>
                    </View>
                    <Ionicons name={'chevron-forward'} size={25} color={'black'} />
                </View>
                <View style={styles.activityInsideView}>
                    <Image source={require('../assets/images/imageExercise.png')} style={styles.activityImage} />
                    <View style={{
                        width: 240,
                        height: 106
                    }}>
                        <Text style={styles.textStyleHead}>Exercise guides</Text>
                        <Text style={styles.textStyleHead2}>Focus on a healthy lifestyle with a balanced diet, regular exercise (as tolerated), and adequate hydration, while don't smoke, drink excessively, or expose yourself to infections</Text>
                    </View>
                    <Ionicons name={'chevron-forward'} size={25} color={'black'} />
                </View>
                <View style={styles.activityInsideView}>
                    <Image source={require('../assets/images/imageFit.png')} style={styles.activityImage} />
                    <View style={{
                        width: 240,
                        height: 106,

                    }}>
                        <Text style={styles.textStyleHead}>Lifestyle tips for cancer patients</Text>
                        <Text style={styles.textStyleHead2}>Focus on a healthy lifestyle with a balanced diet, regular exercise (as tolerated), and adequate hydration, while don't smoke, drink excessively, or expose yourself to infections</Text>
                    </View>
                    <Ionicons name={'chevron-forward'} size={25} color={'black'} />
                   
                </View>


            </View>
        </SafeAreaView >
    );
}

export default Activities

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',

    },
    imageBox: {
        width: 360,
        height: 240,
        // top: 94,
        backgroundColor: '#000038',
        alignItems: 'center',
        justifyContent: "center",
        marginVertical: 5


    },
    imageStyle: {
        width: 242,
        height: 202.8414306640625,
        // top: 19,
        // left: 59

    },
    activitiesView: {
        width: '90%',
        height: 400,
        // top: 370,
        // left: 16,
        gap: 14,
        // borderWidth: 1,
        marginVertical: 10,
        // padding:20
        

    },
    activityInsideView: {
        flexDirection: 'row',
        width: 368,
        height: 106,
        gap: 6,
        alignItems: 'center',
        borderBottomWidth: 1,
       

    },
    activityImage: {
        width: 71,
        height: 93,
    },
    textStyleHead: {
        width: 224,
        height: 20,
        // left: 77,
        // fontFamily: 'Roboto',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 20,
    },
    textStyleHead2: {
        // width: 224,
        // height: 64,
        // top: 42,
        // left: 77,
        opacity: 0.5,
        color: '#000000',
        // fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,



    }
})