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

export const updateUserImage = async (userImage) => {
  const { data } = await apiClient.put(ENDPOINTS.USER_IMAGE, { userImage });
  return data;
};

export const getUserSettings = async (email) => {
  const { data } = await apiClient.post(ENDPOINTS.USER_SETTINGS, { email });
  return data;
};

export const updateLanguage = async (language) => {
  const { data } = await apiClient.put(ENDPOINTS.SELECT_LANG, { language });
  return data;
};

export const updateNotifications = async (enabled) => {
  const { data } = await apiClient.put(ENDPOINTS.USER_NOTIFICATIONS, { enabled });
  return data;
};

export const updateDarkMode = async (darkMode) => {
  const { data } = await apiClient.put(ENDPOINTS.USER_DARK_MODE, { darkMode });
  return data;
};

export const deleteAccount = async (email) => {
  const { data } = await apiClient.delete(ENDPOINTS.DELETE_ACCOUNT, { data: { email } });
  return data;
};