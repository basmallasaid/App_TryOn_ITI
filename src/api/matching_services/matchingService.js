import { Platform } from "react-native";
import apiClient from "../auth_services/apiClient";
import { ENDPOINTS } from "../../config/endpoints";

export const getWardrobeMatches = async (wardrobeItemId) => {
  const response = await apiClient.post(ENDPOINTS.MATCHES, {
    wardrobe_item_id: wardrobeItemId,
  });
  return response.data;
};

const formDataConfig = {
  headers: { "Content-Type": "multipart/form-data" },
  transformRequest: (data) => data,
  timeout: 60000,
};

export const analyzeImage = async (imageUri) => {
  const formData = new FormData();
  const name = imageUri.split("/").pop() || "image.jpg";
  formData.append("image", {
    uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
    name,
    type: `image/${name.split(".").pop() || "jpeg"}`,
  });
  const { data } = await apiClient.post(ENDPOINTS.ANALYZE, formData, formDataConfig);
  return data;
};

export const getMatchesByAnalysis = async (analysisId, lat, lon) => {
  const body = {};
  if (lat !== undefined && lon !== undefined) {
    body.lat = lat;
    body.lon = lon;
  }
  const { data } = await apiClient.post(`${ENDPOINTS.MATCHES_ANALYSIS}/${analysisId}`, body);
  return data;
};
