import React, { useEffect } from 'react';
import SafeScreen from '../../components/common/SafeScreen';
import { StyleSheet } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { IMAGES } from '../../constants/images/images';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';

const SplashScreen = () => {
  const { isDarkMode } = useTheme();

  const rOpacity = useSharedValue(0);
  const rScale = useSharedValue(0.7);

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);

  useEffect(() => {

    // First Logo Animation
    rOpacity.value = withTiming(1, {
      duration: 800,
    });

    rScale.value = withTiming(1, {
      duration: 800,
    });

    // Switch to Full Logo
    setTimeout(() => {

      rOpacity.value = withTiming(0, {
        duration: 500,
      });

      logoOpacity.value = withTiming(1, {
        duration: 700,
      });

      logoScale.value = withTiming(1, {
        duration: 700,
      });

    }, 1500);

  }, []);

  const rAnimatedStyle = useAnimatedStyle(() => ({
    opacity: rOpacity.value,
    transform: [
      {
        scale: rScale.value,
      },
    ],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      {
        scale: logoScale.value,
      },
    ],
  }));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rLogo: {
      width: 140,
      height: 140,
      position: 'absolute',
      alignSelf: 'center',
      top: '50%',
      marginTop: -70,
    },
    fullLogo: {
      width: 260,
      height: 120,
      position: 'absolute',
    },
  });

  return (
    <SafeScreen style={styles.container}>

      <Animated.Image
        source={IMAGES.REDOLAPY_R_SHAPE_LOGO}
        style={[styles.rLogo, rAnimatedStyle]}
        resizeMode="contain"
      />

      <Animated.Image
        source={isDarkMode ? IMAGES.REDOLAPY_LOGO_Dark : IMAGES.REDOLAPY_LOGO}
        style={[styles.fullLogo, logoAnimatedStyle]}
        resizeMode="contain"
      />

    </SafeScreen>
  );
};

export default SplashScreen;