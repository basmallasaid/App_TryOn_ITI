import { Platform } from "react-native";
import apiClient from "../auth_services/apiClient";
import { ENDPOINTS } from "../../config/endpoints";

const LOG_TAG = "[MatchingService]";

const matchConfig = {
  timeout: 60000,
};

export const getWardrobeMatches = async (wardrobeItemId) => {
  console.log(LOG_TAG, "getWardrobeMatches called with:", wardrobeItemId);
  try {
    const response = await apiClient.post(
      ENDPOINTS.MATCHES,
      { wardrobe_item_id: wardrobeItemId },
      matchConfig,
    );
    const data = response.data;
    console.log(LOG_TAG, "getWardrobeMatches response keys:", Object.keys(data || {}));
    console.log(LOG_TAG, "getWardrobeMatches matches count:", data?.matches?.length);
    console.log(LOG_TAG, "getWardrobeMatches has weather:", !!data?.weather);
    if (data?.matches?.[0]) {
      console.log(LOG_TAG, "getWardrobeMatches first match item keys:", Object.keys(data.matches[0].item || {}));
      console.log(LOG_TAG, "getWardrobeMatches first match item.image:", data.matches[0].item?.image);
      console.log(LOG_TAG, "getWardrobeMatches first match source:", data.matches[0].item?.source);
      console.log(LOG_TAG, "getWardrobeMatches first match id:", data.matches[0].item?.id);
      console.log(LOG_TAG, "getWardrobeMatches first match score:", data.matches[0].score);
    }
    return data;
  } catch (e) {
    console.log(LOG_TAG, "getWardrobeMatches failed:", e.message, e.response?.status, JSON.stringify(e.response?.data).slice(0, 200));
    throw e;
  }
};

const formDataConfig = {
  headers: { 'Content-Type': 'multipart/form-data' },
  transformRequest: (data) => data,
  timeout: 120000,
};

export const analyzeImage = async (imageUri) => {
  console.log(LOG_TAG, "analyzeImage called with:", imageUri?.slice(0, 80));
  const formData = new FormData();
  const filename = imageUri.split("/").pop() || "image.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("image", {
    uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
    name: filename,
    type,
  });

  console.log(LOG_TAG, "analyzeImage FormData prepared, sending to:", ENDPOINTS.ANALYZE);
  try {
    const { data } = await apiClient.post(ENDPOINTS.ANALYZE, formData, formDataConfig);
    console.log(LOG_TAG, "analyzeImage success:", JSON.stringify(data).slice(0, 500));
    return data;
  } catch (e) {
    console.log(LOG_TAG, "analyzeImage failed:", e.message, e.response?.status, JSON.stringify(e.response?.data).slice(0, 200));
    throw e;
  }
};

export const getMatchesByAnalysis = async (analysisId, latitude, longitude) => {
  console.log(LOG_TAG, "getMatchesByAnalysis called with:", { analysisId, latitude, longitude });
  const url = `${ENDPOINTS.MATCHES_ANALYSIS}/${analysisId}`;
  console.log(LOG_TAG, "getMatchesByAnalysis URL:", url);
  try {
    const { data } = await apiClient.post(
      url,
      { latitude, longitude },
      matchConfig,
    );
    console.log(LOG_TAG, "getMatchesByAnalysis response keys:", Object.keys(data || {}));
    console.log(LOG_TAG, "getMatchesByAnalysis matches count:", data?.matches?.length);
    console.log(LOG_TAG, "getMatchesByAnalysis has analyzedProduct:", !!data?.analyzedProduct);
    if (data?.matches?.[0]) {
      console.log(LOG_TAG, "getMatchesByAnalysis first match item keys:", Object.keys(data.matches[0].item || {}));
      console.log(LOG_TAG, "getMatchesByAnalysis first match item.image:", data.matches[0].item?.image);
      console.log(LOG_TAG, "getMatchesByAnalysis first match source:", data.matches[0].item?.source);
      console.log(LOG_TAG, "getMatchesByAnalysis first match id:", data.matches[0].item?.id);
    }
    return data;
  } catch (e) {
    console.log(LOG_TAG, "getMatchesByAnalysis failed:", e.message, e.response?.status, JSON.stringify(e.response?.data).slice(0, 200));
    throw e;
  }
};

export const getMatchesByAnalysisId = async (analysisId, latitude, longitude) => {
  console.log(LOG_TAG, "getMatchesByAnalysisId called with:", { analysisId, latitude, longitude });
  const url = `${ENDPOINTS.MATCHES_ANALYSIS_ID}/${analysisId}`;
  console.log(LOG_TAG, "getMatchesByAnalysisId URL:", url);
  try {
    const { data } = await apiClient.post(
      url,
      { latitude, longitude },
      matchConfig,
    );
    console.log(LOG_TAG, "getMatchesByAnalysisId response keys:", Object.keys(data || {}));
    console.log(LOG_TAG, "getMatchesByAnalysisId matches count:", data?.matches?.length);
    console.log(LOG_TAG, "getMatchesByAnalysisId has weather:", !!data?.weather);
    if (data?.matches?.[0]) {
      console.log(LOG_TAG, "getMatchesByAnalysisId first match item keys:", Object.keys(data.matches[0].item || {}));
      console.log(LOG_TAG, "getMatchesByAnalysisId first match item.image:", data.matches[0].item?.image);
      console.log(LOG_TAG, "getMatchesByAnalysisId first match source:", data.matches[0].item?.source);
      console.log(LOG_TAG, "getMatchesByAnalysisId first match id:", data.matches[0].item?.id);
      console.log(LOG_TAG, "getMatchesByAnalysisId first match score:", data.matches[0].score);
    }
    return data;
  } catch (e) {
    console.log(LOG_TAG, "getMatchesByAnalysisId failed:", e.message, e.response?.status, JSON.stringify(e.response?.data).slice(0, 200));
    throw e;
  }
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
