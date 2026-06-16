import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Text, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";
import { ANIMATIONS } from "../../constants/images/animations";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");

const LoadingOverlay = ({ visible, type = "general" }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const [textIndex, setTextIndex] = useState(0);
  const intervalRef = useRef(null);

  const texts = t(`loading.${type}`, { returnObjects: true });

  useEffect(() => {
    if (visible) {
      setTextIndex(0);
      intervalRef.current = setInterval(() => {
        setTextIndex((prev) => (prev + 1) % texts.length);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible]);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "center",
          alignItems: "center",
        },
        card: {
          width: width * 0.85,
          backgroundColor: Colors.white,
          borderRadius: 24,
          paddingVertical: 40,
          paddingHorizontal: 24,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 24,
          elevation: 16,
        },
        animation: {
          width: width * 0.6,
          height: width * 0.6,
        },
        title: {
          fontFamily: "Roboto_700Bold",
          fontWeight: "700",
          fontSize: 18,
          color: Colors.textPrimary,
          marginTop: 16,
          textAlign: "center",
        },
        subtitle: {
          fontFamily: "Roboto_400Regular",
          fontSize: 14,
          color: Colors.textSecondary,
          marginTop: 8,
          textAlign: "center",
          lineHeight: 20,
          paddingHorizontal: 8,
        },
      }),
    [themeVersion]
  );

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <LottieView
            source={ANIMATIONS.SALESMAN}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.title}>
            {type === "tryOn"
              ? t("loading.tryOnTitle")
              : type === "recycle"
              ? t("loading.recycleTitle")
              : t("loading.generalTitle")}
          </Text>
          <Text style={styles.subtitle}>{texts[textIndex]}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingOverlay;
