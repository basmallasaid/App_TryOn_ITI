import axios from "axios";
import { BASE_URL } from "../../config/env";
import { getToken, clearToken, clearUserId } from "../../storage/TokenStorage";

let _onUnauthorized = null;

export const registerUnauthorizedHandler = (handler) => {
  _onUnauthorized = handler;
};

export const unregisterUnauthorizedHandler = () => {
  _onUnauthorized = null;
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await clearToken();
      await clearUserId();
      if (_onUnauthorized) _onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
