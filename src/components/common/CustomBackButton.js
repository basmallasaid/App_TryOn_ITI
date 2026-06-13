import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
const CustomBackButton = ({ onPress, iconColor, borderColor,backgroundColor }) => {
  return (
    <TouchableOpacity
      style={[styles.container, borderColor && { borderColor: borderColor },backgroundColor && {backgroundColor:backgroundColor}]}
      onPress={onPress}
    >
      <Ionicons
        name="chevron-back"
        size={18}
        color={iconColor || "#6B7280"}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D5D9DE",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});

export default CustomBackButton;
