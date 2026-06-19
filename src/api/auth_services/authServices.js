import apiClient from "./apiClient";
import { saveToken, clearToken, clearUserId, saveUserId } from '../../storage/TokenStorage';
import {ENDPOINTS} from "../../config/endpoints";

export const loginWithGoogleMobile = async (idToken) => {
  const { data } = await apiClient.post(ENDPOINTS.LOGIN_WITH_GOOGLE_MOBILE, { idToken });
  await saveToken(data.token);
  return data;
};

export const login = async (
  email,
  password,
  client = apiClient,
  tokenSaver = saveToken
) => {
  const { data } = await client.post(ENDPOINTS.LOGIN, { email, password });
  await tokenSaver(data.token);
  await saveUserId(data._id);
  return { email: data.email, token: data.token, _id: data._id };
};

export const register = async (email, password, confirmPassword) => {
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

export const updateProfile=async(token,firstName,lastName,dateOfBirth,gender)=>{
  await apiClient.put(ENDPOINTS.UPDATE_PROFILE,{firstName,lastName,dateOfBirth,gender}, {
    headers: { Authorization: `Bearer ${token}` }
  });

}

export const deleteAccount=async(token)=>{
  await apiClient.delete(ENDPOINTS.DELETE_ACCOUNT, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export const forgotPassword = async (email) => {
  await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
};

export const verifyOtp = async (email, otp) => {
  await apiClient.post(ENDPOINTS.VERIFY_FORGET_PASSWORD_OTP, { email, otp });
};

export const resetPassword = async (email, password, confirmPassword) => {
  await apiClient.put(ENDPOINTS.RESET_PASSWORD, { email, password, confirmPassword });
};

export const logout = async () => {
  await clearToken();
  await clearUserId();
};
