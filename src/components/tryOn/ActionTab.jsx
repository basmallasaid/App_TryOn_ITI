import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ActionTab({ label, iconName, isActive, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.tabContainer, isActive && styles.activeTab]}
      onPress={onPress}
    >
      <Ionicons
        name={iconName}
        size={24}
        color={isActive ? "#008BFF" : "#718096"}
      />
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    color: "#718096",
    marginTop: 4,
  },
  activeTabText: {
    color: "#008BFF",
    fontWeight: "600",
  },
});
