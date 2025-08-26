import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { hp } from '../helper/common';
import { theme } from '../constants/theme';

const BottomNavigation = () => {
    const router = useRouter();
    const currentPath = usePathname();

    const isActive = (path) => currentPath === path;

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.iconContainer}
                onPress={() => router.push('/home')}
            >
                <Ionicons
                    name={isActive('/home') ? 'home' : 'home-outline'}
                    size={hp(3.2)}
                    color={isActive('/home') ? 'white' : theme.colors.inactive}
                />
            </Pressable>

            <Pressable
                style={styles.iconContainer}
                onPress={() => router.push('/search')}
            >
                <Ionicons
                    name={isActive('/search') ? 'search' : 'search-outline'}
                    size={hp(3.2)}
                    color={isActive('/search') ? 'white' : theme.colors.inactive}
                />
            </Pressable>

            <Pressable
                style={styles.iconContainer}
                onPress={() => router.push('/chats')}
            >
                <Ionicons
                    name={isActive('/chats') ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
                    size={hp(3.2)}
                    color={isActive('/chats') ? 'white' : theme.colors.inactive}
                />
            </Pressable>

            <Pressable
                style={styles.iconContainer}
                onPress={() => router.push('/settingPage')}
            >
                <Ionicons
                    name={isActive('/settingPage') ? 'settings' : 'settings-outline'}
                    size={hp(3.2)}
                    color={isActive('/settingPage') ? 'white' : theme.colors.inactive}
                />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: hp(2),
        marginBottom: hp(7),
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BottomNavigation;
