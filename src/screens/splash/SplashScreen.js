import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { IMAGES } from '../../constants/images/images';

const SplashScreen = () => {

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

  return (
    <View style={styles.container}>

      <Animated.Image
        source={IMAGES.REDOLAPY_R_SHAPE_LOGO}
        style={[styles.rLogo, rAnimatedStyle]}
        resizeMode="contain"
      />

      <Animated.Image
        source={IMAGES.REDOLAPY_LOGO}
        style={[styles.fullLogo, logoAnimatedStyle]}
        resizeMode="contain"
      />

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rLogo: {
    width: 140,
    height: 140,
    position: 'absolute',
  },

  fullLogo: {
    width: 260,
    height: 120,
    position: 'absolute',
  },

});

export default SplashScreen;