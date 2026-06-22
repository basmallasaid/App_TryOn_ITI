import React, { useCallback, useState, useMemo } from "react";
import SafeScreen from "../../components/common/SafeScreen";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import Header from "../../components/home/Header";
import HeroBanner from "../../components/home/HeroBanner";
import ActionCard from "../../components/home/ActionCard";
import OutfitCard from "../../components/home/OutfitCard";
import TryOnCard from "../../components/home/TryOnCard";
import { IMAGES } from "../../constants/images/images";
import { useProfileContext } from "../../context/ProfileContext";
import { ROUTES, SOURCE } from "../../navigation/routes";
import { useFavorites } from "../../context/FavoritesContext";
import { useRecommendation } from "../../context/RecommendationContext";
import HorizontalScrollSection from "../../components/common/HorizontalScrollSection";
import OutfitViewModal from "../../components/common/OutfitViewModal";
import { useFeedback } from "../../context/FeedbackContext";
import { getUserFriendlyErrorMessage } from "../../utils/errorMessages";
import { getItemImage } from "../../utils/getItemImage";

const filterLast30Days = (items) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return items.filter((item) => {
    const raw = item.created_at || item.createdAt;
    if (!raw) return true;
    const itemDate = new Date(raw);
    return !isNaN(itemDate.getTime()) && itemDate >= thirtyDaysAgo;
  });
};

export default function HomeScreen({ navigation }) {
  const { themeVersion, isDarkMode } = useTheme();
  const { showFeedback } = useFeedback();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { t } = useTranslation();
  const { profile, refreshProfile } = useProfileContext();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { todaysOutfit, todaysWeather, history } = useRecommendation();
  const activeOutfit = useMemo(() => todaysOutfit || history?.[0] || null, [todaysOutfit, history]);
  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [refreshProfile]),
  );

  const [selectedOutfit, setSelectedOutfit] = useState(null);

  const latestTryOn = useMemo(() => filterLast30Days(profile?.latestTryOn || []), [profile?.latestTryOn]);
  const latestRecycle = useMemo(() => filterLast30Days(profile?.latestRecycle || []), [profile?.latestRecycle]);

  const goToHistory = useCallback(() =>
    navigation.navigate(ROUTES.RECOMMENDATION, { screen: ROUTES.RECOMMENDATIONS_HISTORY }), [navigation]);

  const goToDetail = useCallback(() => {
    navigation.navigate(ROUTES.RECOMMENDATION, {
      screen: ROUTES.RECOMMENDATION_DETAIL,
      params: { outfit: activeOutfit },
    });
  }, [navigation, activeOutfit]);

  const renderTryOnItem = useCallback((item) => (
    <TryOnCard
      imageUri={getItemImage(item)}
      isFavorite={isFavorite(item._id)}
      onToggleFavorite={async () => {
        try {
          await toggleFavorite(item._id, 'TRYON');
        } catch (e) {
          showFeedback({ type: "error", title: t("common.error"), message: getUserFriendlyErrorMessage(e, t) });
        }
      }}
      onViewOutfit={() => setSelectedOutfit(item)}
    />
  ), [isFavorite, toggleFavorite, showFeedback, t]);

  const renderRecycleItem = useCallback((item) => (
    <TryOnCard
      imageUri={getItemImage(item)}
      isFavorite={isFavorite(item._id)}
      onToggleFavorite={async () => {
        try {
          await toggleFavorite(item._id, 'TRYON');
        } catch (e) {
          showFeedback({ type: "error", title: t("common.error"), message: getUserFriendlyErrorMessage(e, t) });
        }
      }}
      onViewOutfit={() => setSelectedOutfit(item)}
    />
  ), [isFavorite, toggleFavorite, showFeedback, t]);

  return (
    <SafeScreen style={styles.safeArea}>
      <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />
        <HeroBanner onPress={goToHistory} />

        <View style={{ flexDirection: 'row', width: '100%' }}>
          <Text style={styles.sectionTitle}>{t('home.whatToDo')}</Text>
        </View>
        <View style={styles.grid}>
          <ActionCard
            title={t('home.actions.tryOn')}
            sub={t('home.actions.tryOnSub')}
            mainIconName="crop-free"
            innerIconName="tshirt-crew"
            titleColor={Colors.primary}
            iconBgColor={isDarkMode ? "#1E3A56" : "#E9F7FE"}
            iconColor={Colors.primary}
            onPress={() => navigation.navigate(ROUTES.TRY_ON, { screen: ROUTES.SELECT_MODEL, params: { source: SOURCE.HOME } })}
          />
          <ActionCard
            title={t('home.actions.recycle')}
            sub={t('home.actions.recycleSub')}
            mainIconName="recycle"
            titleColor={Colors.secondary}
            iconBgColor={isDarkMode ? "#274E13" : "#F1F8E9"}
            iconColor={Colors.secondary}
            onPress={() => navigation.navigate(ROUTES.RECYCLE)}
          />
          <ActionCard
            title={t('home.actions.generateOutfit')}
            sub={t('home.actions.generateOutfitSub')}
            useIonicons={true}
            mainIconName="sparkles"
            titleColor={Colors.accent}
            iconBgColor={isDarkMode ? "#3D1F2A" : "#FFF0F3"}
            iconColor={Colors.accent}
            onPress={goToHistory}
          />
          <ActionCard
            title={t('home.actions.matching')}
            sub={t('home.actions.matchingSub')}
            useIonicons={true}
            mainIconName="checkmark-circle-outline"
            titleColor={Colors.accentOrange}
            iconBgColor={isDarkMode ? "#3D2A1A" : "#FFF3E0"}
            iconColor={Colors.accentOrange}
            onPress={() => navigation.navigate(ROUTES.MATCHING)}
          />
        </View>

        <View style={{ flexDirection: 'row', width: '100%' }}>
          <Text style={styles.sectionTitle}>{t('home.todaysPicks')}</Text>
        </View>
        <OutfitCard
          onPress={goToDetail}
          todaysOutfit={activeOutfit}
          todaysWeather={todaysWeather || activeOutfit?.weather}
        />

        <HorizontalScrollSection
          title={t('home.recentTryOns')}
          items={latestTryOn}
          onViewAll={() => navigation.navigate(ROUTES.RECENT_TRYONS)}
          renderItem={renderTryOnItem}
          seeMoreCardStyle={{ width: 180, height: 290, borderRadius: 20, marginEnd: 15 }}
        />

        <HorizontalScrollSection
          title={t('home.recentRecycles')}
          items={latestRecycle}
          onViewAll={() => navigation.navigate(ROUTES.RECENT_RECYCLES)}
          renderItem={renderRecycleItem}
          seeMoreCardStyle={{ width: 180, height: 290, borderRadius: 20, marginEnd: 15 }}
        />
      </ScrollView>
      </View>

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
            showFeedback({ type: "error", title: t("common.error"), message: getUserFriendlyErrorMessage(e, t) });
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
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    overflow: "visible",
  },
  container: {
    flex: 1,
  },
  // Bottom padding so content clears the bottom tab bar
  scrollContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    marginVertical: 25,
    color: Colors.textPrimary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },

});
