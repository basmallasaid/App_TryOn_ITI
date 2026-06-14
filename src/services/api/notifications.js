import apiClient from "../../api/auth_services/apiClient";
import { ENDPOINTS } from "../../config/endpoints";

export const registerPushToken = async (token) => {
  const { data } = await apiClient.post(ENDPOINTS.REGISTER_PUSH_TOKEN, { token });
  return data;
};

export const sendTestNotification = async () => {
  const { data } = await apiClient.post(ENDPOINTS.SEND_TEST_NOTIFICATION);
  return data;
};

export const sendByEmail = async (email) => {
  const { data } = await apiClient.post(ENDPOINTS.SEND_BY_EMAIL, { email });
  return data;
};

export const tryOnReadyNotification = async (payload) => {
  const { data } = await apiClient.post(ENDPOINTS.TRYON_READY_NOTIFICATION, payload);
  return data;
};

export const sendToUser = async (payload) => {
  const { data } = await apiClient.post(ENDPOINTS.SEND_TO_USER, payload);
  return data;
};

export const broadcastNotification = async (payload) => {
  const { data } = await apiClient.post(ENDPOINTS.BROADCAST_NOTIFICATION, payload);
  return data;
};

export const getNotifications = async () => {
  const { data } = await apiClient.get(ENDPOINTS.GET_NOTIFICATIONS);
  return data;
};

export const clearAllNotifications = async () => {
  const { data } = await apiClient.delete(ENDPOINTS.CLEAR_ALL_NOTIFICATIONS);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await apiClient.patch(ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ);
  return data;
};

export const markAsRead = async (notificationId) => {
  const endpoint = ENDPOINTS.MARK_NOTIFICATION_READ.replace("${id}", notificationId);
  const { data } = await apiClient.patch(endpoint);
  return data;
};

export const deleteNotification = async (notificationId) => {
  const endpoint = ENDPOINTS.DELETE_NOTIFICATION.replace("${id}", notificationId);
  const { data } = await apiClient.delete(endpoint);
  return data;
};
