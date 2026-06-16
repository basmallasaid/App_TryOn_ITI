
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, clearToken, getUserId, clearUserId, clearAllUserCache } from '../storage/TokenStorage';
import * as authService from "../api/auth_services/authServices";
import { useLanguage } from './LanguageContext';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [role, setRole]     = useState(null);
  const [loading, setLoading] = useState(true);
 const { syncLanguage } = useLanguage();
  useEffect(() => {
  Promise.all([getToken(), getUserId()]).then(([token, _id]) => {
    if (token && _id) {
      setUser({ token, _id });
    }
  }).finally(() => setLoading(false));
}, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data);
     syncLanguage(); 
  };

  const register = async (email, password, confirmPassword) => {
  const data = await authService.register(email, password, confirmPassword);
  await authService.sendVerification(data.token);
  await clearToken();
  syncLanguage(); // background sync
  return { email, token: data.token };
};
const updateProfile=async(token,firstName,lastName,dateOfBirth,gender)=>{
  await authService.updateProfile(token,firstName,lastName,dateOfBirth,gender);
}
const deleteAccount=async(token)=>{
  const userId = user?._id;
  await authService.deleteAccount(token);
  await clearToken();
  await clearUserId();
  if (userId) await clearAllUserCache(userId);
}
const loginWithGoogle = async (idToken) => {
  const data = await authService.loginWithGoogleMobile(idToken);
  setUser(data);
  return data;
};
  const logout = async () => {
    const userId = user?._id;
    await authService.logout();
    await clearToken();
    await clearUserId();
    if (userId) await clearAllUserCache(userId);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, updateProfile, deleteAccount,loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);