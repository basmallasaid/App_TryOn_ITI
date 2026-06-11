import React from "react";
import { TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WardrobeCard({ item, isSelected, onToggle, disabled }) {
  const imageSource = typeof item.image === "string" ? { uri: item.image } : item.image;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, disabled && !isSelected && { opacity: 0.5 }]}
      onPress={() => {
        if (disabled && !isSelected) return;
        onToggle(item._id || item.id);
      }}
      activeOpacity={disabled && !isSelected ? 1 : 0.7}
    >
      <View style={[styles.imageWrapper, isSelected && styles.activeImageWrapper]}>
        <Image source={imageSource} style={styles.itemImage} resizeMode="contain" />
        <View style={[styles.checkCircle, isSelected && styles.activeCheckCircle]}>
          <Ionicons name="checkmark" size={14} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 15,
  },
  imageWrapper: {
    width: 100,
    height: 120,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    position: "relative",
  },
  activeImageWrapper: {
    borderColor: "#A0AEC0",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  checkCircle: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#CBD5E0",
    justifyContent: "center",
    alignItems: "center",
  },
  activeCheckCircle: {
    backgroundColor: "#008BFF",
  },
});
