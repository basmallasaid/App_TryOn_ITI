import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  I18nManager,
} from "react-native";
import { useTranslation } from 'react-i18next';
import Colors from "../../constants/theme/colors";
import Header from "../../components/home/Header";
import HeroBanner from "../../components/home/HeroBanner";
import ActionCard from "../../components/home/ActionCard";
import OutfitCard from "../../components/home/OutfitCard";
import TryOnCard from "../../components/home/TryOnCard";
import { IMAGES } from "../../constants/images/images";
import { Ionicons } from "@expo/vector-icons";
import { useProfileContext } from "../../context/ProfileContext";
import { ROUTES, SOURCE } from "../../navigation/routes";
import { useFavorites } from "../../context/FavoritesContext";
import { useRecommendation } from "../../context/RecommendationContext";

export default function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { profile } = useProfileContext();
  const { isFavorite, addItem, removeItem } = useFavorites();
  const { todaysOutfit, todaysWeather, history } = useRecommendation();
  const activeOutfit = todaysOutfit || history?.[0] || null;
  const isRTL = i18n.language === "ar" || I18nManager.isRTL;
  const latestTryOn = profile?.latestTryOn || [];
  const latestRecycle = profile?.latestRecycle || [];
  const arrowName = isRTL ? "arrow-back" : "arrow-forward";

  const goToHistory = () =>
    navigation.navigate(ROUTES.RECOMMENDATION, { screen: ROUTES.RECOMMENDATIONS_HISTORY });

  const goToDetail = () => {
    console.log("[HomeScreen] goToDetail: activeOutfit=", activeOutfit ? "present" : "null");
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

        <Text style={styles.sectionTitle}>{t('home.whatToDo')}</Text>
        <View style={styles.grid}>
          <ActionCard
            title={t('home.actions.tryOn')}
            sub={t('home.actions.tryOnSub')}
            mainIconName="crop-free"
            innerIconName="tshirt-crew"
            titleColor="#40B9FF"
            iconBgColor="#E9F7FE"
            iconColor="#40B9FF"
            onPress={() => navigation.navigate(ROUTES.TRY_ON, { screen: ROUTES.SELECT_MODEL, params: { source: SOURCE.HOME } })}
          />
          <ActionCard
            title={t('home.actions.recycle')}
            sub={t('home.actions.recycleSub')}
            mainIconName="recycle"
            titleColor="#A6E22E"
            iconBgColor="#F1F8E9"
            iconColor="#A6E22E"
            onPress={() => navigation.navigate(ROUTES.RECYCLE)}
          />
          <ActionCard
            title={t('home.actions.generateOutfit')}
            sub={t('home.actions.generateOutfitSub')}
            useIonicons={true}
            mainIconName="sparkles"
            titleColor="#FF7D9A"
            iconBgColor="#FFF0F3"
            iconColor="#FF6B8B"
            onPress={goToHistory}
          />
          <ActionCard
            title={t('home.actions.matching')}
            sub={t('home.actions.matchingSub')}
            useIonicons={true}
            mainIconName="checkmark-circle-outline"
            titleColor="#FF8A3D"
            iconBgColor="#FFF3E0"
            iconColor="#FF8A3D"
            onPress={() => navigation.navigate(ROUTES.MATCHING)}
          />
        </View>

        <Text style={styles.sectionTitle}>{t('home.todaysPicks')}</Text>
        <OutfitCard
          onPress={goToDetail}
          todaysOutfit={activeOutfit}
          todaysWeather={todaysWeather || activeOutfit?.weather}
        />

        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>{t('home.recentTryOns')}</Text>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>{t('home.viewAll')}</Text>
            <Ionicons
              name={arrowName}
              size={16}
              color="#1A1C24"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollPadding}
        >
          {latestTryOn.length === 0 ? (
            <TryOnCard imageUri={null} />
          ) : (
            latestTryOn.map((item, index) => (
              <TryOnCard
                key={item._id?.$oid || item._id || index}
                imageUri={item.imageUrl}
                isFavorite={isFavorite(item._id)}
                onToggleFavorite={async () => {
                  try {
                    if (isFavorite(item._id)) {
                      await removeItem(item._id);
                    } else {
                      await addItem(item._id, 'TRYON');
                    }
                  } catch (e) {
                    Alert.alert('Error', e.response?.data?.message || 'Failed to update favorite');
                  }
                }}
              />
            ))
          )}
        </ScrollView>

        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>{t('home.recentRecycles')}</Text>
          <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate(ROUTES.RECYCLE)}>
            <Text style={styles.viewAllText}>{t('home.viewAll')}</Text>
            <Ionicons name={arrowName} size={16} color="#1A1C24" style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollPadding}
        >
          {latestRecycle.length === 0 ? (
            <TryOnCard imageUri={null} />
          ) : (
            latestRecycle.map((item, index) => (
              <TryOnCard
                key={item._id?.$oid || item._id || index}
                imageUri={item.imageUrl}
                isFavorite={isFavorite(item._id)}
                onToggleFavorite={async () => {
                  try {
                    if (isFavorite(item._id)) {
                      await removeItem(item._id);
                    } else {
                      await addItem(item._id, 'TRYON');
                    }
                  } catch (e) {
                    Alert.alert('Error', e.response?.data?.message || 'Failed to update favorite');
                  }
                }}
              />
            ))
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
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
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 25,
    color: Colors.textPrimary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1C24",
    textTransform: "capitalize",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#1A1C24",
    marginRight: 5,
  },
  scrollPadding: {
    paddingBottom: 10,
    paddingRight: 20,
  },
  arrowIcon: {
    marginTop: 3,
  },
});
