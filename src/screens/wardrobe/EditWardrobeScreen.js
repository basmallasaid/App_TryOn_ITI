import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWardrobe } from "../../context/WardrobeContext";
import { deleteWardrobeItem } from "../../api/wardrobe_services/wardrobeService";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import CustomBackButton from "../../components/common/CustomBackButton";
import CategoryChip from "../../components/wardrobe/CategoryChip";
import WardrobeItemCard from "../../components/wardrobe/WardrobeItemCard";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { getCategoriesByGender, CATEGORY_TO_BACKEND } from "../../constants/wardrobe/wardrobeCategories";
import { useTranslation } from 'react-i18next';
import { ROUTES } from "../../navigation/routes";
import { useProfileContext } from "../../context/ProfileContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = 175;
const GAP = 15;
const TOTAL_GRID_WIDTH = CARD_WIDTH * 2 + GAP;
const HORIZONTAL_PADDING = (SCREEN_WIDTH - TOTAL_GRID_WIDTH) / 2;

const EditWardrobeScreen = ({ navigation, route }) => {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { t } = useTranslation();
  const { initialSelectedId } = route.params || {};
  const { items, removeItem, refetch } = useWardrobe();
  const { profile } = useProfileContext();

  const [selectedIds, setSelectedIds] = useState(
    initialSelectedId ? [initialSelectedId] : [],
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = getCategoriesByGender(profile?.profile?.gender);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    const backendCategory = CATEGORY_TO_BACKEND[selectedCategory];
    if (!backendCategory) return items;
    return items.filter(
      (i) => i.category?.toLowerCase() === backendCategory,
    );
  }, [items, selectedCategory]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Execute all deletes
      await Promise.all(selectedIds.map((id) => deleteWardrobeItem(id)));
      // Update local context
      selectedIds.forEach((id) => removeItem(id));
      setModalVisible(false);
      navigation.navigate(ROUTES.WARDROBE_MAIN);
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{t("wardrobe.editTitle")}</Text>
        <TouchableOpacity
          onPress={() => selectedIds.length > 0 && setModalVisible(true)}
        >
          <Ionicons
            name="trash-outline"
            size={24}
            color={selectedIds.length > 0 ? Colors.error : Colors.borderDefault}
          />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoryBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => (
            <CategoryChip
              label={item}
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
            />
          )}
          contentContainerStyle={styles.categoryScroll}
        />
      </View>

      {/* Grid */}
      <FlatList
        data={filteredItems}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item._id);
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => toggleSelect(item._id)}
              style={styles.cardContainer}
            >
              <WardrobeItemCard item={item} />
              {/* Delete Overlay */}
              <View
                style={[styles.overlay, isSelected && styles.selectedOverlay]}
              >
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={10} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />

      <DeleteConfirmationModal
        visible={modalVisible}
        loading={isDeleting}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDelete}
      />
    </SafeAreaView>
  );
};

export default EditWardrobeScreen;

const createStyles = () => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: 18,
    color: Colors.textPrimary,
  },
  categoryBar: { paddingVertical: 25 },
  categoryScroll: { paddingHorizontal: 16, gap: 8 },
  row: { paddingHorizontal: Math.max(16, HORIZONTAL_PADDING), gap: GAP },
  listContent: { paddingBottom: 30 },
  cardContainer: { position: "relative" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.disabled,
    opacity: 0.3,
    borderRadius: 16,
    marginTop: 20,
  },
  selectedOverlay: {
    opacity: 0.6,
    backgroundColor: Colors.disabled,
  },
  checkCircle: {
    position: "absolute",
    width: 15,
    height: 15,
    top: 5,
    right: 5, // Adjusted to fit card
    backgroundColor: Colors.secondary,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
