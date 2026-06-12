import apiClient from "../auth_services/apiClient";
import { ENDPOINTS } from "../../config/endpoints";
const HF_TOKEN = process.env.EXPO_PUBLIC_HF_TOKEN;

export const analyzeGarment = async (formData) => {
  const { data } = await apiClient.post(
    ENDPOINTS.ANALYZE,
    formData, // Send the FormData object directly
    {
      headers: {
        // "x-hf-token": HF_TOKEN,
        "Content-Type": "multipart/form-data", // Tell the server to expect a file
      },
      transformRequest: (data, headers) => {
        return data; // Required for Axios to handle FormData correctly in some environments
      },
      timeout: 60000,
    },
  );
  console.log(data);
  return data;
};

export const saveToWardrobe = async (analysis_id, garment_index = 0) => {
  const { data } = await apiClient.post(ENDPOINTS.SAVETOWARDROBE, {
    analysis_id,
    garment_index,
  });
  return data;
};

/**
 * Get all wardrobe items for the current user
 */
export const getWardrobeItems = async () => {
  const { data } = await apiClient.get(ENDPOINTS.WARDROBE);
  return data.items; // array of wardrobe items
};

export const deleteWardrobeItem = async (id) => {
  const { data } = await apiClient.delete(`${ENDPOINTS.WARDROBE}/${id}`);
  return data;
};

export const editWardrobeItem = async (id, originalGarment, updateData) => {
  const body = {
    detectionType: "single",
    garments: [
      {
        specificType: updateData.name,
        category: updateData.category.toLowerCase(),
        style: updateData.style.toLowerCase(),
        season: updateData.season.map((s) => s.toLowerCase()),
        colors: originalGarment.colors,
        confidence: originalGarment.confidence || 1,
        pattern: originalGarment.pattern || "solid",
        gender: originalGarment.gender || "unisex",
      },
    ],
  };

  const { data } = await apiClient.put(`${ENDPOINTS.ANALYZE}/${id}`, body);
  return data;
};

export const getWardrobeItem = async (id) => {
  const { data } = await apiClient.get(`${ENDPOINTS.ANALYZE}/${id}`);
  return data.analysis;
};
