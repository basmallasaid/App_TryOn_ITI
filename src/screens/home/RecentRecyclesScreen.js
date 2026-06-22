import React, { useState, useEffect } from 'react';
import SafeScreen from "../../components/common/SafeScreen";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRecentRecycles } from '../../context/RecentRecyclesContext';
import { useFavorites } from '../../context/FavoritesContext';
import RecentItemCard from '../../components/home/RecentItemCard';
import OutfitViewModal from '../../components/common/OutfitViewModal';
import CustomBackButton from '../../components/common/CustomBackButton';
import { getItemImage } from '../../utils/getItemImage';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
import i18n from '../../localization/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 150;
const GAP = 15;
const TOTAL_GRID_WIDTH = CARD_WIDTH * 2 + GAP;
const HORIZONTAL_PADDING = Math.max(16, (SCREEN_WIDTH - TOTAL_GRID_WIDTH) / 2);

export default function RecentRecyclesScreen({ navigation }) {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { t } = useTranslation();
  const { recycles, loading } = useRecentRecycles();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [translatedRecycles, setTranslatedRecycles] = useState([]);

  useEffect(() => {
    const translateAll = async () => {
      if (recycles.length > 0) {
        const translated = recycles.map((item) => {
          if (i18n.language === 'ar') {
            const nameAr = item.designTitleAr || item.name;
            return {
              ...item,
              name: nameAr || item.name,
              designTitle: nameAr || item.designTitle,
            };
          }
          return {
            ...item,
            name: item.designTitle || item.name,
            designTitle: item.designTitle || item.name,
          };
        });
        setTranslatedRecycles(translated);
      } else {
        setTranslatedRecycles(recycles);
      }
    };
    translateAll();
  }, [recycles, i18n.language]);

  const handleToggleFavorite = async (item) => {
    try {
      await toggleFavorite(item._id, 'TRYON');
    } catch (e) {
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <RecentItemCard
        item={item}
        isFavorite={isFavorite(item._id)}
        onToggleFavorite={() => handleToggleFavorite(item)}
        onPress={() => setSelectedOutfit(item)}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeScreen style={styles.safeArea}>
        <View style={[styles.header, { flexDirection: "row" }]}>
          <CustomBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.title}>{t('home.recentRecycles')}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primarybrand} />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.safeArea}>
      <View style={[styles.header, { flexDirection: "row" }]}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{t('home.recentRecycles')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {translatedRecycles.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="recycle" size={64} color={Colors.borderDefault} />
          <Text style={styles.emptyText}>{t('home.noRecentRecycles')}</Text>
        </View>
      ) : (
        <FlatList
          data={translatedRecycles}
          numColumns={2}
          keyExtractor={(item) => item._id?.$oid || item._id}
          renderItem={renderItem}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <OutfitViewModal
        visible={!!selectedOutfit}
        onClose={() => setSelectedOutfit(null)}
        imageUri={selectedOutfit ? getItemImage(selectedOutfit) : null}
        isFavorite={selectedOutfit ? isFavorite(selectedOutfit._id) : false}
        onToggleFavorite={async () => {
          if (!selectedOutfit) return;
          try {
            await toggleFavorite(selectedOutfit._id, 'TRYON');
          } catch (e) {
          }
        }}
      />
    </SafeScreen>
  );
}

const createStyles = () => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: Colors.textPrimary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: Colors.disabled,
    textAlign: 'center',
  },
  row: {
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: GAP,
  },
  listContent: {
    paddingBottom: 30,
  },
  cardContainer: {
    position: 'relative',
  },
});
