import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/theme/colors";
import { getWeatherIcon } from "../../constants/weatherIcons";

export default function WeatherCard({ weather }) {
  const conditionIcon = getWeatherIcon(weather.condition);

  return (
    <View style={styles.card}>
      <View style={[styles.mainRow, { flexDirection: "row" }]}>
        <View style={[styles.leftRow, { flexDirection: "row" }]}>
          <Ionicons name={conditionIcon.ionicons} size={33} color={conditionIcon.color} />
          <View style={[styles.leftTextCol, { alignItems: "flex-start" }]}>
            <Text style={[styles.tempValue, { textAlign: "left" }]}>{weather.temperature}°C</Text>
            <Text style={[styles.conditionText, { textAlign: "left" }]}>{weather.condition}</Text>
          </View>
        </View>

        <View style={[styles.rightRow, { flexDirection: "row" }]}>
          <View style={styles.detailItem}>
            <Ionicons name="thermometer-outline" size={20} color="#1550D3" />
            <Text style={styles.detailText}>{weather.feelsLike}°C</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="water-percent" size={20} color="#1550D3" />
            <Text style={styles.detailText}>{weather.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="weather-windy" size={20} color="#1550D3" />
            <Text style={styles.detailText}>{weather.windSpeed} km/hr</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: "#434654",
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
});
