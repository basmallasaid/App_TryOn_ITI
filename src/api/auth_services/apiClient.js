import axios from "axios";
import { BASE_URL } from "../../config/env";
import { getToken, clearToken, clearUserId } from "../../storage/TokenStorage";

let cachedToken = null;

export const setCachedToken = (token) => { cachedToken = token; };
export const clearCachedToken = () => { cachedToken = null; };

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
apiClient.interceptors.request.use(async (config) => {
  if (!cachedToken) {
    cachedToken = await getToken();
  }
  if (cachedToken) config.headers.Authorization = `Bearer ${cachedToken}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      cachedToken = null;
      await clearToken();
      await clearUserId();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
