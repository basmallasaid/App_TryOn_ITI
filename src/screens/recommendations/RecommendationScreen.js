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
  TouchableOpacity,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import CustomBackButton from "../../components/common/CustomBackButton";
import WeatherCard from "../../components/recommendations/WeatherCard";
import OutfitOverviewCard from "../../components/recommendations/OutfitOverviewCard";
import { useProfileContext } from "../../context/ProfileContext";
import { useRecommendation } from "../../context/RecommendationContext";
import { ROUTES } from "../../navigation/routes";
import { getGreeting } from "../../utils/greeting";
import i18n from "../../localization/i18n";

function locale() {
  return i18n.language === 'ar' ? 'ar-EG' : 'en-US';
}

function formatDateLabel(dateStr) {
  const parts = dateStr.split('-');
  const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
  return d.toLocaleDateString(locale(), { month: "short", day: "numeric" });
}

function getShortDay(dayIndex) {
  const d = new Date(2026, 0, 3 + dayIndex);
  return d.toLocaleDateString(locale(), { weekday: "short" });
}

const DAY_CARD_WIDTH = 155;

export default function RecommendationScreen({ navigation }) {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { t } = useTranslation();
  const { profile } = useProfileContext();
  const { weeklyOutfits, todaysOutfit, fallbackOutfit, todaysWeather, history, loading } = useRecommendation();
  const firstName = profile?.profile?.first_name?.split(" ")[0] || "";

  const weather = todaysWeather || weeklyOutfits.find(d => d.isToday)?.entry?.weather || history[0]?.weather || null;
  const todayEntry = weeklyOutfits.find(d => d.isToday);
  const todayOutfit = todaysOutfit || fallbackOutfit || todayEntry?.entry || null;

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

        <View style={[styles.greetingRow, { flexDirection: "row" }]}>
          <Text style={styles.greetingText}>{getGreeting(t)}, {firstName}</Text>
          <Text style={styles.wave}>👋</Text>
        </View>
        <Text style={styles.subtitle}>{t("recommendation.subtitle")}</Text>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        ) : (
          <>
            {weather && <WeatherCard weather={weather} />}

            {todayOutfit && (
              <>
                <Text style={[styles.sectionTitle, { textAlign: "left" }]}>{t('recommendation.todaysRecommendation')}</Text>
                <OutfitOverviewCard
                  outfit={todayOutfit}
                  width="100%"
                  height={246}
                  borderRadius={8}
                  borderColor={Colors.borderStrong}
                  labelFontSize={15}
                  onPress={() =>
                    navigation.navigate(ROUTES.RECOMMENDATION_DETAIL, {
                      outfit: todayOutfit,
                    })
                  }
                />
              </>
            )}

            <Text style={[styles.sectionTitle, { textAlign: "left" }]}>{t('recommendation.weeklyTitle')}</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {weeklyOutfits.map((day) => (
                <View key={day.date} style={styles.dayCard}>
                  <View style={[styles.dayHeader, { flexDirection: "row" }]}>
                    <Text style={[styles.dayName, day.isToday && styles.dayNameToday]}>
                      {getShortDay(day.dayIndex)}
                    </Text>
                    {day.isToday && (
                      <View style={styles.todayBadge}>
                        <Text style={styles.todayBadgeText}>{t('recommendation.today')}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.dayDate}>{formatDateLabel(day.date)}</Text>

                  {day.hasOutfit ? (
                    <OutfitOverviewCard
                      outfit={day.entry}
                      width={DAY_CARD_WIDTH}
                      height={140}
                      borderRadius={8}
                      borderColor={day.isToday ? Colors.primary : Colors.borderDefault}
                      labelFontSize={10}
                      onPress={() =>
                        navigation.navigate(ROUTES.RECOMMENDATION_DETAIL, {
                          outfit: day.entry,
                        })
                      }
                    />
                  ) : (
                    <View style={styles.emptyDayCard}>
                      <MaterialCommunityIcons
                        name="weather-sunny"
                        size={24}
                        color={Colors.disabled}
                      />
                      <Text style={styles.emptyDayText}>{t('recommendation.noOutfitForDay')}</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>


          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = () => StyleSheet.create({
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
    marginTop: 20,
  },
  greetingText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  wave: {
    fontSize: 20,
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 16,
    color: Colors.textSecondary,
    marginBottom: 25,
    paddingBottom: 5,
  },
  loader: {
    marginTop: 80,
  },
  sectionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 15,
    marginTop: 35,
  },
  horizontalScrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  dayCard: {
    width: DAY_CARD_WIDTH,
  },
  dayHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  dayName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  dayNameToday: {
    color: Colors.primary,
  },
  todayBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  todayBadgeText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 10,
    color: Colors.textInverse,
  },
  dayDate: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  emptyDayCard: {
    width: DAY_CARD_WIDTH,
    height: 140,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
    borderColor: Colors.borderDefault,
  },
  emptyDayText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 6,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 12,
  },
});
