import { StyleSheet, TextInput, View } from 'react-native';  
import React from 'react';  
import { theme } from '../constants/theme';  
import { hp } from '../helper/common';  

const TextArea = (props) => {  
  return (  
    <View style={[styles.container, props.containerStyle]}>  
      {props.icon && props.icon}  
      <TextInput  
        style={styles.textInput} // Use defined style for the TextInput  
        placeholderTextColor={theme.colors.textLight}  
        ref={props.inputRef || undefined} // Safe ref usage  
        multiline // Make the TextInput multiline  
        textAlignVertical="top" // Start the text at the top  
        {...props}  
      />  
    </View>  
  );  
};  

export default TextArea;  

const styles = StyleSheet.create({  
  container: {  
    flexDirection: 'row',  
    height: hp(30), // Adjust based on your needs  
    alignItems: 'flex-start', // Align items at the start  
    borderWidth: 0.4,  
    borderColor: theme.colors.text,  
    borderRadius: theme.radius.xxl,  
    padding: 12, // Same padding for better aesthetics  
  },  
  textInput: {  
    flex: 1,  
    padding: 5, // Padding to ensure text doesn't stick to the top  
    fontSize: hp(2), // Customize based on your theme  
    color: theme.colors.text, // Color for the input text  
    // Additional styles can be added here  
  },  
});