import { StyleSheet, Text, View, TextInput } from 'react-native'; // Correct import
import React from 'react';
import { theme } from '../constants/theme';
import { hp } from '../helper/common';


const Input = (props) => {
  return (
    <View style={[styles.container, 
    props.containerStyle 
    && props.containerStyle, 
    {borderColor: theme.colors.text, 
    borderCurve: theme.radius.xxl}]}>
      {props.icon && props.icon}
      <TextInput
        style={{ flex: 1 , color: theme.colors.text,}}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef || undefined} // Safe ref usage
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp(7.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    paddingHorizontal: 18,
    gap: 12,
  },
});
