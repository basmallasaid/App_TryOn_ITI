import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { useTranslation } from 'react-i18next';
import { IMAGES } from "../../constants/images/images";
import LottieView from "lottie-react-native";
import { ANIMATIONS } from "../../constants/images/animations";
import Typography from "../../constants/theme/typography";

const VerificationSucessComponent = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>

      {/* Illustration as base */}
      <View style={styles.illustrationWrapper}>
        <Image
          source={IMAGES.SUCCESS_ILLUSTRATION}
          style={styles.illustration}
          resizeMode="contain"
        />
        {/* Lottie floats over the illustration, centered on it */}
        <LottieView
          source={ANIMATIONS.FIREWORKS}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      <Text style={styles.title}>{t('auth.verifyOtp.successTitle')}</Text>
      <Text style={styles.subtitle}>
        {t('auth.verifyOtp.successSubtitle')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  illustrationWrapper: {
    width: 160,
    height: 160,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: 130,
    height: 130,
  },
  animation: {
    position: "absolute", 
    width: 350,            
    height: 280,
  },
  title: {
    ...Typography.label,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.subtitleBase,
    textAlign: "center",
  },
});

export default VerificationSucessComponent;