import apiClient from "../auth_services/apiClient";
import axios from "axios";
import { ENDPOINTS } from "../../config/endpoints";

export const getAllRecommendations = async () => {
  const { data } = await apiClient.get(ENDPOINTS.RECOMMENDATIONS);
  return { history: data.history || [], weather: data.currentWeather || null };
};

export const requestRecommendations = async (lat = 30.0444, lon = 31.2357) => {
  try {
    const { data } = await apiClient.post(ENDPOINTS.RECOMMENDATIONS, {
      limit: 1,
      lat,
      lon,
    }, { timeout: 30000 });
    return { outfits: data.outfits || [], weather: data.currentWeather || null };
  } catch (e) {
    console.error("[requestRecommendations] Error:", e.message, e.code, e.response?.status, e.response?.data);
    throw e;
  }
};
