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
  transformRequest: (data) => data,
  timeout: 60000,
};

export const analyzeImage = async (imageUri) => {
  const formData = new FormData();
  const filename = imageUri.split("/").pop() || "image.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("image", {
    uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
    name: filename,
    type,
  });
  const { data } = await apiClient.post(ENDPOINTS.ANALYZE, formData, formDataConfig);
  return data;
};

export const getMatchesByAnalysis = async (productId) => {
  const { data } = await apiClient.post(`${ENDPOINTS.MATCHES_ANALYSIS}/${productId}`);
  return data;
};

export const checkProductMatches = async (productId) => {
  try {
    const data = await getMatchesByAnalysis(productId);
    const matches = data?.matches || data?.data?.matches || (Array.isArray(data) ? data : []);
    return matches.length > 0;
  } catch {
    return false;
  }
};
