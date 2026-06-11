import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";

export default function SourceTab({ label, iconName, isActive, onPress, useMaterialIcons }) {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
    >
      {useMaterialIcons ? (
        <MaterialCommunityIcons
          name={iconName}
          size={20}
          color={isActive ? Colors.primary : Colors.iconGray}
        />
      ) : (
        <Ionicons
          name={iconName}
          size={20}
          color={isActive ? Colors.primary : Colors.iconGray}
        />
      )}
      <Text style={[styles.label, isActive && styles.activeLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#F0F2F5",
  },
  activeTab: {
    backgroundColor: "#E6F2FF",
  },
  label: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    color: Colors.iconGray,
    marginTop: 4,
  },
  activeLabel: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
