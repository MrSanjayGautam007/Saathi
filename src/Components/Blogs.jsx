
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, FlatList, Image, useWindowDimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Feather from 'react-native-vector-icons/dist/Feather';
import api from '../APIServices/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
const Blogs = () => {
  const { width, height } = useWindowDimensions();
  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { t } = useLanguage();
  useEffect(() => {
    getBlogs(); 
  }, []);
  const getBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blog-list');
      const result = response.data;
      console.log("Blogs:", result);

      if (result.success && Array.isArray(result.msg)) {
        setBlogList(result.msg); //
      } else {
        console.error("Error fetching blogs:", result.msg || "Unable to fetch blogs.");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };
  const renderItems = ({ item, index }) => {
    const localDate = new Date(item.created_at).toLocaleString();
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('BlogsDetails', { item })}
        style={styles.blogListView}>
        <View style={styles.blogImageView}>
          <Image
            resizeMode="cover"
            source={
              item.image
                ? { uri: `https://bcssprojects.in/Saathi/public/${item.image}` }
                : require('../assets/images/NotFound.jpeg')
               
            }
            style={styles.itemImage}
            resizeMethod='cover'
          />
          <Text 
          numberOfLines={1}
           ellipsizeMode="tail"
            style={styles.blogImageText}>{item.title}</Text>
        </View>
        <View style={styles.descriptionView}>
          <Text
            numberOfLines={2}
            // ellipsizeMode="tail"
            style={styles.descriptionText}>{item.desciption}</Text>

          <Text style={styles.dateText}>{localDate}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor('#6A6BBF'); 
      StatusBar.setBarStyle('light-content');
    }, [])
  );
  return (
    <SafeAreaView style={[styles.mainView, { height: height, width: width }]}>
      <StatusBar backgroundColor={'#6A6BBF'} barStyle={'light-content'} />
      <Header title={t('Blogs')} textColor={'#fff'} iconColor={'#fff'} />
      {
        loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
         
        ) : (
          <View style={[styles.contentBtnView, {

          }]}>
            <FlatList
              data={blogList}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={renderItems}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => {
                   
                    getBlogs();
                  }}
                />
              }
              ListEmptyComponent={() => (
                <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 20, color: '#fff' }}>
                  Blogs will appear here
                </Text>

              )}

              contentContainerStyle={{
                padding: 10,
                paddingBottom: 100,
              }}

            />
          </View>
        )
      }

    </SafeAreaView>
  );
};

export default Blogs;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#6A6BBF',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  contentBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 10,
    marginBottom: 10,

  },
  blogBtn: {
    width: 100,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#512DA8',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },


  listContainer: {
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
  },
  itemContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 10,
    height: 115,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    // marginRight: 10,
    borderWidth: 0.2,
  },


  blogListView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 4,
    paddingVertical: 10,
    paddingHorizontal: 5,
    // paddingBottom: 10,
    flexDirection: 'row',
    borderWidth: 0.9,
    borderColor: '#ddd',
    // height: 120,
    // width: '100%',
  },
  created_at: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',

  },
  descriptionText: {
    fontSize: 15,
    // color: '#999',
    marginTop: 5,
    textAlign: 'left',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  descriptionView: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    // flexDirection:'row'

  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  blogImageText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  blogImageView:{
    width: 70,
    height: 70,
    borderRadius: 10,
    // marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    
  }
});

