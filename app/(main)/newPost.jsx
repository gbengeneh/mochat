import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { hp, wp } from '@/helper/common'
import { theme } from '@/constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'
import Header from '@/components/Header'
import Avatar from '@/components/Avatar'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from '@/contexts/AuthContext'
import TextArea from '@/components/TextArea'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getSupabaseFileUri } from '@/services/imageService'
import { Ionicons } from '@expo/vector-icons'
import Button from '@/components/Button'
import { Image } from 'expo-image'
import AntDesign from '@expo/vector-icons/AntDesign';
import { Video } from 'expo-av'
import { createOrUpdatePost } from '@/services/postService'


const newPost = () => {
  const {user} = useAuth();
  const post = useLocalSearchParams();
  const router =useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [bodyText , setBodyText] = useState("");


  useEffect(()=>{
      if(post && post.id){
        setBodyText(post.body || "");
        setFile(post.file || null);
      }
  },[])
   
 const onPick = async (isImage) => {

        let mediaConfig = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.7,
        }
        if (!isImage) {
          mediaConfig = {
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
          }
        }
    
        let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    
        console.log('file: ', result.assets[0]);
        if (!result.canceled) {
          setFile(result.assets[0]);
        }
      }
    

  const isLocalFile = file =>{
    if(!file) return null;
     if(typeof file == 'object') return true;
     return false;
  }
   const getFileType = file => {
        if (!file) return null;
        if (isLocalFile(file)) {
          return file.type;
        }
    
        // check image or video for remote file
        if (file.includes('postImages')) {
          return 'image';
        }
        return 'video'
      }

      const getfileUri = file => {
        if (!file) return null;
        if (isLocalFile(file)) {
          return file.uri;
        }
        return getSupabaseFileUri(file)?.uri;
      }

  const onSubmit = async () => {
    if (!bodyText && !file) {
      Alert.alert('Post', "Please choose an image or add post body");
      return;
    }

    const data = { file, body: bodyText, userId: user?.id, id: post?.id };
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);

    if (res.success) {
      setBodyText('');
      setFile(null);
      router.back();
    } else {
      Alert.alert('Post', res.msg);
    }
  };


  return (
    <ScreenWrapper bg={theme.colors.background} barStyle="dark-content">
        <View style={styles.container}>
            <Header title={"Create Post"}/>
            <ScrollView contentContainerStyle={{gap :20}}>
              <View style={styles.header}>
                  <Avatar uri={user?.image} size={hp(6.5)}  rounded={theme.radius.xl}/>
                  <View style={{gap:2}}>
                    <Text style={styles.username}>{user?.name}</Text>
                    <Text style={styles.publicText}>Public <Text>▼</Text></Text>
                  </View>
              </View>
              <View style={styles.textEditor}>
               <TextArea 
               style={[styles.TextArea,{color:theme.colors.text}]}
                placeholder="What's on your mind?"
                multiline
                value={bodyText}
                onChangeText={setBodyText}
               />
              </View>
              {file && (
                       <View style={styles.file}>
                          {getFileType(file) == 'video' ? (
                             <Video
                                  style={{ flex: 1 }}
                                  source={{ uri: getfileUri(file) }}
                                  useNativeControls
                                  resizeMode="cover"
                                  isLooping
                                />
                          ) : (
                           <Image source={{ uri: getfileUri(file) }} resizeMode="cover" style={{ flex: 1 }} />
                          )}
                           <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                               <AntDesign name="delete" size={24} color="red" />
                         </Pressable>
                       </View>
              )}
              <View style={styles.media} onPress={() => onPick(true)}>
                  <Text style={styles.addImageText}>Add to your post</Text>
                  <View style={styles.mediaIcons}>
                      <Pressable style={styles.imageIcon} onPress={() => onPick(true)}>
                          <Ionicons name="image-outline" size={24} color={theme.colors.primary} />
                      </Pressable>
                      <Pressable style={styles.imageIcon} onPress={() => onPick(false)}>
                          <Ionicons name="videocam-outline" size={24} color={theme.colors.primary} />
                      </Pressable>
                  </View>
              </View>

            </ScrollView>
             <Button
                buttonStyle={{ height: hp(6.2) }}
                title={post && post.id ? "Update" : "Post"}
                loading={loading}
                hasShadow={false}
                onPress={onSubmit}
                disabled={loading}
              />
        </View>

    </ScreenWrapper>
  )
}

export default newPost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  title: {
    marginBottom: 10,
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight
  },
  textEditor: {
    marginTop: 10
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  addImageText: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  imageIcon: {
    // backgroundColor: theme.colors.grey,
    borderRadius: theme.radius.md,
    // padding: 6,
  },
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous'
  },
  video: {

  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backkgroundColor: 'rgba(255,0,0,0.6)'
    // shadowColor: theme.colors.textLight,
    // shadowOffset:{width: 0, height: 3},
    // shadowOpacity: 0.6,
    // shadowRadius: 8,
  },
})