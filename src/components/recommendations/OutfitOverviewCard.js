import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../constants/theme/colors";
import { getItemsList } from "../../utils/getItemImage";

export default function OutfitOverviewCard({ outfit, onPress, width, height, borderRadius, borderColor, labelFontSize }) {
  const items = getItemsList(outfit);
  const validImages = items.filter(i => i._image);
  const label = items.map(i => i._name).filter(Boolean).join(", ");

  const renderImages = () => {
    if (validImages.length === 0) {
      return <View style={styles.imagePlaceholder} />;
    }
    return (
      <Image source={{ uri: validImages[0]._image }} style={styles.image} resizeMode="contain" />
    );
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={[styles.card, { width, height, borderRadius, borderColor: borderColor || Colors.borderStrong }]}>
        {renderImages()}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={[styles.overlay, { borderRadius }]}
        >
          <Text style={[styles.label, labelFontSize ? { fontSize: labelFontSize } : undefined]} numberOfLines={2}>
            {label || "No items available"}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.borderDefault,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  label: {
    color: Colors.white,
    fontWeight: "600",
  },
});
