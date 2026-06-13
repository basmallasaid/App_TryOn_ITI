import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

export default function ActionTab({ label, iconName, isActive, onPress }) {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    tabContainer: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 12,
      marginHorizontal: 5,
      borderRadius: 15,
      backgroundColor: "#F0F2F5",
    },
    activeTab: {
      backgroundColor: "#E6F2FF",
    },
    tabText: {
      fontSize: 12,
      color: Colors.textMuted,
      marginTop: 4,
    },
    activeTabText: {
      color: "#008BFF",
      fontWeight: "600",
    },
  }), [themeVersion]);

  return (
    <TouchableOpacity
      style={[styles.tabContainer, isActive && styles.activeTab]}
      onPress={onPress}
    >
      <Ionicons
        name={iconName}
        size={24}
        color={isActive ? "#008BFF" : Colors.textMuted}
      />
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
