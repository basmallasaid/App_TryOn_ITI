import apiClient from '../auth_services/apiClient';

export const getUserProfile = async (userId) => {
  const { data } = await apiClient.get(`/users/${userId}`);
  return data.user;
};