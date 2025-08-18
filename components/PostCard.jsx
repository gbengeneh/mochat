import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { theme } from '../constants/theme'
import { hp, stripHtmlTags, wp } from '../helper/common'
import Avatar from './Avatar'
import moment from 'moment'
import { Image } from 'expo-image'
import { downloadFile, getSupabaseFileUri } from '../services/imageService'
import { Video } from 'expo-av'
import { createPostsLike } from '../services/postService'
import { removePostLike } from '../services/postService'
import Loading from './Loading'
import { Alert } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import BottomNavigation from './BottomNavigation'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import EvilIcons from '@expo/vector-icons/EvilIcons';



const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow = true,
    showMoreIcon = true,
    showDelete = false,
    onDelete = () => { },
    onEdit = () => { }
}) => {
    const shadowStyles = {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1
    }
    const [loading, setLoading] = useState(false);
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        setLikes(item?.postLikes);
    }, []);

    const openPostDeatials = () => {
        if (!showMoreIcon) return null;
        router.push({ pathname: 'postDetails', params: { postId: item?.id } })
    }

    const formatCreatedAt = (createdAt) => {
        const now = moment();
        const createdMoment = moment(createdAt);

        // If it's less than 24 hours ago
        if (now.diff(createdMoment, 'hours') < 24) {
            return createdMoment.fromNow(); // Outputs "X hours ago"
        }

        // Fallback to formatted date and time
        return createdMoment.format('MMM D, h:mm A'); // Outputs "Dec 14, 10:30 AM"
    };

    // Usage
    const createdAt = formatCreatedAt(item?.created_at);

    const onLike = async () => {
        if (liked) {
            // remove like
            let updatedLikes = likes.filter(like => like.userId != currentUser?.id);
            setLikes([...updatedLikes]);
            let res = await removePostLike(item?.id, currentUser?.id);
            console.log('remove like: ', res);
            if (!res.success) {
                Alert.alert('Post', 'Something went wrong');
            }
        } else {
            let data = {
                userId: currentUser?.id,
                postId: item?.id
            }
            setLikes([...likes, data]);
            let res = await createPostsLike(data);
            console.log('added like: ', res);
            if (!res.success) {
                Alert.alert('Post', 'Something went wrong');
            }
        }
    }

    const onShare = async () => {
        let content = { message: stripHtmlTags(item?.body) };
        if (item?.file) {
            // download the file then share the local uri
            setLoading(true);
            let url = await downloadFile(getSupabaseFileUri(item?.file).uri);
            console.log('uri is: ', url)
            setLoading(false);
            content.url = url;

        }
        Share.share(content);
    }
    const handlePostDelete = () => {
        Alert.alert('Confirm', "Are you sure you want to delete?", [
            {
                text: 'Cancel',
                onPress: () => console.log('modal cancelled'),
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => onDelete(item),
                style: 'destructive'
            }
        ])
    }


    const liked = likes.filter(like => like.userId == currentUser?.id)[0] ? true : false;

    return (
        <View style={[styles.container, hasShadow && shadowStyles, { backgroundColor: theme.colors.darkLight, borderColor: theme.colors.darkLight }]}>
            <View style={styles.header}>
                {/* user info and post time */}
                <View style={styles.userInfo}>
                    <Avatar
                        size={hp(4.5)}
                        uri={item?.user?.image}
                        rounded={theme.radius.md}
                    />
                    <View style={{ gap: 2 }}>
                        <Text style={[styles.username,{ color: theme.colors.text }]}>{item?.user?.name}</Text>
                        <Text style={[styles.postTime, { color: theme.colors.textLight } ]}>{createdAt}</Text>
                    </View>
                </View>
                {
                    showMoreIcon && (
                        <TouchableOpacity onPress={openPostDeatials}>
                            <Entypo name="dots-three-horizontal" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    )
                }
                {
                    showDelete && currentUser.id == item?.userId && (
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={()=> onEdit(item)}>
                               <Feather name="edit" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePostDelete}>
                                <AntDesign name="delete" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                    )
                }

            </View>

            {/* post body & media */}
            <View style={styles.content}>
                <View style={[styles.postBody, { color: theme.colors.text }]}>
                    {item?.body && (
                        <Text style={{ color: theme.colors.text }}>{item?.body}</Text>
                    )}
                </View>
                {
                    item.file && item?.file?.includes('postImages') && (
                        <Image
                            source={getSupabaseFileUri(item?.file)}
                            transition={100}
                            style={styles.postMedia}
                            contentFit='cover'
                        />
                    )
                }
                {/* post video */}
                {
                    item?.file && item?.file?.includes('postVideos') && (
                        <Video
                            style={[styles.postMedia, { height: hp(30) }]}
                            source={getSupabaseFileUri(item?.file)}
                            useNativeControls
                            resizeMode='cover'
                            isLooping
                        />
                    )
                }
            </View>
            {/* like , comment & share */}
            <View style={styles.footer}>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={onLike}>
                        <EvilIcons name="heart" size={24} fill={liked ? theme.colors.rose : 'transparent'} color={liked ? theme.colors.rose : theme.colors.textLight} />
                        
                    </TouchableOpacity>
                    <Text style={styles.count}>
                        {
                            likes?.length
                        }
                    </Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={openPostDeatials}>
                       <FontAwesome5 name="comment-alt" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.count}>
                        {

                            item?.comments[0]?.count
                        }
                    </Text>
                </View>
                <View style={styles.footerButton}>
                    {
                        loading ? (
                            <Loading size='small' />
                        ) : (
                            <TouchableOpacity onPress={onShare}>
                               <Entypo name="share" size={24} color={theme.colors.textLight} />
                            </TouchableOpacity>
                        )
                    }

                </View>
            </View>
        </View>
    )
}

export default PostCard

const styles = StyleSheet.create({
 
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl * 1.1,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    username: {
        fontSize: hp(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium
    },
    postTime: {
        fontSize: hp(1.4),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium
    },
    content: {
        gap: 10,
        //marginBottom
    },
    postMedia: {
        height: hp(40),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous'
    },
    postBody: {
        marginLeft: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        fap: 5
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },
    count: {
        color: theme.colors.text,
        fontSize: hp(1.8)
    },

})