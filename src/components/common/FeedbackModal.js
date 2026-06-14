import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import CustomizeAppButtonFilled from "./CustomizeAppButtonFilled";

const FeedbackModal = ({ visible, onClose, type = "success", title, message }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const isSuccess = type === "success";
  const iconName = isSuccess ? "checkmark-circle" : "alert-circle";
  const iconColor = isSuccess ? Colors.success : Colors.error;

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        },
        container: {
          width: 320,
          padding: 24,
          backgroundColor: Colors.white,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: Colors.borderDefault,
          alignItems: "center",
        },
        iconContainer: {
          marginBottom: 16,
        },
        title: {
          fontFamily: "Roboto_600SemiBold",
          fontWeight: "600",
          fontSize: 18,
          textAlign: "center",
          color: Colors.textPrimary,
          marginBottom: message ? 8 : 0,
        },
        message: {
          fontFamily: "Roboto",
          fontWeight: "400",
          fontSize: 14,
          textAlign: "center",
          color: Colors.textSecondary,
          lineHeight: 20,
        },
        footer: {
          marginTop: 24,
          width: "100%",
        },
      }),
    [themeVersion]
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={48} color={iconColor} />
          </View>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.footer}>
            <CustomizeAppButtonFilled label={t("common.ok")} onPress={onClose} />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FeedbackModal;
