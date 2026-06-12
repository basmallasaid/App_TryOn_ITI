import React from "react";
import { Modal, View, Text, StyleSheet, Dimensions } from "react-native";
import Colors from "../../constants/theme/colors";
import CustomizeAppButtonFilled from "../common/CustomizeAppButtonFilled";
import CustomizeAppButtonOutlined from "../common/CustomizeAppButtonOutlined";

const { width: screenWidth } = Dimensions.get("window");

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
          <View style={styles.contentWrap}>
            <Text style={styles.title}>Cancel your Subscription?</Text>

            <Text style={styles.body}>
              You'll keep access to pro plan features until{" "}
              <Text style={styles.bodyBold}>{formattedEndDate}</Text>.
              After that, your account will return to the Essential plan.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <View style={{ flex: 1 }}>
              <CustomizeAppButtonOutlined
                label={keepLabel || "keep subscription"}
                onPress={onKeep}
                borderColor={Colors.success}
                textColor={Colors.success}
                buttonHeight={56}
                labelStyle={{ lineHeight: 20 }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomizeAppButtonFilled
                label={confirmLabel || "confirm cancellation"}
                onPress={onConfirm}
                backgroundColor={Colors.error}
                loading={loading}
                buttonHeight={56}
                labelStyle={{ lineHeight: 20 }}
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
    width: Math.min(343, screenWidth - 32),
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingTop: 24,
    paddingHorizontal: 16,
    gap: 0,
  },
  contentWrap: {
    gap: 12,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderStrong,
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    lineHeight: 26,
    textAlign: "center",
    color: Colors.textPrimary,
  },
  body: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: Colors.textSecondary,
  },
  bodyBold: {
    fontFamily: "Roboto_600SemiBold",
    color: Colors.textPrimary,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 24,
    paddingBottom: 24,
  },
});
