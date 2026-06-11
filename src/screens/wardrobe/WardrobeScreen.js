import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useProfileContext } from '../../context/ProfileContext';
import { analyzeGarment } from '../../api/wardrobe_services/wardrobeService';
import { getCategoriesByGender } from '../../constants/wardrobe/wardrobeCategories';
import WardrobeHealthCard from '../../components/wardrobe/WardrobeHealthCard';
import CategoryChip from '../../components/wardrobe/CategoryChip';
import AddItemCard from '../../components/wardrobe/AddItemCard';
import WardrobeItemCard from '../../components/wardrobe/WardrobeItemCard';
import WardrobeEmptyState from '../../components/wardrobe/WardrobeEmptyState';
import SelectionModal from '../../components/wardrobe/SelectionModal';
import Colors from '../../constants/theme/colors';
import { useWardrobe } from '../../context/WardrobeContext';
import { useFavorites } from '../../context/FavoritesContext';
import * as ImageManipulator from 'expo-image-manipulator';
import { openCamera, openGallery } from '../../utils/cameraAccess';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 150; // Based on your WardrobeItemCard width
const GAP = 15;
const TOTAL_GRID_WIDTH = CARD_WIDTH * 2 + GAP;
const HORIZONTAL_PADDING = (SCREEN_WIDTH - TOTAL_GRID_WIDTH) / 2;
const WardrobeScreen = ({ navigation }) => {
  const { items, loading, error, refetch } = useWardrobe();
  const { profile } = useProfileContext();
  const {
    isFavorite,
    addItem,
    removeItem,
    refetch: refetchFavorites,
  } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [analyzing, setAnalyzing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const gender = profile?.profile?.gender ?? null;
  const categories = getCategoriesByGender(gender);

  const filteredItems = useMemo(() => {
    return selectedCategory === 'All'
      ? items
      : items.filter(
          item =>
            item.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );
  }, [items, selectedCategory]);

  const listData = useMemo(
    () => [{ _id: 'add-item', type: 'add' }, ...filteredItems],
    [filteredItems],
  );

  const handleAddItem = () => {
    if (Platform.OS === 'ios') {
      Alert.alert('Add Item', 'Choose a source', [
        { text: 'Camera', onPress: () => pickImage('camera') },
        { text: 'Gallery', onPress: () => pickImage('gallery') },
        { text: 'Cancel', style: 'cancel' },
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
      Alert.alert('Error', 'An error occurred while selecting the image.');
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
      navigation.navigate('VerifyItem', {
        imageUri: compressed.uri,
        analysisResult,
      });
    } catch (e) {
      Alert.alert(
        'Analysis Failed',
        e.response?.data?.error || 'Could not analyze this image.',
      );
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
              label={item}
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
            />
          )}
          style={{ alignSelf: 'center' }}
        />
      </View>
      {analyzing && (
        <View style={styles.analyzingWrap}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.analyzingText}>Analyzing your item...</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.root}>
      {/* SelectionModal must be available for Android users on this screen */}
      {Platform.OS === 'android' && (
        <SelectionModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onCamera={() => pickImage('camera')}
          onGallery={() => pickImage('gallery')}
          title="Add Item"
          subtitle="Choose a source"
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
              <AddItemCard onPress={handleAddItem} />
            ) : (
              <WardrobeItemCard
                item={item}
                onPress={() =>
                  navigation.navigate('ItemDetails', {
                    itemId: item._id,
                    analysisId: item.analysis_id,
                  })
                }
                onLongPress={() =>
                  navigation.navigate('EditWardrobe', {
                    initialSelectedId: item._id,
                  })
                }
                onToggleFavorite={async () => {
                  try {
                    if (isFavorite(item._id)) {
                      await removeItem(item._id);
                    } else {
                      await addItem(item._id, 'WARDROBE');
                    }
                  } catch (e) {
                    Alert.alert(
                      'Error',
                      e.response?.data?.message || 'Failed to update favorite',
                    );
                    refetchFavorites();
                  }
                }}
              />
            )
          }
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F6F7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
    //alignSelf:"center"
  },
  headerContainer: {
    backgroundColor: '#F5F6F7',
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
    paddingHorizontal: Math.max(16, HORIZONTAL_PADDING),
    gap: 15,
  },
  analyzingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    backgroundColor: '#E5F2FF',
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

export default WardrobeScreen;
