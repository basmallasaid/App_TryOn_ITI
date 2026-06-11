import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";

const CustomBackButton = ({ onPress, iconColor, borderColor,backgroundColor }) => (
  <TouchableOpacity
    style={[styles.container, borderColor && { borderColor: borderColor },backgroundColor && {backgroundColor:backgroundColor}]}
    onPress={onPress}
  >
    <Ionicons
      name="chevron-back"
      size={18}
      color={iconColor || "#6B7280"} // Default to gray if no color passed
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D5D9DE",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});

export default CustomBackButton;
