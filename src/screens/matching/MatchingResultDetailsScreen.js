import React, { useState, useMemo, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import CustomBackButton from "../../components/common/CustomBackButton";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavoritesContext";
import { translateToArabic } from "../../utils/dynamicTranslator";
import i18n from "../../localization/i18n";

const { width } = Dimensions.get("window");

const sizes = ["s", "m", "l", "xl", "xxl"];

const colorMap = {
  black: "#1A1A1A",
  white: "#FFFFFF",
  red: "#F44336",
  blue: "#2196F3",
  green: "#4CAF50",
  yellow: "#FFD700",
  brown: "#8B4513",
  grey: "#9E9E9E",
  gray: "#9E9E9E",
  navy: "#000080",
  maroon: "#800000",
  pink: "#E91E63",
  purple: "#9C27B0",
  orange: "#FF9800",
  beige: "#F5F5DC",
  cream: "#FFFDD0",
  gold: "#FFD700",
  silver: "#C0C0C0",
};

export default function MatchingResultDetailsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { match, imageUri } = route.params || {};
  const item = match?.item || {};
  const score = match?.score || 0;
  const explanation = match?.explanation || "";
  const { themeVersion } = useTheme();
  const { isFavorite, addItem, removeItem } = useFavorites();
  const itemId = item?.id?.replace("store_", "");

  const [selectedSize, setSelectedSize] = useState("m");
  const [selectedColor, setSelectedColor] = useState(item?.color || "black");
  const [translatedItem, setTranslatedItem] = useState(null);
  const [translatedExplanation, setTranslatedExplanation] = useState(explanation);

  useEffect(() => {
    const translateData = async () => {
      if (i18n.language !== 'ar') return;
      try {
        const [nameAr, descAr, explAr] = await Promise.all([
          translateToArabic(item.name),
          translateToArabic(item.description),
          translateToArabic(explanation),
        ]);
        setTranslatedItem({
          ...item,
          name: nameAr || item.name,
          description: descAr || item.description,
        });
        setTranslatedExplanation(explAr || explanation);
      } catch (err) {}
    };
    translateData();
  }, [match]);

  const displayItem = translatedItem || item;
  const displayExplanation = translatedExplanation || explanation;

  const colors = useMemo(() => {
    if (item?.colors?.length > 0) {
      return item.colors.map((c) => ({
        id: c.color,
        hex: colorMap[c.color?.toLowerCase()] || "#CCC",
      }));
    }
    const detected = item?.color;
    if (detected) {
      return [{ id: detected, hex: colorMap[detected?.toLowerCase()] || "#CCC" }];
    }
    return [];
  }, [item]);

  const uniqueSizes = useMemo(() => {
    const itemSizes = item?.sizes;
    if (Array.isArray(itemSizes) && itemSizes.length > 0) return itemSizes;
    return sizes;
  }, [item]);

  const isStore = item?.source === "store";
  const styles = useMemo(() => createStyles(), [themeVersion]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <CustomBackButton onPress={() => navigation.goBack()} iconColor={Colors.iconGray} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.imageCard}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.mainImage} resizeMode="contain" />
          ) : (
            <MaterialCommunityIcons name="tshirt-crew-outline" size={80} color={Colors.disabled} />
          )}
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.ratingBox}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{`${score}% ${t("matching.details.scoreMatch")}`}</Text>
            </View>
            {isStore && (
              <Text style={styles.ratingText}>
                {item?.rating || "4.7"}
              </Text>
            )}
            {isStore && <AntDesign name="star" size={16} color={Colors.accentOrange} style={{ marginLeft: 5 }} />}
          </View>
          <TouchableOpacity onPress={async () => {
            if (!itemId) return;
            try {
              if (isFavorite(itemId)) {
                await removeItem(itemId);
              } else {
                await addItem(itemId, "PRODUCT");
              }
            } catch (e) {
            }
          }}>
            <Ionicons
              name={isFavorite(itemId) ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite(itemId) ? Colors.accentOrange : Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titlePriceRow}>
            <Text style={styles.productTitle}>{displayItem?.name || t("matching.details.noDescription")}</Text>
            {isStore && item?.price && (
              <Text style={styles.productPrice}>{item?.currency || "$"}{" "}{item?.price}</Text>
            )}
          </View>
          <Text style={styles.description}>
            {displayExplanation || displayItem?.description || t("matching.details.noDescription")}
          </Text>
        </View>

        {colors.length > 0 && (
          <View style={styles.selectionSection}>
            <Text style={styles.selectionTitle}>
              {t("matching.details.color")} <Text style={styles.selectionSub}>-{selectedColor}</Text>
            </Text>
            <View style={styles.colorRow}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  onPress={() => setSelectedColor(color.id)}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color.hex },
                    selectedColor === color.id && styles.selectedColorCircle,
                    color.hex === "#FFFFFF" && styles.whiteColorCircle,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.selectionSection}>
          <Text style={styles.selectionTitle}>
            {t("matching.details.size")} <Text style={styles.selectionSub}>-{selectedSize}</Text>
          </Text>
          <View style={styles.sizeRow}>
            {uniqueSizes.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                style={[styles.sizeBox, selectedSize === size && styles.selectedSizeBox]}
              >
                <Text style={[styles.sizeText, selectedSize === size && styles.selectedSizeText]}>
                  {typeof size === "number" ? size : size.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.matchSection}>
          <Text style={styles.matchTitle}>{t("matching.details.matchesWardrobe")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.matchList}>
            <View style={styles.matchCard}>
              <View style={styles.percentBadge}>
                <Text style={styles.percentText}>{score}%</Text>
              </View>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.matchImage} resizeMode="contain" />
              ) : (
                <MaterialCommunityIcons name="tshirt-crew-outline" size={30} color={Colors.disabled} />
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.bottomFixedContainer}>
        <TouchableOpacity style={styles.generateButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="auto-fix" size={20} color={Colors.white} />
          <Text style={styles.generateButtonText}>{t("matching.details.tryOnThisItem")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: Colors.backgroundColor,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  searchInput: { flex: 1, fontSize: 14 },

  imageCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 15,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  mainImage: { width: "80%", height: "80%" },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginTop: 15,
    alignItems: "center",
  },
  ratingBox: { flexDirection: "row", alignItems: "center", gap: 8 },
  ratingText: { color: Colors.textPrimary, fontWeight: "600" },
  scoreBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scoreText: { color: Colors.textInverse, fontSize: 12, fontWeight: "bold" },

  infoSection: { paddingHorizontal: 25, marginTop: 15 },
  titlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    flex: 1,
    textTransform: "capitalize",
  },
  productPrice: { fontSize: 18, fontWeight: "bold", color: Colors.textPrimary, marginLeft: 12 },
  description: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },

  selectionSection: { paddingHorizontal: 25, marginTop: 20 },
  selectionTitle: { fontSize: 16, fontWeight: "bold", color: Colors.textPrimary },
  selectionSub: { color: Colors.textMuted, fontWeight: "normal", fontSize: 12 },
  colorRow: { flexDirection: "row", marginTop: 12 },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  whiteColorCircle: { borderWidth: 1.5, borderColor: Colors.borderDefault },
  selectedColorCircle: {
    borderWidth: 2,
    borderColor: Colors.primary,
    transform: [{ scale: 1.1 }],
  },

  sizeRow: { flexDirection: "row", marginTop: 12, flexWrap: "wrap", gap: 10 },
  sizeBox: {
    width: 45,
    height: 35,
    backgroundColor: Colors.borderDefault,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSizeBox: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  sizeText: { color: Colors.textMuted, textTransform: "uppercase", fontWeight: "600" },
  selectedSizeText: { color: Colors.textPrimary },

  matchSection: { marginTop: 30, paddingLeft: 25 },
  matchTitle: { fontSize: 16, fontWeight: "bold", color: Colors.textPrimary },
  matchList: { marginTop: 15 },
  matchCard: {
    width: 100,
    height: 120,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  matchImage: { width: 70, height: 80 },
  percentBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex:2,
  },
  percentText: { color: Colors.textInverse, fontSize: 9, fontWeight: "bold" },

  bottomFixedContainer: {
    position: "absolute",
    bottom: 25,
    width: "100%",
    paddingHorizontal: 20,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    gap: 8,
  },
  generateButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: "bold",
  },
});
