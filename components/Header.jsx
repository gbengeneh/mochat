import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { useRouter } from 'expo-router'
import BackButton from './BackButton';
import { hp } from '../helpers/common';
import { theme } from '../constants/theme';
import { ThemeContext } from '@/contexts/ThemeContext';

const Header = ({title, showBackButton=true, mb=10}) => {
  const {currentTheme} = useContext(ThemeContext)
    const router = useRouter();
  return (
    <View style={[styles.container, {marginBottom: mb}]}>
      {
        showBackButton && (
            <View style={styles.BackButton}>
                <BackButton  router={router}/>
            </View>
        )
      }
      <Text style={[styles.title, {color: currentTheme.colors.text}]}>{title || ""}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        gap: 10,
    },
    title:{
        fontSize: hp(2.7),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.textDark
    },
    BackButton:{
        position: 'absolute',
        left: 0
    }
})