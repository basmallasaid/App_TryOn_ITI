import apiClient from "../auth_services/apiClient";
import { ENDPOINTS } from "../../config/endpoints";

export const registerPushToken = async (token) => {
  const { data } = await apiClient.post(ENDPOINTS.REGISTER_PUSH_TOKEN, { token });
  return data;
};

export const getNotifications = async () => {
  const { data } = await apiClient.get(ENDPOINTS.GET_NOTIFICATIONS);
  return data;
};

export const markAsRead = async (notificationId) => {
  const endpoint = ENDPOINTS.MARK_NOTIFICATION_READ.replace("${id}", notificationId);
  const { data } = await apiClient.patch(endpoint);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await apiClient.patch(ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ);
  return data;
};
