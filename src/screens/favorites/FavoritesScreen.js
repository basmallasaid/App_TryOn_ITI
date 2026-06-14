import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useFavorites } from "../../context/FavoritesContext";
import CustomBackButton from "../../components/common/CustomBackButton";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const CATEGORIES = ["All", "Wardrobe", "Store", "Try On", "Recycle"];

const FavoritesScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const { items, loading, error, refetch, removeItem } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState("All");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const handleRemove = async (favoriteItem) => {
    try {
      await removeItem(favoriteItem.itemId);
    } catch {
      refetch();
    }
  };

  const styles = useMemo(() => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 12,
    backgroundColor: Colors.backgroundColor,
  },
  headerTitle: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 24,
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 56,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  heartIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  emptyTitle: {
    fontFamily: "Roboto_700Bold",
    fontSize: 24,
    lineHeight: 32,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: Colors.disabled,
    textAlign: "center",
  },
  filterBar: {
    paddingBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    height: 35,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    justifyContent: "center",
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterLabel: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
  },
  filterLabelActive: {
    color: Colors.textInverse,
    fontFamily: "Roboto_600SemiBold",
  },
  errorText: {
    color: Colors.error,
    textAlign: "center",
    padding: 12,
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
  },
  gridContent: {
    paddingBottom: 30,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  gridRow: {
    gap: CARD_GAP,
    marginTop: CARD_GAP,
  },
  emptyCategoryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 120,
  },
  emptyCategoryTitle: {
    fontFamily: "Roboto_700Bold",
    fontSize: 18,
    lineHeight: 24,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 16,
    backgroundColor: Colors.white,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  cardImageWrap: {
    flex: 1,
    position: "relative",
  },
  cardImage: {
    flex: 1,
    backgroundColor: Colors.borderDefault,
  },
  cardPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  heartCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
}), [themeVersion]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <CustomBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <CustomBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.heartIconWrap}>
            <Ionicons name="heart" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>{t('favorites.emptyTitle')}</Text>
          <Text style={styles.emptySubtitle}>{t('favorites.emptySubtitle')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.filterBar}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    isActive && styles.filterLabelActive,
                  ]}
                >
                  {t(`favorites.categories.${item.toLowerCase()}`, {
                    defaultValue: item,
                  })}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {filteredItems.length === 0 ? (
        <View style={styles.emptyCategoryContainer}>
          <View style={styles.heartIconWrap}>
            <Ionicons name="heart-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.emptyCategoryTitle}>
            {t('favorites.noItemsInCategory')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => {
            const imageSource = item.image ? { uri: item.image } : null;
            return (
              <View style={styles.card}>
                <View style={styles.cardImageWrap}>
                  {imageSource ? (
                    <Image
                      source={imageSource}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.cardPlaceholder}>
                      <Ionicons name="image-outline" size={28} color={Colors.borderDefault} />
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.heartBtn}
                    onPress={() => handleRemove(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.heartCircle}>
                      <Ionicons name="heart" size={14} color={Colors.error} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;
