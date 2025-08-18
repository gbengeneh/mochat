import { View, Text, StatusBar, ScrollView, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import BackButton from "@/components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "@/helper/common";
import { theme } from "@/constants/theme";
import Input from "@/components/Input";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle } from "@/services/userService";

const SignUp = () => {
  const router = useRouter();
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if ( !emailRef.current || !passwordRef.current ) {
      return alert("Please fill in all fields");
    }
    if (passwordRef.current !== confirmPasswordRef.current) {
      Alert.alert("Passwords do not match");
      return;
    }

    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    setLoading(true);

    const response = await supabase.auth.signUp({
      email,
      password,    
      options:{
        data:{name: name}
      } 
    });

    const {data, error} = response;
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    if(data?.session){
      console.log("Session: ", data.session);
      Alert.alert("Success", "Account created successfully!");
    }else{
      console.log("no session: ", data);
      Alert.alert("Success", "Account created successfully! Please check your email for verification.");
    }
  }

 const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (!result.success) {
      Alert.alert('Error', result.msg);
    } else {
      Alert.alert('Success', 'Signed in successfully with Google!');
    }
  };

  const handleAppleSignIn = ()=>{}


  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
      >
        <View style={StyleSheet.container}>
          <BackButton router={router} />

          {/* welcome greetings */}
          <View>
            <Text style={styles.welcometext}>Let's</Text>
            <Text style={styles.welcometext}>Get Started</Text>
          </View>
          {/* form */}
          <View style={styles.input}>
            <Text
              
            style={{ fontSize: hp(1.9), color: theme.colors.text, marginTop: 10 }}>
              Kindly input your details
            </Text>
            <Input
              
               icon={<FontAwesome6 name="user" size={26} color="black" />}
               placeholder="Enter your name"
               onChangeText={value => nameRef.current = value}
            />
            <Input
               icon={<AntDesign name="mail" size={24} color="black" />}
               placeholder="Enter your Email address"
               onChangeText={value => emailRef.current = value}
            />
            <Input
               icon={<FontAwesome6 name="lock" size={26} color="black" />}
               placeholder="Enter your Password"
               secureTextEntry
               onChangeText={value => passwordRef.current = value}
            />
            <Input
               icon={<FontAwesome6 name="lock" size={26} color="black" />}
               placeholder="Confirm Password"
               secureTextEntry
               onChangeText={value => confirmPasswordRef.current = value}
            />

             <Button title={'Sign Up'} loading={loading} onPress={onSubmit} />
          </View>
           {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>or</Text>
            <View style={styles.line} />
          </View>

           {/* Social Login Buttons */}
          <View style={styles.form}>
            <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
              <AntDesign name="google" size={24} color="black" />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAppleSignIn}>
              <Ionicons name="logo-apple-appstore" size={24} color="black" />
              <Text style={styles.buttonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>
            
             {/* footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?
            </Text>
            <Pressable onPress={() => router.push('login')}>
              <Text style={[styles.footerText, { color: theme.colors.primary,
                 fontWeight: theme.fonts.semibold }]}>Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
 container:{
  flex: 1,
  gap: 45,
  paddingHorizontal: wp(5)
 },
  welcometext: {
    fontSize: hp(4),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  form: {
    gap: hp(2),
  },
  input: {
   gap: 16,
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    paddingBottom: 40,
    marginTop: 20,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6)
  },
  socialLogin: {
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    height: hp(7.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    paddingHorizontal: 18,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: hp(2),
    color: '#404040',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 20,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: theme.colors.text,
  },
  or: {
    fontSize: hp(2),
    color: theme.colors.text,
    textAlign: 'center',
  },

  
});
