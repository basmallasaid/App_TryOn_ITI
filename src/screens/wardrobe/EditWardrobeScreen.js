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
import CustomBackButton from "../../components/common/CustomBackButton";
import CategoryChip from "../../components/wardrobe/CategoryChip";
import WardrobeItemCard from "../../components/wardrobe/WardrobeItemCard";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { getCategoriesByGender } from "../../constants/wardrobe/wardrobeCategories";
import { ROUTES } from "../../navigation/routes";
import { useProfileContext } from "../../context/ProfileContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = 175;
const GAP = 15;
const TOTAL_GRID_WIDTH = CARD_WIDTH * 2 + GAP;
const HORIZONTAL_PADDING = (SCREEN_WIDTH - TOTAL_GRID_WIDTH) / 2;

const EditWardrobeScreen = ({ navigation, route }) => {
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

  const filteredItems = useMemo(
    () =>
      selectedCategory === "All"
        ? items
        : items.filter((i) => i.category === selectedCategory),
    [items, selectedCategory],
  );

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
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Edit your wardrobe</Text>
        <TouchableOpacity
          onPress={() => selectedIds.length > 0 && setModalVisible(true)}
        >
          <Ionicons
            name="trash-outline"
            size={24}
            color={selectedIds.length > 0 ? Colors.error : "#D5D9DE"}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F6F7",
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
    color: "#121826",
  },
  categoryBar: { paddingVertical: 25 },
  categoryScroll: { paddingHorizontal: 16, gap: 8 },
  row: { paddingHorizontal: Math.max(16, HORIZONTAL_PADDING), gap: GAP },
  listContent: { paddingBottom: 30 },
  cardContainer: { position: "relative" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ADADAD",
    opacity: 0.3,
    borderRadius: 16,
    marginTop: 20, // To match WardrobeItemCard margin
  },
  selectedOverlay: {
    opacity: 0.6,
    backgroundColor: "#ADADAD",
  },
  checkCircle: {
    position: "absolute",
    width: 15,
    height: 15,
    top: 5,
    right: 5, // Adjusted to fit card
    backgroundColor: "#8ED321",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

export default EditWardrobeScreen;
