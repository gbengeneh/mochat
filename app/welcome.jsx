import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import { wp, hp } from '../helper/common';
import { theme } from '../constants/theme';
import Button from '../components/Button';
import { useRouter } from 'expo-router';

const images = [
  require('../assets/images/welcome1.jpg'),
  require('../assets/images/welcome2.jpg'),
  require('../assets/images/welcome3.jpg'),
  require('../assets/images/welcome4.jpg'),
];

const Welcome = () => {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Welcome image slider */}
        <FlatList
          ref={flatListRef}
          data={images}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image style={styles.welcomeImage} resizeMode="contain" source={item} />
          )}
        />

        {/* Title */}
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>MoSel</Text>
          <Text style={styles.punchline}>
            Where you get everything you need at your fingertips. From groceries to electronics, we have it all!
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Getting started"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.push('signup')}
          />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.loginText}>Already have an account!</Text>
            <Pressable onPress={() => router.push('login')}>
              <Text style={[styles.loginText, { color: theme.colors.primary, fontWeight: theme.fonts.semibold }]}>
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: 'center',
    fontWeight: theme.fonts.extraBold,
  },
  punchline: {
    textAlign: 'center',
    paddingHorizontal: wp(12),
    fontSize: hp(1.9),
    color: theme.colors.text,
    paddingBottom: 100,
  },
  footer: {
    gap: 30,
    width: '100%',
    paddingBottom: 60,
  },
  buttonTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  loginText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6),
    margin: 1,
  },
});
