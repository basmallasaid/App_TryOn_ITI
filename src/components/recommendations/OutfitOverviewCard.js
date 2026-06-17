import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { useWardrobe } from "../../context/WardrobeContext";
import { getItemsList, getCompositeImage } from "../../utils/getItemImage";

const BLURHASH_PLACEHOLDER = 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.';

export default function OutfitOverviewCard({ outfit, onPress, width, height, borderRadius, borderColor, labelFontSize }) {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const { items: wardrobeItems } = useWardrobe();
  const [imageError, setImageError] = useState(false);
  const items = getItemsList(outfit, wardrobeItems);
  const compositeImage = getCompositeImage(outfit);
  const validImages = items.filter(i => i._image);
  const isComposite = !!compositeImage;
  const fallbackImage = validImages[0]?._image || null;
  const imageUri = (!imageError && compositeImage) ? compositeImage : fallbackImage;
  const label = items.map(i => i._name).filter(Boolean).join(", ");

  const renderImages = () => {
    if (!imageUri) {
      return <View style={styles.imagePlaceholder} />;
    }
    return (
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        contentFit="contain"
        placeholder={BLURHASH_PLACEHOLDER}
        transition={300}
        onError={(e) => {
          if (isComposite) {
            setImageError(true);
          }
        }}
      />
    );
  };

const styles = React.useMemo(() => StyleSheet.create({
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
    fontFamily: 'Roboto_600SemiBold',
    color: Colors.textInverse,
  },
}), [themeVersion]);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={[styles.card, { width, height, borderRadius, borderColor: borderColor || Colors.borderStrong }]}>
        {renderImages()}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={[styles.overlay, { borderRadius }]}
        >
          <Text style={[styles.label, labelFontSize ? { fontSize: labelFontSize } : undefined]} numberOfLines={2}>
            {label || t('recommendation.noItemsAvailable')}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

