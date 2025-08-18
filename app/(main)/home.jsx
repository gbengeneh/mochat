import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helper/common'
import Ionicons from '@expo/vector-icons/Ionicons';
import Avatar from '@/components/Avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'
import { getUserData } from '@/services/userService'
import PostCard from '@/components/PostCard'

let limit = 0;
const Home = () => {
     const {user , setUser} = useAuth();
  const [posts, setPosts] = useState([]);
    const router = useRouter();
    const [hasMore, setHasMore] = useState(true);



    const handlePostEvent = async (payload) =>{
      if (payload.eventType == 'INSERT' && payload?.new?.id){
        let newPost = {...payload.new};
        let res = await getUserData(newPost.userId);
        newPost.postLikes = [];
        newPost.comments = [{count: 0}];
        newPost.user = res.success ? res.data : {};
        setPosts(prevPost => [newPost, ...prevPost]);
        }
        
    }
  return (
    <ScreenWrapper bg={theme.colors.background}>
     <View style={styles.container}>
          {/* header */}
          <View style={styles.header}>
            <Text style={[styles.title, {color: theme.colors.text}]}>PingMe</Text>
            <View style={styles.icons}>
                <Pressable onPress={() => console.log('Notifications pressed')}>
                   <Ionicons name="notifications-outline" size={24} color="black" />

                   {/* notification count */}
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>3</Text>
                    </View>
                </Pressable>

                <Pressable onPress={() => console.log('Settings pressed')}>
                    <Avatar  uri={user?.image} size={hp(4.3)} rounded={theme.radius.sm} />
                </Pressable>
            </View>
          </View>

          {/* posts */}

          <FlatList 
             data={posts}
             showsHorizontalScrollIndicator={false}
             contentContainerStyle={styles.listStyle}
             keyExtractor={(item) => item.id.toString()}
             renderItem={({item}) =>
              <PostCard
               
              
              />
            }
             
          />
     </View>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
   container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: 'white',
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
  listStyle: {
    padding: 20,
    paddingHorizontal: wp(4),
  },
  loading: {
    marginVertical: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text,
  },
  newPostButton: {
    position: 'absolute',
    bottom: hp(10),
    right: wp(5),
    backgroundColor: theme.colors.primary,
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
})