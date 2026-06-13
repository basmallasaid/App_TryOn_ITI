import React, { useRef, useEffect } from "react";
import { Modal, View, Text, Animated, Pressable, StyleSheet, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import CustomizeAppButtonFilled from "../common/CustomizeAppButtonFilled";

const { width } = Dimensions.get("window");

export default function CancellationSuccessModal({ visible, onClose }) {
  const { t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 10,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.6);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="check-circle-outline" size={48} color={Colors.success} />
          </View>

          <Text style={styles.title}>{t("subscription.cancelSuccessTitle")}</Text>

          <Text style={styles.body}>
            {t("subscription.cancelSuccessBody")}
          </Text>

          <CustomizeAppButtonFilled
            label={t("subscription.ok")}
            onPress={onClose}
            backgroundColor={Colors.error}
          />
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: Math.min(343, width - 48),
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
    borderRadius: 20,
    gap: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5D0",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    lineHeight: 26,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  body: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 4,
  },
});
