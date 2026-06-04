import apiClient from "./apiClient";
import { saveToken, clearToken } from '../../storage/TokenStorage';
import {ENDPOINTS} from "../../config/endpoints";

export const login = async (email, password) => {
  const { data } = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
  await saveToken(data.token);
 return { email: data.email, token: data.token}
};

export const register = async (email, password, confirmPassword) => {
  console.log('API payload:', {email, password, confirmPassword }); // ← add
  const { data } = await apiClient.post(ENDPOINTS.SIGNUP, {
    email,
    password,
   confirmPassword,
  });
  await saveToken(data.token);
  return data; // { token, email, _id }
};

export const sendVerification = async (token) => {
  await apiClient.post(
    ENDPOINTS.SEND_VERIFICATION,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const forgotPassword = async (email) => {
  await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
};

export const verifyOtp = async (email, otp) => {
  console.log('verifyOtp payload:', { email, otp }); // ← add
  await apiClient.post(ENDPOINTS.VERIFY_FORGET_PASSWORD_OTP, { email, otp });
};

export const resetPassword = async (email, password, confirmPassword) => {
  await apiClient.put(ENDPOINTS.RESET_PASSWORD, { email, password, confirmPassword });
};

export const logout = async () => {
  await clearToken();
};