import apiClient from '../auth_services/apiClient';
import { ENDPOINTS } from "../../config/endpoints";

export const generateAvatar = async (payload) => {
  const { data } = await apiClient.post(ENDPOINTS.GENERATE_AVATAR, payload, {
    timeout: 180000,
  });
  console.log("Avatar generated successfully:", JSON.stringify(data, null, 2));
  return data;
};

export const getAvatarById = async (id) => {
  const { data } = await apiClient.get(`${ENDPOINTS.GET_AVATAR}/${id}`);
  return data;
};
