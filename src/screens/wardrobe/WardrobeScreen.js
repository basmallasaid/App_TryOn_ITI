import React, { useState, useCallback, useMemo, useEffect } from 'react';
import SafeScreen from "../../components/common/SafeScreen";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useProfileContext } from '../../context/ProfileContext';
import { analyzeGarment } from '../../api/wardrobe_services/wardrobeService';
import { getCategoriesByGender, CATEGORY_TO_BACKEND } from '../../constants/wardrobe/wardrobeCategories';
import WardrobeHealthCard from '../../components/wardrobe/WardrobeHealthCard';
import CategoryChip from '../../components/wardrobe/CategoryChip';
import AddItemCard from '../../components/wardrobe/AddItemCard';
import WardrobeItemCard from '../../components/wardrobe/WardrobeItemCard';
import WardrobeEmptyState from '../../components/wardrobe/WardrobeEmptyState';
import SelectionModal from '../../components/wardrobe/SelectionModal';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { useWardrobe } from '../../context/WardrobeContext';
import { useFavorites } from '../../context/FavoritesContext';
import * as ImageManipulator from 'expo-image-manipulator';
import { openCamera, openGallery } from '../../utils/cameraAccess';
import { useTranslation } from 'react-i18next';
import { useFeedback } from "../../context/FeedbackContext";
import { getUserFriendlyErrorMessage } from "../../utils/errorMessages";
import { ROUTES } from '../../navigation/routes';
import { translateWardrobeItem } from '../../utils/dynamicTranslator';
import i18n from '../../localization/i18n';
const PADDING = 16;
const GAP = 15;
const WardrobeScreen = ({ navigation }) => {
  const { themeVersion } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = useMemo(() => (screenWidth - PADDING * 2 - GAP) / 2, [screenWidth]);
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { t } = useTranslation();
  const { showFeedback } = useFeedback();
  const { items, loading, error, refetch } = useWardrobe();
  const { profile } = useProfileContext();
  const {
    isFavorite,
    toggleFavorite,
    refetch: refetchFavorites,
  } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [analyzing, setAnalyzing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [translatedItems, setTranslatedItems] = useState([]);

  useEffect(() => {
    const translateAll = async () => {
      if (i18n.language !== 'ar' || items.length === 0) {
        setTranslatedItems(items);
        return;
      }
      const results = await Promise.all(
        items.map(item => translateWardrobeItem(item, 'ar'))
      );
      setTranslatedItems(results);
    };
    translateAll();
  }, [items]);

  useFocusEffect(
    useCallback(() => {
      if (items.length > 0) return;
      refetch();
    }, [refetch, items.length]),
  );

  const gender = profile?.profile?.gender ?? null;
  const rawCategories = getCategoriesByGender(gender);

  const categoryLabelMap = {
    "All": t("wardrobe.all"),
    "Top": t("wardrobe.categories.top"),
    "Shirt": t("wardrobe.shirt"),
    "T-Shirt": t("wardrobe.tShirt"),
    "Bottom": t("wardrobe.categories.bottom"),
    "Jeans": t("wardrobe.jeans"),
    "Short": t("wardrobe.short"),
    "Jacket": t("wardrobe.categories.jacket"),
    "Suit": t("wardrobe.categories.suit"),
    "Shoes": t("wardrobe.categories.shoes"),
    "Accessories": t("wardrobe.categories.accessories"),
    "Dress": t("wardrobe.categories.dress"),
    "Skirt": t("wardrobe.skirt"),
    "Bag": t("wardrobe.categories.bag"),
    "Abayas": t("wardrobe.abayas"),
  };

  const categories = rawCategories;

  const filteredItems = useMemo(() => {
    const itemsToFilter = translatedItems.length > 0 ? translatedItems : items;
    if (selectedCategory === 'All') return itemsToFilter;
    const backendCategory = CATEGORY_TO_BACKEND[selectedCategory];
    if (!backendCategory) return itemsToFilter;
    return itemsToFilter.filter(
      item => item.category?.toLowerCase() === backendCategory,
    );
  }, [translatedItems, items, selectedCategory]);

  const listData = useMemo(
    () => [{ _id: 'add-item', type: 'add' }, ...filteredItems],
    [filteredItems],
  );

  const handleAddItem = () => {
    if (Platform.OS === 'ios') {
      Alert.alert(t("wardrobe.addItem"), t("wardrobe.chooseSource"), [
        { text: t("wardrobe.camera"), onPress: () => pickImage('camera') },
        { text: t("wardrobe.gallery"), onPress: () => pickImage('gallery') },
        { text: t("wardrobe.cancel"), style: 'cancel' },
      ]);
    } else {
      setIsModalVisible(true);
    }
  };

  const pickImage = async source => {
    if (Platform.OS === 'android') setIsModalVisible(false);
    try {
      const result =
        source === 'camera' ? await openCamera() : await openGallery();
      if (!result || result.canceled || !result.assets) return;
      await handleAnalyze(result.assets[0]);
    } catch (err) {
      showFeedback({ type: "error", title: t("wardrobe.error"), message: t("wardrobe.errorOccurred") });
    }
  };

  const handleAnalyze = async asset => {
    try {
      setAnalyzing(true);
      const compressed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
      );

      const formData = new FormData();
      const filename = compressed.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('image', {
        uri:
          Platform.OS === 'android'
            ? compressed.uri
            : compressed.uri.replace('file://', ''),
        name: filename,
        type: type,
      });

      const analysisResult = await analyzeGarment(formData);
      navigation.navigate(ROUTES.VERIFY_ITEM, {
        imageUri: compressed.uri,
        analysisResult,
      });
    } catch (e) {
      showFeedback({ type: "error", title: t("wardrobe.analysisFailed"), message: getUserFriendlyErrorMessage(e, t) });
    } finally {
      setAnalyzing(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.section}>
        <WardrobeHealthCard itemCount={items.length} />
      </View>
      <View style={styles.categoryBar}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          renderItem={({ item }) => (
            <CategoryChip
              label={categoryLabelMap[item] || item}
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
            />
          )}
          style={{ alignSelf: 'center' }}
        />
      </View>
      {analyzing && (
        <View style={[styles.analyzingWrap, { flexDirection: "row" }]}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.analyzingText}>{t("wardrobe.analyzing")}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeScreen style={{ flex: 1 }}>
    <View style={styles.root}>
      {/* SelectionModal must be available for Android users on this screen */}
      {Platform.OS === 'android' && (
        <SelectionModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onCamera={() => pickImage('camera')}
          onGallery={() => pickImage('gallery')}
          title={t("wardrobe.addItem")}
          subtitle={t("wardrobe.chooseSource")}
        />
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : items.length === 0 ? (
        /* Render separate component if wardrobe is empty */
        <WardrobeEmptyState onAdd={handleAddItem} />
      ) : (
        /* Render Grid if items exist */
        <FlatList
          data={listData}
          keyExtractor={item => item._id}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) =>
            item.type === 'add' ? (
              <AddItemCard cardWidth={cardWidth} onPress={handleAddItem} />
            ) : (
              <WardrobeItemCard
                cardWidth={cardWidth}
                item={item}
                isFavorite={isFavorite(item._id)}
                onPress={() =>
                  navigation.navigate(ROUTES.ITEM_DETAILS, {
                    itemId: item._id,
                    analysisId: item.analysis_id,
                  })
                }
                onLongPress={() =>
                  navigation.navigate(ROUTES.EDIT_WARDROBE, {
                    initialSelectedId: item._id,
                  })
                }
                onToggleFavorite={async () => {
                  try {
                    await toggleFavorite(item._id, 'WARDROBE', item);
                  } catch (e) {
                    showFeedback({ type: "error", title: t("wardrobe.error"), message: getUserFriendlyErrorMessage(e, t) });
                    refetchFavorites();
                  }
                }}
              />
            )
          }
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          initialNumToRender={6}
        />
      )}
    </View>
    </SafeScreen>
  );
};

export default WardrobeScreen;

const createStyles = () => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerContainer: {
    backgroundColor: Colors.backgroundColor,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
  },
  categoryBar: {
    paddingVertical: 10,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  row: {
    paddingHorizontal: PADDING,
    gap: GAP,
  },
  analyzingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundColor,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  analyzingText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: Colors.primary,
  },
});
