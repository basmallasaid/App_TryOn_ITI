import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRecommendation } from '../../context/RecommendationContext';
import OutfitOverviewCard from '../../components/recommendations/OutfitOverviewCard';
import CustomBackButton from '../../components/common/CustomBackButton';
import Colors from '../../constants/theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { ROUTES } from '../../navigation/routes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAP = 15;
const PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;

export default function AllRecommendationsScreen({ navigation }) {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { t } = useTranslation();
  const { history, loading } = useRecommendation();

  const renderItem = ({ item, index }) => (
    <OutfitOverviewCard
      outfit={item}
      width={CARD_WIDTH}
      height={200}
      borderRadius={16}
      borderColor={Colors.borderDefault}
      labelFontSize={11}
      onPress={() => navigation.navigate(ROUTES.RECOMMENDATION_DETAIL, { outfit: item })}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { flexDirection: "row" }]}>
          <CustomBackButton onPress={() => navigation.goBack()} />
          <Text style={styles.title}>{t('recommendation.lastRecommendations')}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { flexDirection: "row" }]}>
        <CustomBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{t('recommendation.lastRecommendations')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {history.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="shirt-outline" size={64} color={Colors.borderDefault} />
          <Text style={styles.emptyText}>{t('recommendation.emptyHistory')}</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          numColumns={2}
          keyExtractor={(item, index) => item._id?.$oid || item._id || String(index)}
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
    color: Colors.textMuted,
    textAlign: 'center',
  },
  row: {
    paddingHorizontal: PADDING,
    gap: GAP,
  },
  listContent: {
    paddingBottom: 30,
    alignSelf: 'center',
  },
});
