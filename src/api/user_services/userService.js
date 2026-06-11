import apiClient from '../auth_services/apiClient';
import { ENDPOINTS } from '../../config/endpoints';

export const getUserProfile = async (userId) => {
  const { data } = await apiClient.get(`/users/${userId}`);
  return data.user;
};

export const getAllProducts = async () => {
  const { data } = await apiClient.get(ENDPOINTS.GET_ALL_PRODUCT);
  return data;
};

export const saveLatestTryon = async (payload) => {
  const { data } = await apiClient.post(ENDPOINTS.LATEST_TRYON, payload);
  return data;
}

export const getProductById = async (productId) => {
  const endpoint = ENDPOINTS.GET_PRODUCT.replace('${id}', productId);
  const { data } = await apiClient.get(endpoint);
  return data?.product ?? data;
};