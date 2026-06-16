import axios from "axios";
import { BASE_URL } from "../../config/env";
import { getToken, clearToken, clearUserId } from "../../storage/TokenStorage";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
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
