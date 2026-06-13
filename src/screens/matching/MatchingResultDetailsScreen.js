import React, { useState, useMemo } from "react";
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
import { useFavorites } from "../../context/FavoritesContext";

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
  const { match, imageUri } = route.params || {};
  const item = match?.item || {};
  const score = match?.score || 0;
  const explanation = match?.explanation || "";
  const { t } = useTranslation();
  const { isFavorite, addItem, removeItem } = useFavorites();
  const itemId = item?.id?.replace("store_", "");

  const [selectedSize, setSelectedSize] = useState("m");
  const [selectedColor, setSelectedColor] = useState(item?.color || "black");

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
            <MaterialCommunityIcons name="tshirt-crew-outline" size={80} color="#CBD5E0" />
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
            {isStore && <AntDesign name="star" size={16} color="#FF9500" style={{ marginLeft: 5 }} />}
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
              console.error(e);
            }
          }}>
            <Ionicons
              name={isFavorite(itemId) ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite(itemId) ? "#FF8A3D" : "#3E4850"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titlePriceRow}>
            <Text style={styles.productTitle}>{item?.name || t("matching.details.noDescription")}</Text>
            {isStore && item?.price && (
              <Text style={styles.productPrice}>{item?.currency || "$"}{" "}{item?.price}</Text>
            )}
          </View>
          <Text style={styles.description}>
            {explanation || item?.description || t("matching.details.noDescription")}
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
                <MaterialCommunityIcons name="tshirt-crew-outline" size={30} color="#CBD5E0" />
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.bottomFixedContainer}>
        <TouchableOpacity style={styles.generateButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="auto-fix" size={20} color="#FFF" />
          <Text style={styles.generateButtonText}>{t("matching.details.tryOnThisItem")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: "#F8F9FB",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  searchInput: { flex: 1, fontSize: 14 },

  imageCard: {
    backgroundColor: "#FFF",
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
  ratingText: { color: "#1A2530", fontWeight: "600" },
  scoreBadge: {
    backgroundColor: "#A5E142",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scoreText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },

  infoSection: { paddingHorizontal: 25, marginTop: 15 },
  titlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A2530",
    flex: 1,
    textTransform: "capitalize",
  },
  productPrice: { fontSize: 18, fontWeight: "bold", color: "#1A2530", marginLeft: 12 },
  description: {
    color: "#7D848D",
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },

  selectionSection: { paddingHorizontal: 25, marginTop: 20 },
  selectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1A2530" },
  selectionSub: { color: "#B0B5C1", fontWeight: "normal", fontSize: 12 },
  colorRow: { flexDirection: "row", marginTop: 12 },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  whiteColorCircle: { borderWidth: 1.5, borderColor: "#D0D0D0" },
  selectedColorCircle: {
    borderWidth: 2,
    borderColor: "#44BEFF",
    transform: [{ scale: 1.1 }],
  },

  sizeRow: { flexDirection: "row", marginTop: 12, flexWrap: "wrap", gap: 10 },
  sizeBox: {
    width: 45,
    height: 35,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSizeBox: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#44BEFF",
  },
  sizeText: { color: "#7D848D", textTransform: "uppercase", fontWeight: "600" },
  selectedSizeText: { color: "#1A2530" },

  matchSection: { marginTop: 30, paddingLeft: 25 },
  matchTitle: { fontSize: 16, fontWeight: "bold", color: "#1A2530" },
  matchList: { marginTop: 15 },
  matchCard: {
    width: 100,
    height: 120,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#E0F4BE",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  matchImage: { width: 70, height: 80 },
  percentBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#A5E142",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex:2,
  },
  percentText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },

  bottomFixedContainer: {
    position: "absolute",
    bottom: 25,
    width: "100%",
    paddingHorizontal: 20,
  },
  generateButton: {
    backgroundColor: "#44BEFF",
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    gap: 8,
  },
  generateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
