import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Colors from "../../constants/theme/colors";
import { getItemImage } from "../../utils/getItemImage";

export default function OutfitItemCard({ item }) {
  const imageUri = getItemImage(item);
  const itemName = item?.name || item?.title || item?.label || "";

  return (
    <View style={styles.card}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <Text style={styles.name} numberOfLines={2}>{itemName || "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    height: 138,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    padding: 10,
  },
  image: {
    width: "80%",
    height: 80,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: "80%",
    height: 80,
    marginBottom: 8,
    backgroundColor: Colors.borderDefault,
    borderRadius: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textPrimary,
    textAlign: "center",
  },
});
