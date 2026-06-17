import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { getItemImage } from "../../utils/getItemImage";

const BLURHASH_PLACEHOLDER = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';

export default function OutfitItemCard({ item }) {
  const imageUri = getItemImage(item);
  const itemName = item?.name || item?.title || item?.label || "";
  const { themeVersion } = useTheme();

const styles = React.useMemo(() => StyleSheet.create({
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
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    color: Colors.textPrimary,
    textAlign: "center",
  },
}), [themeVersion]);

  return (
    <View style={styles.card}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="contain"
          placeholder={BLURHASH_PLACEHOLDER}
          transition={300}
        />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <Text style={styles.name} numberOfLines={2}>{itemName || "—"}</Text>
    </View>
  );
}

