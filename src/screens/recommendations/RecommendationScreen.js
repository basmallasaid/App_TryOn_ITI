import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import CustomBackButton from "../../components/common/CustomBackButton";
import WeatherCard from "../../components/recommendations/WeatherCard";
import OutfitOverviewCard from "../../components/recommendations/OutfitOverviewCard";
import { useProfileContext } from "../../context/ProfileContext";
import { useRecommendation } from "../../context/RecommendationContext";
import { ROUTES } from "../../navigation/routes";
import { getGreeting } from "../../utils/greeting";

export default function RecommendationScreen({ navigation }) {
  const { t } = useTranslation();
  const { profile } = useProfileContext();
  const { todaysOutfit, history, loading } = useRecommendation();
  const firstName = profile?.profile?.first_name?.split(" ")[0] || "";
  const weather = todaysOutfit?.weather || history[0]?.weather || null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.backRow}>
          <CustomBackButton
            onPress={() => navigation.goBack()}
            iconColor={Colors.iconGray}
          />
        </View>

        <View style={styles.greetingRow}>
          <Text style={styles.greetingText}>{getGreeting()}, {firstName}</Text>
          <Text style={styles.wave}>👋</Text>
        </View>
        <Text style={styles.subtitle}>Let's dress smart today.</Text>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        ) : (
          <>
            {weather && <WeatherCard weather={weather} />}

            {(todaysOutfit || history[0]) && (
              <>
                <Text style={styles.sectionTitle}>{t('recommendation.todaysRecommendation')}</Text>
                <OutfitOverviewCard
                  outfit={todaysOutfit || history[0]}
                  width="100%"
                  height={246}
                  borderRadius={8}
                  borderColor={Colors.borderStrong}
                  labelFontSize={15}
                  onPress={() =>
                    navigation.navigate(ROUTES.RECOMMENDATION_DETAIL, {
                      outfit: todaysOutfit || history[0],
                    })
                  }
                />
              </>
            )}

            <Text style={styles.sectionTitle}>{t('recommendation.lastRecommendations')}</Text>
            {history.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="wardrobe-outline" size={48} color={Colors.disabled} />
                <Text style={styles.emptyText}>{t('recommendation.emptyHistory')}</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.historyScroll}
              >
                {history.map((item, index) => (
                  <OutfitOverviewCard
                    key={index}
                    outfit={item}
                    width={177}
                    height={138}
                    borderRadius={16}
                    borderColor={Colors.borderDefault}
                    labelFontSize={11}
                    onPress={() =>
                      navigation.navigate(ROUTES.RECOMMENDATION_DETAIL, { outfit: item })
                    }
                  />
                ))}
              </ScrollView>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  backRow: {
    marginTop: 15,
    marginBottom: 8,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop:20,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  wave: {
    fontSize: 20,
    marginLeft: 6,
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 16,
    color: Colors.textSecondary,
    marginBottom: 25,
    paddingBottom:5,
  },
  loader: {
    marginTop: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 28,
    marginBottom: 14,
  },
  historyScroll: {
    paddingRight: 20,
    paddingBottom: 10,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 12,
  },
});
