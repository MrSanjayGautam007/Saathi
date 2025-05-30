import { ScrollView, StyleSheet, Text, useWindowDimensions, View, Image, Share, TouchableOpacity, StatusBar } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';
const BlogsDetails = ({ route }) => {
    const { item } = route.params;
    const { width, height } = useWindowDimensions();
    const { t } = useLanguage();
    // Convert to local date string
    const dateObj = new Date(item.created_at);
    const formattedDate = dateObj.toLocaleString('default', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const imageUrl = `https://bcssprojects.in/Saathi/public/${item.image}`; // Replace with real base URL

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${item.title}\n\n${item.desciption}\n\nRead more: https://bcssprojects.in/Saathi/public/blog/${item.id}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBackgroundColor('#6A6BBF');
            StatusBar.setBarStyle('light-content');
        }, [])
    );
    return (
        <SafeAreaView style={[styles.mainView, { width, height }]}>
            <StatusBar backgroundColor={'#6A6BBF'} barStyle={'light-content'} />
            <Header title={t("Blog Details")} textColor={'#fff'} iconColor={'#fff'} />
            <ScrollView contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Image source={{ uri: imageUrl }} style={styles.blogImage} resizeMode="cover" />

                <Text style={styles.title}>{item.title}</Text>

                <Text style={styles.dateText}>Posted on {formattedDate}</Text>

                <Text style={styles.description}>{item.desciption}</Text>
                <View style={styles.buttonRow}>
                    {/* <TouchableOpacity
                    
                    onPress={handleShare} style={styles.iconButton}>
                        <Ionicons name="share-social-outline" size={24} color="#512DA8" />
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity onPress={() => console.log('Bookmark clicked')} style={styles.iconButton}>
                        <Ionicons name="bookmark-outline" size={24} color="#512DA8" />
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default BlogsDetails;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#6A6BBF',
        paddingHorizontal: 10,
        // alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    blogImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: '#eee',
        

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#fff',
        // textAlign: 'center',
    },
    dateText: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#fff',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 20,
    },
    iconButton: {
        marginLeft: 15,
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
    },

});
