import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";

const SelectionModal = ({ visible, onClose, onCamera, onGallery, title, subtitle }) => {
  const { t } = useTranslation();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>

              <View style={styles.footer}>
                {/* Left Side: Camera and Gallery */}
                <View style={styles.leftActions}>
                  <TouchableOpacity onPress={onCamera} style={styles.actionButton}>
                    <Text style={styles.primaryBtnText}>{t("wardrobe.camera")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onGallery} style={styles.actionButton}>
                    <Text style={styles.primaryBtnText}>{t("wardrobe.gallery")}</Text>
                  </TouchableOpacity>
                </View>

                {/* Right Side: Cancel */}
                <TouchableOpacity onPress={onClose} style={styles.actionButton}>
                  <Text style={styles.errorBtnText}>{t("wardrobe.cancel")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderStrong, 
  },
  title: {
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftActions: {
    flexDirection: "row",
    gap: 20,
  },
  actionButton: {
    paddingVertical: 4,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: "Roboto_500Medium",
    color: Colors.primary,
  },
  errorBtnText: {
    fontSize: 15,
    fontFamily: "Roboto_500Medium",
    color: Colors.error,
  },
});

export default SelectionModal;
