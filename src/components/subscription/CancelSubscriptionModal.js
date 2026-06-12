import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/theme/colors";
import CustomizeAppButtonFilled from "../common/CustomizeAppButtonFilled";
import CustomizeAppButtonOutlined from "../common/CustomizeAppButtonOutlined";

export default function CancelSubscriptionModal({
  visible,
  keepLabel,
  confirmLabel,
  onKeep,
  onConfirm,
  loading,
  endDate,
}) {
  const formattedEndDate = endDate
    ? new Date(endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Cancel your Subscription?</Text>

          <Text style={styles.body}>
            You'll keep access to pro plan features until {formattedEndDate}.
            After that, your account will return to the Essential plan.
          </Text>

          <View style={styles.footer}>
            <View style={{ flex: 1 }}>
              <CustomizeAppButtonOutlined
                label={keepLabel || "keep subscription"}
                onPress={onKeep}
                borderColor={Colors.success}
                textColor={Colors.success}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomizeAppButtonFilled
                label={confirmLabel || "confirm cancellation"}
                onPress={onConfirm}
                backgroundColor={Colors.error}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 343,
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    gap: 16,
    alignItems: "center",
  },
  title: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
    textAlign: "center",
    color: Colors.textPrimary,
  },
  body: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    textAlign: "center",
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 4,
  },
});
