import axios from "axios";
import { BASE_URL } from "../../config/env";
import { getToken, clearToken, clearUserId } from "../../storage/TokenStorage";

export const setCachedToken = () => {};
export const clearCachedToken = () => {};

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Always read token fresh from SecureStore to avoid stale-token bugs on user switch
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
    }
    return Promise.reject(error);
  },
);

export default apiClient;
