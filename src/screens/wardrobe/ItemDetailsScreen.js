import React, { useEffect, useState } from "react";
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
  editWardrobeItem,
} from "../../api/wardrobe_services/wardrobeService";
import { useWardrobe } from "../../context/WardrobeContext";
import Colors from "../../constants/theme/colors";

import { ROUTES, SOURCE } from "../../navigation/routes";
import CustomBackButton from "../../components/common/CustomBackButton";
import CustomizeAppButtonFilled from "../../components/common/CustomizeAppButtonFilled";
import SelectionChip from "../../components/wardrobe/SelectionChip";
import QuestionGroup from "../../components/wardrobe/QuestionGroup";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

const CATEGORIES = ["Basic", "Bottom", "Top", "Dress", "Suit", "Bag", "Shoes", "Jacket", "Accessories"];
const SEASONS = ["Summer", "Winter", "Spring", "Fall"];
const STYLES = ["Casual", "Basic", "Formal","Mart-Casual"];

const ItemDetailsScreen = ({ route, navigation }) => {
  const { itemId, analysisId } = route.params;
  const { removeItem, refetch, updateItem } = useWardrobe();

  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, [itemId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const id = analysisId || itemId;
      const data = await getWardrobeItem(id);
      setItemData(data);
      const garment = data?.garments?.[0] || {};
      setSelectedCategory(garment.category || null);
      setSelectedSeasons(garment.season || []);
      setSelectedStyle(garment.style || null);
    } catch (error) {
      console.error("Fetch Details Error:", error.response?.status, error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (value) => {
    setSelectedCategory((prev) => (prev === value ? null : value));
  };

  const toggleSeason = (value) => {
    setSelectedSeasons((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const toggleStyle = (value) => {
    setSelectedStyle((prev) => (prev === value ? null : value));
  };

  const handleSave = async () => {
    if (!itemData) return;
    const garment = itemData?.garments?.[0] || {};
    const id = analysisId || itemId;
    try {
      setSaving(true);
      const category = selectedCategory || garment.category || "";
      const style = selectedStyle || garment.style || "";
      const season = selectedSeasons.length ? selectedSeasons : garment.season || [];
      await editWardrobeItem(id, garment, {
        name: garment.specificType || "",
        category,
        style,
        season,
      });
      updateItem(itemId, { category: category.toLowerCase() });
      navigation.goBack();
    } catch (error) {
      console.error("Save Error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteWardrobeItem(itemId);
      removeItem(itemId);
      setShowDeleteModal(false);
      navigation.goBack();
    } catch (error) {
      console.error("Delete Error:", error);
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

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundColor} />

      <View style={styles.header}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Item Details</Text>
          <Text style={styles.subtitle}>{garment.specificType || "Garment"}</Text>
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
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
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
            Color <Text style={styles.colorValue}>{primaryColorName}</Text>
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
          <QuestionGroup title="Category">
            {CATEGORIES.map((cat) => (
              <SelectionChip
                key={cat}
                label={cat}
                isSelected={normalize(selectedCategory) === cat}
                onPress={() => toggleCategory(cat)}
              />
            ))}
          </QuestionGroup>

          <QuestionGroup title="Season">
            {SEASONS.map((s) => (
              <SelectionChip
                key={s}
                label={s}
                isSelected={selectedSeasons.some((item) => normalize(item) === s)}
                onPress={() => toggleSeason(s)}
              />
            ))}
          </QuestionGroup>

          <QuestionGroup title="Style">
            {STYLES.map((st) => (
              <SelectionChip
                key={st}
                label={st}
                isSelected={selectedStyle?.toLowerCase() === st.toLowerCase()}
                onPress={() => toggleStyle(st)}
              />
            ))}
          </QuestionGroup>
        </View>

        <View style={styles.saveWrap}>
          <CustomizeAppButtonFilled
            label="Save Changes"
            onPress={handleSave}
            loading={saving}
          />
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

const styles = StyleSheet.create({
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
  saveWrap: {
    marginTop: 24,
  },
});

export default ItemDetailsScreen;
