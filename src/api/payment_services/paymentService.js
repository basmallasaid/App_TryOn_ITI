import apiClient from "../auth_services/apiClient";
import { ENDPOINTS } from "../../config/endpoints";

export const createCheckoutSession = async (userId, plan, interval, successUrl, cancelUrl) => {
  const body = { userId, plan, interval };
  if (successUrl) body.success_url = successUrl;
  if (cancelUrl) body.cancel_url = cancelUrl;
  const { data } = await apiClient.post(ENDPOINTS.CREATE_CHECKOUT_SESSION, body);
  return data;
};

export const cancelSubscription = async (userId) => {
  const { data } = await apiClient.post(ENDPOINTS.CANCEL_SUBSCRIPTION, { userId });
  return data;
};

export const syncSubscription = async (userId) => {
  const { data } = await apiClient.post(ENDPOINTS.SYNC_SUBSCRIPTION, { userId });
  return data;
};
