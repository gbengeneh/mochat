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

const Login = () => {
   const router = useRouter();
   const emailRef = useRef('');
   const passwordRef = useRef('');
    const [loading, setLoading] = useState(false);
    const [email , setEmail] = useState('');

    const onSubmit = async () => {
      if (!emailRef.current || !passwordRef.current) {
        Alert.alert('Login', 'Please all is required');
        return;
      }
      let email = emailRef.current.trim();
      let password = passwordRef.current.trim();
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        Alert.alert('Login', error.message);
      }
    };
  
    const handleGoogleSignIn = ()=>{}
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
            <Text style={styles.welcometext}>Hey,</Text>
            <Text style={styles.welcometext}>Welcome Back</Text>
          </View>
          {/* form */}
          <View style={styles.input}>
            <Text
              
            style={{ fontSize: hp(1.9), color: theme.colors.text, marginTop: 10 }}>
              Kindly input your Login details
            </Text>
           
            <Input
               icon={<AntDesign name="mail" size={24} color="black" />}
               placeholder="Enter your Email address"
               onChangeText={(value) => (emailRef.current = value)}
            />
            <Input
               icon={<FontAwesome6 name="lock" size={26} color="black" />}
               placeholder="Enter your Password"
               secureTextEntry
               onChangeText={(value) => (passwordRef.current = value) }
            />
             <Pressable onPress={() => router.push('forgot-password')}>
              <Text style={{textAlign: "right"}}>Forget Password</Text></Pressable>

             <Button title={'Login'} loading={loading} onPress={onSubmit} />
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
              Don't have an account?
            </Text>
            <Pressable onPress={() => router.push('signup')}>
              <Text style={[styles.footerText, { color: theme.colors.primary,
                 fontWeight: theme.fonts.semibold }]}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

export default Login

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