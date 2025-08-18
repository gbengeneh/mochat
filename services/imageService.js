
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';
import { supabaseUrl } from '../constants';

export const getUserImageSrc = imagePath => {
    if (imagePath) {
        return getSupabaseFileUri(imagePath);
    } else {
        return require('../assets/images/persons/user.jpg');
    }
};

export const getSupabaseFileUri = filepath => {
    if (filepath) {
        return { uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filepath}` };
    }
    return null;
};

export const getPostFileUrl = filepath => {
    if (filepath) {
        return `${supabaseUrl}/storage/v1/object/public/posts/${filepath}`;
    }
    return null;
};

export const downloadFile = async (url) => {
    try {
        const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
        return uri;
    } catch (error) {
        return null;
    }
};

export const getLocalFilePath = filePath => {
    let fileName = filePath.split('/').pop();
    return `${FileSystem.documentDirectory}${fileName}`;
};

export const uploadFile = async (bucketName = 'uploads', folderName, fileUri, isImage = true) => {
    try {
        let fileName = getFilePath(folderName, isImage);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });
        let imageData = decode(fileBase64); // array buffer
        let { data, error } = await supabase
            .storage
            .from(bucketName)
            .upload(fileName, imageData, {
                cacheControl: '3600',
                upsert: false,
                contentType: isImage ? 'image/*' : 'video/*'
            });
        if (error) {
            console.log('file upload error: ', error);
            return { success: false, msg: 'Could not upload media' };
        }
        return { success: true, data: data.path };
    } catch (error) {
        console.log('file upload error: ', error);
        return { success: false, msg: 'Could not upload media' };
    }
};

export const getFilePath = (folderName, isImage) => {
    return `/${folderName}/${(new Date()).getTime()}${isImage ? '.png' : '.mp4'}`;
};

export const uploadChatAttachment = async (fileUri, isImage = true) => {
    return await uploadFile('uploads', "chat_attachments", fileUri, isImage);
};

export const uploadPostFile = async (fileUri, isImage = true) => {
    return await uploadFile('posts', "posts", fileUri, isImage);
};
