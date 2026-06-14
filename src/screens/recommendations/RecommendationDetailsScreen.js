import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import CustomBackButton from "../../components/common/CustomBackButton";
import OutfitOverviewCard from "../../components/recommendations/OutfitOverviewCard";
import OutfitItemCard from "../../components/recommendations/OutfitItemCard";
import { getItemsList } from "../../utils/getItemImage";
import { useRecommendation } from "../../context/RecommendationContext";

function formatRecommendationDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RecommendationDetailsScreen({ navigation, route }) {
  const { themeVersion } = useTheme();
  const styles = React.useMemo(() => createStyles(), [themeVersion]);
  const { t } = useTranslation();
  const { todaysOutfit } = useRecommendation();
  const outfit = route.params?.outfit || todaysOutfit;
  const items = getItemsList(outfit);
  const hasData = outfit && items.length > 0;
  const recommendedDate = formatRecommendationDate(outfit?.created_at);

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

        <Text style={[styles.todayTitle, { textAlign: "left" }]}>
          {t("recommendation.todaysRecommendation")}
        </Text>

        {recommendedDate && (
          <Text style={styles.dateLabel}>
            {t("recommendation.recommendedOn", { date: recommendedDate })}
          </Text>
        )}

        {hasData ? (
          <>
            <OutfitOverviewCard
              outfit={outfit}
              width="100%"
              height={400}
              borderRadius={8}
              borderColor={Colors.borderStrong}
              labelFontSize={14}
            />

            {outfit?.score != null && (
              <View style={[styles.scoreRow, { flexDirection: "row" }]}>
                <Ionicons name="star" size={16} color={Colors.accentOrange} />
                <Text style={styles.scoreText}>{outfit.score.toFixed(1)}</Text>
              </View>
            )}

            <Text style={[styles.sectionTitle, { textAlign: "left" }]}>
              {t("recommendation.outfitDetails")}
            </Text>

            <View style={[styles.itemsGrid, { flexDirection: "row" }]}>
              {items.map((item) => (
                <OutfitItemCard
                  key={
                    item._id || item.id || item.name || Math.random().toString()
                  }
                  item={item}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="hanger"
              size={64}
              color={Colors.disabled}
            />
            <Text style={styles.emptyTitle}>
              {t("recommendation.noOutfitTitle")}
            </Text>
            <Text style={styles.emptySubtitle}>
              {t("recommendation.noOutfitSubtitle")}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = () =>
  StyleSheet.create({
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
      marginBottom: 20,
    },
    todayTitle: {
      fontFamily: "Roboto_600SemiBold",
      fontWeight: "600",
      fontSize: 20,
      lineHeight: 20,
      color: Colors.textPrimary,
      paddingVertical: 10,
    },
    dateLabel: {
      fontFamily: "Roboto",
      fontSize: 13,
      color: Colors.iconGray,
      marginBottom: 20,
    },
    scoreRow: {
      alignItems: "center",
      marginTop: 16,
    },
    scoreText: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.textPrimary,
    },
    breakdownRow: {
      flexWrap: "wrap",
      marginTop: 10,
      gap: 8,
    },
    breakdownChip: {
      alignItems: "center",
      backgroundColor: Colors.white,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: Colors.borderDefault,
    },
    breakdownLabel: {
      fontSize: 12,
      color: Colors.textMuted,
      textTransform: "capitalize",
    },
    breakdownValue: {
      fontSize: 12,
      fontWeight: "600",
      color: Colors.textPrimary,
    },
    sectionTitle: {
      fontFamily: "Roboto_600SemiBold",
      fontSize: 18,
      fontWeight: "700",
      color: Colors.textPrimary,
      marginTop: 30,
      marginBottom: 16,
    },
    itemsGrid: {
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 80,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: Colors.textMuted,
      marginTop: 16,
    },
    emptySubtitle: {
      fontSize: 14,
      color: Colors.disabled,
      marginTop: 8,
      textAlign: "center",
      paddingHorizontal: 40,
    },
  });
