import apiClient from "../auth_services/apiClient";
import axios from "axios";
import { ENDPOINTS } from "../../config/endpoints";

export const getAllRecommendations = async () => {
  const { data } = await apiClient.get(ENDPOINTS.RECOMMENDATIONS);
  return { history: data.history || [], weather: data.currentWeather || null };
};

export const requestRecommendations = async (lat = 30.0444, lon = 31.2357) => {
  const { data } = await apiClient.post(ENDPOINTS.RECOMMENDATIONS, {
    limit: 1,
    lat,
    lon,
  });
  return { outfits: data.outfits || [], weather: data.currentWeather || null };
};
