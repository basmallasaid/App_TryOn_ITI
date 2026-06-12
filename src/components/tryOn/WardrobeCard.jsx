import React from "react";
import { TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientBorder from "../recycle/GradientBorder";

const CARD_W = 90;
const CARD_H = 110;

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
      {isSelected ? (
        <GradientBorder width={CARD_W} height={CARD_H} borderRadius={12} borderWidth={2}>
          <View style={styles.selectedContent}>
            <Image source={imageSource} style={styles.itemImage} resizeMode="contain" />
            <Ionicons name="checkmark-circle" size={20} color="#A5E142" style={styles.checkIcon} />
          </View>
        </GradientBorder>
      ) : (
        <View style={styles.imageWrapper}>
          <Image source={imageSource} style={styles.itemImage} resizeMode="contain" />
          <Ionicons name="checkmark-circle" size={20} color="#9BA5B7" style={styles.checkIcon} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 12,
  },
  imageWrapper: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  selectedContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 11,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  checkIcon: {
    position: "absolute",
    top: 4,
    right: 4,
  },
});
