import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import { useTheme } from "../../context/ThemeContext";
import { getWeatherIcon } from "../../constants/weatherIcons";
import { translateToArabic } from "../../utils/dynamicTranslator";
import i18n from "../../localization/i18n";

export default function WeatherCard({ weather }) {
  const { themeVersion } = useTheme();
  const [conditionText, setConditionText] = useState(weather?.condition || "");

  useEffect(() => {
    const translateCondition = async () => {
      if (i18n.language === 'ar' && weather?.condition) {
        const translated = await translateToArabic(weather.condition, 'ar');
        setConditionText(translated || weather.condition);
      } else {
        setConditionText(weather?.condition || "");
      }
    };
    translateCondition();
  }, [weather?.condition]);

  if (!weather) return null;

  const conditionIcon = getWeatherIcon(weather.condition);

const styles = React.useMemo(() => StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.white,
    padding: 16,
  },
  mainRow: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftRow: {
    alignItems: "center",
    gap: 8,
  },
  leftTextCol: {
  },
  tempValue: {
    fontFamily: "Geist",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.24,
    color: Colors.textPrimary,
  },
  conditionText: {
    fontFamily: "Geist",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    color: Colors.textSecondary,
  },
  rightRow: {
    gap: 16,
  },
  detailItem: {
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginTop: 4,
  },
}), [themeVersion]);

  return (
    <View style={styles.card}>
      <View style={[styles.mainRow, { flexDirection: "row" }]}>
        <View style={[styles.leftRow, { flexDirection: "row" }]}>
          <Ionicons name={conditionIcon.ionicons} size={33} color={conditionIcon.color} />
          <View style={[styles.leftTextCol, { alignItems: "flex-start" }]}>
            <Text style={[styles.tempValue, { textAlign: "left" }]}>{weather.temperature}°C</Text>
            <Text style={[styles.conditionText, { textAlign: "left" }]}>{conditionText}</Text>
          </View>
        </View>

        <View style={[styles.rightRow, { flexDirection: "row" }]}>
          <View style={styles.detailItem}>
            <Ionicons name="thermometer-outline" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{weather.feelsLike}°C</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="water-percent" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{weather.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="weather-windy" size={20} color={Colors.primary} />
            <Text style={styles.detailText}>{weather.windSpeed} km/hr</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

