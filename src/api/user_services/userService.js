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