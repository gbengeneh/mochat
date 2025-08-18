import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Icon from '../assets/icons';
import { useRouter, usePathname } from 'expo-router'; // usePathname is used to get the current route
import { hp } from '../helper/common';
import { theme } from '../constants/theme';

const BottomNavigation = () => {
    const router = useRouter();
    const currentPath = usePathname(); // Get the current active path

    const isActive = (path) => currentPath === path; // Function to check if the path is active

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.iconContainer}
                onPress={() => router.push('/home')}
            >
                <Icon
                    name="home"
                    size={hp(3.2)}
                    strokeWidth={2}
                    color={isActive('/home') ? 'white' : theme.colors.inactive}
                />
            </Pressable>

            <Pressable
                style={styles.iconContainer}
                onPress={() => router.push('search')}
            >
                <Icon
                    name="explore"
                    size={hp(3.2)}
                    strokeWidth={2}
                    color={isActive('explore') ? 'white' : theme.colors.inactive}
                />
            </Pressable>

            <Pressable
                style={styles.iconContainer}
                onPress={() => router.push('chats')}
            >
                <Icon
                    name="message2"
                    size={hp(3.2)}
                    strokeWidth={2}
                    color={isActive('/chats') ? 'white' : theme.colors.inactive}
                />
            </Pressable>

            <Pressable
                style={styles.iconContainer}
                onPress={() => router.push('settingPage')}
            >
                <Icon
                    name="settings"
                    size={hp(4.2)}
                    strokeWidth={2}
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
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: hp(1.4),
        marginTop: 4,
    },
});

export default BottomNavigation;
