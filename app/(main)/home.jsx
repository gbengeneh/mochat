import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helper/common'
import Ionicons from '@expo/vector-icons/Ionicons';
import Avatar from '@/components/Avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'
import { getUserData } from '@/services/userService'
import PostCard from '@/components/PostCard'
import Loading from '@/components/Loading'
import BottomNavigation from '@/components/BottomNavigation'
import { supabase } from '@/lib/supabase'
import { fetchPosts } from '@/services/postService'

let limit = 0;
const Home = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  const handlePostEvent = async (payload) => {
    if (payload.eventType == 'INSERT' && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }]
      newPost.user = res.success ? res.data : {};
      setPosts(prevPost => [newPost, ...prevPost]);
    }
    if (payload.eventType === "DELETE" && payload.old.id) {
      setPosts(prevPost => {
        let updatedPost = prevPost.filter(posts => posts.id != payload.old.id);
        return updatedPost;
      })
    }
    if (payload.eventType == 'UPDATE' && payload?.new?.id) {
      setPosts(prevPost => {
        let updatedPosts = prevPost.map(posts => {
          if (posts.id == payload.new.id) {
            posts.body = payload.new.body;
            posts.file = payload.new.file;
          }
          return posts;
        });
        return updatedPosts;
      })
    }
  }
  const handleNewComment = async (payload) => {
    console.log('got new comment', payload.new)
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      setPosts(prevPost => {
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments]
        }
      })
    }
  }
  const handleNewNotification = async (payload) => {
    console.log('got new notification: ', payload);
    if (payload.eventType == 'INSERT' && payload.new.id) {
      setNotificationCount(prev => prev + 1);
    }
  }


  useEffect(() => {

    let postChannel = supabase
      .channel('posts')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        handlePostEvent)
      .subscribe();
    let notificationChannel = supabase
      .channel('notifications')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `receiverId=eq.${user.id}`
        },
        handleNewNotification)
      .subscribe();

    let commentChannel = supabase
      .channel('comments')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `posts.id=eq.${posts?.id}`
        }, handleNewComment
      ).subscribe();
    //getPosts();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(commentChannel);
      supabase.removeChannel(notificationChannel);
    }
  }, [])

  const getPosts = async () => {
    //call the api here
    if (!hasMore) return null;
    limit = limit + 10;

    // console.log('fectching post: ', limit);
    let res = await fetchPosts(limit);
    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);
      setPosts(res.data)
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
               item={item}
               currentUser={user}
               router={router}
              
              />
            }
            onEndReached={() => {}  }
            onEndReachedThreshold={0}
             ListFooterComponent={
              hasMore ? (
              <View>
                <Loading />
              </View>
              ):(
                <Text style={styles.noPosts}>No more posts</Text>
              )
             }
          />

          {/* new post floating button */}
          <Pressable
          style={styles.newPostButton}
          onPress={() => router.push('/newPost')}
          >
            <Ionicons name="add" size={hp(3.5)} color="white" />
          </Pressable>

          {/* Bottom Navigation */}
          <BottomNavigation />
     </View>
    </ScreenWrapper>
  );
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
    bottom: hp(20),
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