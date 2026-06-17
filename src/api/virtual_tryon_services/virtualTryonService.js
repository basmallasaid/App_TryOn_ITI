import apiClient from '../auth_services/apiClient';
import { ENDPOINTS } from '../../config/endpoints';

const formDataConfig = {
  headers: { 'Content-Type': 'multipart/form-data' },
  transformRequest: (data) => data,
};

export const virtualTryOn = async (formData) => {
  const { data } = await apiClient.post(ENDPOINTS.VIRTUAL_TRYON, formData, formDataConfig);
  return data;
};

export const virtualTryOnOutfit = async (formData) => {
  const { data } = await apiClient.post(ENDPOINTS.VIRTUAL_TRYON_OUTFIT, formData, formDataConfig);
  return data;
};
