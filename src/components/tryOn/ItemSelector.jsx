import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const options = [
  { id: "Tops", label: "Tops", icon: "tshirt-crew-outline" },
  { id: "Pants", label: "Pants", icon: "hanger" },
  { id: "Dresses", label: "Dresses", icon: "human-female-dance" },
];

export default function ItemSelector({ label, selectedType, onSelectType }) {
  return (
    <View style={[styles.mainCard, { borderColor: selectedType ? "#40B9FF" : "#A0AEC0" }]}>
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.subtitle}>select from below to start try-on</Text>

      <View style={styles.optionsContainer}>
        {options.map((item) => {
          const isActive = selectedType === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onSelectType(item.id)}
              activeOpacity={0.7}
              style={[
                styles.optionButton,
                isActive ? styles.activeOption : styles.inactiveOption,
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                  color={isActive ? "#40B9FF" : "#78909c"}
                style={styles.iconStyle}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: isActive ? "#37474f" : "#78909c" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#90a4ae",
    marginBottom: 25,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1.5,
    flex: 0.31,
  },
  activeOption: {
    backgroundColor: "#fff",
    borderColor: "#40B9FF",
  },
  inactiveOption: {
    backgroundColor: "#fff",
    borderColor: "#eceff1",
  },
  iconStyle: {
    marginRight: 8,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
