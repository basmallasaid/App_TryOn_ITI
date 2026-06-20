
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getToken, clearToken, getUserId, clearUserId, clearAllUserCache } from '../storage/TokenStorage';
import * as authService from "../api/auth_services/authServices";
import { registerUnauthorizedHandler, unregisterUnauthorizedHandler } from '../api/auth_services/apiClient';
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

  const handleUnauthorized = useCallback(() => {
    setUser(null);
    setRole(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(handleUnauthorized);
    return () => unregisterUnauthorizedHandler();
  }, [handleUnauthorized]);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data);
    syncLanguage();
  }, [syncLanguage]);

  const register = useCallback(async (email, password, confirmPassword) => {
    const data = await authService.register(email, password, confirmPassword);
    await authService.sendVerification(data.token);
    await clearToken();
    syncLanguage();
    return { email, token: data.token };
  }, [syncLanguage]);

  const updateProfile = useCallback(async (token, firstName, lastName, dateOfBirth, gender) => {
    await authService.updateProfile(token, firstName, lastName, dateOfBirth, gender);
  }, []);

  const deleteAccount = useCallback(async (email) => {
    const userId = user?._id;
    await authService.deleteAccount(email);
    await clearToken();
    await clearUserId();
    if (userId) await clearAllUserCache(userId);
    setUser(null);
    setRole(null);
  }, [user?._id]);

  const loginWithGoogle = useCallback(async (idToken) => {
    const data = await authService.loginWithGoogleMobile(idToken);
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    const userId = user?._id;
    await clearToken();
    await clearUserId();
    if (userId) await clearAllUserCache(userId);
    setUser(null);
    setRole(null);
  }, [user?._id]);

  const value = useMemo(() => ({
    user, role, loading, login, register, updateProfile, deleteAccount, loginWithGoogle, logout
  }), [user, role, loading, login, register, updateProfile, deleteAccount, loginWithGoogle, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
