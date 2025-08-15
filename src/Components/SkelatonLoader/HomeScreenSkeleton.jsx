import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Skeleton } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient'

const { width } = Dimensions.get('window');

const HomeScreenSkeleton = () => {
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#6A6BBF' }}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Hello User Section */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <Skeleton
                    animation="wave"
                    LinearGradientComponent={LinearGradient}
                    width={40}
                    height={40}
                    circle
                />
                <Skeleton
                    animation="wave"
                    LinearGradientComponent={LinearGradient}
                    width={180}
                    height={30}
                    style={{ marginLeft: 10 }}

                />
                <Skeleton
                    animation="wave"
                    LinearGradientComponent={LinearGradient}
                    width={40}
                    height={40}
                    style={{ marginLeft: 'auto' }}
                    circle
                />
            </View>

            {/* Reminder Card */}
            <Skeleton
                animation="wave"
                LinearGradientComponent={LinearGradient}
                width={'100%'}
                height={90}
                style={{ borderRadius: 20, marginBottom: 20 }}
            />

            {/* "What would you like to do?" Title */}
            <Skeleton
                animation="wave"
                LinearGradientComponent={LinearGradient}
                width={240}
                height={32}
                style={{ marginBottom: 20 }}
            />

            {/* Card Buttons (4 cards, 2 per row) */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {[1, 2, 3, 4].map((_, i) => (
                    <Skeleton
                        key={i}
                        animation="wave"
                        LinearGradientComponent={LinearGradient}
                        width={width * 0.44}
                        height={88}
                        style={{ borderRadius: 20, marginBottom: 20 }}
                    />
                ))}
            </View>

            {/* Blogs Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                <Skeleton
                    animation="wave"
                    LinearGradientComponent={LinearGradient}
                    width={150}
                    height={28}
                />
                <Skeleton
                    animation="wave"
                    LinearGradientComponent={LinearGradient}
                    width={80}
                    height={28}
                    style={{ borderRadius: 20 }}
                />
            </View>

            {/* Blog Horizontal List */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[1, 2, 3].map((_, i) => (
                    <View key={i} style={{ marginRight: 16 }}>
                        <Skeleton
                            animation="wave"
                            LinearGradientComponent={LinearGradient}
                            width={120}
                            height={160}
                            style={{ borderRadius: 20 }}
                        />
                        {/* <Skeleton
              animation="wave"
              LinearGradientComponent={LinearGradient}
              width={120}
              height={20}
              style={{ marginTop: 8 }}
            /> */}
                    </View>
                ))}
            </ScrollView>
        </ScrollView>
    );
};

export default HomeScreenSkeleton;
