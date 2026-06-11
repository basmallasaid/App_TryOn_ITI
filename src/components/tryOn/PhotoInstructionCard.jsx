import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";

export default function PhotoInstructionCard({
  title,
  sub,
  mainIconName,
  titleColor,
  iconBgColor,
  iconColor,
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor || "#DBE8FF" }]}>
        <MaterialCommunityIcons name={mainIconName} size={22} color={iconColor || Colors.iconGray} />
      </View>
      <Text style={[styles.cardTitle, { color: titleColor || Colors.textPrimary }]}>{title}</Text>
      <Text style={styles.cardSub} numberOfLines={3}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#F0F5FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 11,
    color: Colors.disabled,
    lineHeight: 16,
  },
});
