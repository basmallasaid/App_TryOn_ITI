export const CONDITION_ICONS = {
  sunny: { ionicons: "sunny", material: "weather-sunny", color: "#F59E0B" },
  clear: { ionicons: "sunny", material: "weather-sunny", color: "#F59E0B" },
  cloudy: { ionicons: "cloudy", material: "weather-cloudy", color: "#6B7280" },
  overcast: { ionicons: "cloudy", material: "weather-cloudy", color: "#6B7280" },
  rainy: { ionicons: "rainy", material: "weather-rainy", color: "#3B82F6" },
  drizzle: { ionicons: "rainy", material: "weather-rainy", color: "#3B82F6" },
  snowy: { ionicons: "snow", material: "weather-snowy", color: "#93C5FD" },
  foggy: { ionicons: "cloudy-outline", material: "weather-fog", color: "#9CA3AF" },
  misty: { ionicons: "cloudy-outline", material: "weather-fog", color: "#9CA3AF" },
};

export function getWeatherIcon(condition) {
  const key = condition?.toLowerCase() || "clear";
  return CONDITION_ICONS[key] || CONDITION_ICONS.clear;
}
