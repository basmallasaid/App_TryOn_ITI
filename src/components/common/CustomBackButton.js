import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
const CustomBackButton = ({ onPress, iconColor, borderColor,backgroundColor }) => {
  const { themeVersion } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
const styles = React.useMemo(() => StyleSheet.create({
  container: {
    width: 56,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom:16,
  },
}), [themeVersion]);

  return (
    <TouchableOpacity
      style={[styles.container, borderColor && { borderColor: borderColor },backgroundColor && {backgroundColor:backgroundColor}]}
      onPress={onPress}
    >
      <Ionicons
        name={isRTL ? "chevron-forward" : "chevron-back"}
        size={18}
        color={iconColor || Colors.iconGray}
      />
    </TouchableOpacity>
  );
};


export default CustomBackButton;
