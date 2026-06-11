import apiClient from '../auth_services/apiClient';
import { ENDPOINTS } from '../../config/endpoints';

export const getFavorites = async () => {
  const { data } = await apiClient.get(ENDPOINTS.GET_FAVORITES);
  return data;
};

export const addFavorite = async (itemId, itemType) => {
  const { data } = await apiClient.post(ENDPOINTS.ADD_FAVORITE, { itemId, itemType });
  return data;
};

export const removeFavorite = async (itemId) => {
  const { data } = await apiClient.delete(`${ENDPOINTS.REMOVE_FAVORITE}/${itemId}`);
  return data;
};
