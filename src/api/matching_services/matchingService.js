import apiClient from "../auth_services/apiClient";
import { ENDPOINTS } from "../../config/endpoints";

export const getWardrobeMatches = async (wardrobeItemId) => {
  const response = await apiClient.post(ENDPOINTS.MATCHES, {
    wardrobe_item_id: wardrobeItemId,
  });
  return response.data;
};
