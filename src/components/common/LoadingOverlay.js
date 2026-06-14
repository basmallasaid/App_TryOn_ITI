import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Text, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { ANIMATIONS } from "../../constants/images/animations";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");

const FUNNY_TEXTS = {
  tryOn: [
    "Our AI stylist is picking the perfect look… and arguing about accessories",
    "Dressing up your avatar… they're very picky today",
    "Almost there! The virtual mirror is polishing its pixels",
    "Teaching the AI what 'fashionable' means… it's a work in progress",
    "Your outfit is being assembled with love (and a hint of jealousy)",
    "The digital tailor is taking measurements… stop fidgeting",
    "Rendering fabulousness… please hold",
    "AI says: 'This outfit is fire!'… but let me double-check",
    "Your avatar is striking a pose for the camera",
    "Mixing and matching like a pro… or at least an AI trying its best",
  ],
  recycle: [
    "Turning your old clothes into something fabulous… give us a sec",
    "The recycling fairy is working her magic on your wardrobe",
    "One person's trash is another's treasure… and we're making treasure",
    "Your clothes are getting a second chance at life (and maybe a promotion)",
    "Upcycling in progress… please don't give up on your clothes yet",
    "Transforming threads into dreams… standby",
    "The fashion alchemist is brewing something great",
    "Your old tee is about to become the next big thing",
    "Saving the planet one outfit at a time… processing…",
    "Eco-friendly fashion coming right up!",
  ],
  general: [
    "Good things come to those who wait… like really good outfits",
    "Our fashion bots are working overtime (they don't need coffee)",
    "Pixels are aligning… please hold your applause",
    "Your fashion future is being generated… it's looking bright",
    "The style algorithm is consulting the fashion gods",
    "Hold still… the AI is learning what 'fashionable' means",
    "We're making magic happen behind the scenes… literally",
    "If you hear beeping, that's just the AI getting excited",
  ],
};

const LoadingOverlay = ({ visible, type = "general" }) => {
  const { themeVersion } = useTheme();
  const [textIndex, setTextIndex] = useState(0);
  const intervalRef = useRef(null);

  const texts = FUNNY_TEXTS[type] || FUNNY_TEXTS.general;

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
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
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
              ? "Virtual Try-On in Progress"
              : type === "recycle"
              ? "Generating Your Design"
              : "Just a moment..."}
          </Text>
          <Text style={styles.subtitle}>{texts[textIndex]}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingOverlay;
