import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getWardrobeItem,
  deleteWardrobeItem,
} from "../../api/wardrobe_services/wardrobeService";
import { useWardrobe } from "../../context/WardrobeContext";
import { useFavorites } from "../../context/FavoritesContext";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

import { useTranslation } from 'react-i18next';
import { ROUTES, SOURCE } from "../../navigation/routes";
import CustomBackButton from "../../components/common/CustomBackButton";
import SelectionChip from "../../components/wardrobe/SelectionChip";
import QuestionGroup from "../../components/wardrobe/QuestionGroup";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

const CATEGORIES = ["Bottom", "Top", "Dress", "Suit", "Bag", "Shoes", "Jacket", "Accessories"];
const SEASONS = ["Summer", "Winter", "Spring", "Fall"];
const STYLES = ["Casual", "Basic", "Formal","Mart-Casual"];

const ItemDetailsScreen = ({ route, navigation }) => {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { t } = useTranslation();
  const { itemId, analysisId } = route.params;
  const { removeItem, refetch } = useWardrobe();
  const { isFavorite: checkIsFavorite, addItem: addFavoriteItem, removeItem: removeFavoriteItem } = useFavorites();

  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const id = analysisId || itemId;
      const data = await getWardrobeItem(id);
      setItemData(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [itemId]);

  useEffect(() => {
    if (itemData) {
      setIsFavorite(checkIsFavorite(itemId));
    }
  }, [itemData, itemId, checkIsFavorite]);

  const handleToggleFavorite = useCallback(async () => {
    const wasFavorite = isFavorite;
    setIsFavorite(!wasFavorite);
    try {
      if (wasFavorite) {
        await removeFavoriteItem(itemId);
      } else {
        await addFavoriteItem(itemId, 'WARDROBE', itemData);
      }
    } catch (e) {
      setIsFavorite(wasFavorite);
    }
  }, [isFavorite, itemId, itemData, addFavoriteItem, removeFavoriteItem]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteWardrobeItem(itemId);
      removeItem(itemId);
      setShowDeleteModal(false);
      navigation.goBack();
    } catch (error) {
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const garment = itemData?.garments?.[0] || {};
  const primaryColorName = garment.colors?.[0]?.color || "white";
  const normalize = (v) =>
    v
      ? v
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join("-")
      : "";
  const category = garment.category ? normalize(garment.category) : "";
  const seasons = (garment.season || []).map(normalize);
  const style = garment.style ? normalize(garment.style) : "";

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundColor} />

      <View style={styles.header}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{t("wardrobe.details.title")}</Text>
          <Text style={styles.subtitle}>{garment.specificType || t("wardrobe.details.garment")}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageCard}>
          <Image
            source={{ uri: itemData?.image }}
            style={styles.mainImage}
            resizeMode="contain"
          />
          <View style={styles.imageActions}>
            <TouchableOpacity onPress={handleToggleFavorite}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={18}
                  color={isFavorite ? Colors.error : Colors.white}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() =>
              navigation.navigate(ROUTES.TRY_ON, {
                screen: ROUTES.SELECT_MODEL,
                params: {
                  source: SOURCE.WARDROBE,
                  itemId,
                  itemType: garment.category || garment.specificType,
                  productImage: itemData?.image,
                  productName: garment.specificType || garment.category || "Garment",
                },
              })
            }>
              <View style={styles.iconCircle}>
                <Ionicons name="sparkles" size={18} color={Colors.white} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
              <View style={styles.iconCircle}>
                <Ionicons name="trash-outline" size={18} color={Colors.white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.colorLabel}>
            {t("wardrobe.details.color")} <Text style={styles.colorValue}>{primaryColorName}</Text>
          </Text>
          <View style={[styles.colorRing, { borderColor: Colors.primary }]}>
            <View
              style={[
                styles.colorInside,
                { backgroundColor: primaryColorName.toLowerCase().trim() },
              ]}
            />
          </View>
        </View>

        <Text style={styles.detailsLabel}>Item Details</Text>

        <View style={styles.dataCard}>
          <QuestionGroup title={t("wardrobe.details.category")}>
            {CATEGORIES.map((cat) => {
              const catLabel = {
                Bottom: t("wardrobe.categories.bottom"),
                Top: t("wardrobe.categories.top"),
                Dress: t("wardrobe.categories.dress"),
                Suit: t("wardrobe.categories.suit"),
                Bag: t("wardrobe.categories.bag"),
                Shoes: t("wardrobe.categories.shoes"),
                Jacket: t("wardrobe.categories.jacket"),
                Accessories: t("wardrobe.categories.accessories"),
              }[cat];
              return (
                <SelectionChip
                  key={cat}
                  label={catLabel || cat}
                  isSelected={category === cat}
                />
              );
            })}
          </QuestionGroup>

          <QuestionGroup title={t("wardrobe.details.season")}>
            {SEASONS.map((s) => {
              const seasonLabel = {
                Summer: t("wardrobe.seasons.summer"),
                Winter: t("wardrobe.seasons.winter"),
                Spring: t("wardrobe.seasons.spring"),
                Fall: t("wardrobe.seasons.fall"),
              }[s];
              return (
                <SelectionChip
                  key={s}
                  label={seasonLabel || s}
                  isSelected={seasons.includes(s)}
                />
              );
            })}
          </QuestionGroup>

          <QuestionGroup title={t("wardrobe.details.style")}>
            {STYLES.map((st) => {
              const styleLabel = {
                Casual: t("wardrobe.styles.casual"),
                Basic: t("wardrobe.styles.basic"),
                Formal: t("wardrobe.styles.formal"),
                "Mart-Casual": t("wardrobe.styles.martCasual"),
              }[st];
              return (
                <SelectionChip
                  key={st}
                  label={styleLabel || st}
                  isSelected={style?.toLowerCase() === st.toLowerCase()}
                />
              );
            })}
          </QuestionGroup>
        </View>
      </ScrollView>

      <DeleteConfirmationModal
        visible={showDeleteModal}
        loading={deleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </SafeAreaView>
  );
};

export default ItemDetailsScreen;

const createStyles = () => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerText: {
    alignItems: "center",
    marginTop: 12,
    gap: 4,
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 24,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    color: Colors.iconGray,
    textAlign: "center",
    textTransform: "capitalize",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageCard: {
    width: "100%",
    height: 284,
    borderRadius: 16,
    backgroundColor: Colors.backgroundColor,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  imageActions: {
    position: "absolute",
    top: 12,
    right: 12,
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  colorSection: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 4,
  },
  colorLabel: {
    fontFamily: "Roboto_700Bold",
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom:16,
  },
  colorValue: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Colors.iconGray,
    textTransform: "capitalize",
  },
  colorRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  colorInside: {
    width: 28,
    height: 28,
    borderRadius: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailsLabel: {
    fontFamily: "Roboto_700Bold",
    fontSize: 20,
    color: Colors.textPrimary,
    marginTop: 32,
    marginBottom: 16,
  },
  dataCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
});
