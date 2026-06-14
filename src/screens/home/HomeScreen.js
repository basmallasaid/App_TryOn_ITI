import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
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

export default function HomeScreen({ navigation }) {
  const { themeVersion, isDarkMode } = useTheme();
  const { showFeedback } = useFeedback();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { t } = useTranslation();
  const { profile, refreshProfile } = useProfileContext();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { todaysOutfit, todaysWeather, history } = useRecommendation();
  const activeOutfit = todaysOutfit || history?.[0] || null;
  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [refreshProfile]),
  );

  const [selectedOutfit, setSelectedOutfit] = useState(null);

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

  const latestTryOn = filterLast30Days(profile?.latestTryOn || []);
  const latestRecycle = filterLast30Days(profile?.latestRecycle || []);

  const goToHistory = () =>
    navigation.navigate(ROUTES.RECOMMENDATION, { screen: ROUTES.RECOMMENDATIONS_HISTORY });

  const goToDetail = () => {
    navigation.navigate(ROUTES.RECOMMENDATION, {
      screen: ROUTES.RECOMMENDATION_DETAIL,
      params: { outfit: activeOutfit },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />
        <HeroBanner onPress={goToHistory} />

        <Text style={[styles.sectionTitle, { textAlign: "left" }]}>{t('home.whatToDo')}</Text>
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

        <Text style={[styles.sectionTitle, { textAlign: "left" }]}>{t('home.todaysPicks')}</Text>
        <OutfitCard
          onPress={goToDetail}
          todaysOutfit={activeOutfit}
          todaysWeather={todaysWeather || activeOutfit?.weather}
        />

        <HorizontalScrollSection
          title={t('home.recentTryOns')}
          items={latestTryOn}
          onViewAll={() => navigation.navigate(ROUTES.RECENT_TRYONS)}
          renderItem={(item) => (
            <TryOnCard
              imageUri={item.imageUrl}
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
          )}
          seeMoreCardStyle={{ width: 180, height: 290, borderRadius: 20, marginRight: 15 }}
        />

        <HorizontalScrollSection
          title={t('home.recentRecycles')}
          items={latestRecycle}
          onViewAll={() => navigation.navigate(ROUTES.RECENT_RECYCLES)}
          renderItem={(item) => (
            <TryOnCard
              imageUri={item.imageUrl}
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
          )}
          seeMoreCardStyle={{ width: 180, height: 290, borderRadius: 20, marginRight: 15 }}
        />
      </ScrollView>

      <OutfitViewModal
        visible={!!selectedOutfit}
        onClose={() => setSelectedOutfit(null)}
        imageUri={selectedOutfit?.imageUrl}
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
    </SafeAreaView>
  );
}

const createStyles = () => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    // Android status bar padding
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
