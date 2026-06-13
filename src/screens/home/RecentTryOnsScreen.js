import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRecentTryOns } from '../../context/RecentTryOnsContext';
import { useFavorites } from '../../context/FavoritesContext';
import RecentItemCard from '../../components/home/RecentItemCard';
import CustomBackButton from '../../components/common/CustomBackButton';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 150;
const GAP = 15;
const TOTAL_GRID_WIDTH = CARD_WIDTH * 2 + GAP;
const HORIZONTAL_PADDING = Math.max(16, (SCREEN_WIDTH - TOTAL_GRID_WIDTH) / 2);

export default function RecentTryOnsScreen({ navigation }) {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { t } = useTranslation();
  const { tryOns, loading } = useRecentTryOns();
  const { isFavorite, addItem, removeItem } = useFavorites();

  const handleToggleFavorite = async (item) => {
    try {
      if (isFavorite(item._id)) {
        await removeItem(item._id);
      } else {
        await addItem(item._id, 'TRYON');
      }
    } catch (e) {
      console.warn('[RecentTryOns] fav error:', e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <RecentItemCard
        item={item}
        isFavorite={isFavorite(item._id)}
        onToggleFavorite={() => handleToggleFavorite(item)}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { flexDirection: "row" }]}>
          <CustomBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.title}>{t('home.recentTryOns')}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primarybrand} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { flexDirection: "row" }]}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{t('home.recentTryOns')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {tryOns.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="shirt-outline" size={64} color={Colors.borderDefault} />
          <Text style={styles.emptyText}>{t('home.noRecentTryOns')}</Text>
        </View>
      ) : (
        <FlatList
          data={tryOns}
          numColumns={2}
          keyExtractor={(item) => item._id?.$oid || item._id}
          renderItem={renderItem}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = () => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
