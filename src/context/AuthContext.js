
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, clearToken } from '../storage/TokenStorage';
import * as authService from "../api/auth_services/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [role, setRole]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken()
      .then(token => { if (token) setUser({ token }); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data);
  };

  const register = async (email, password, confirmPassword) => {
  const data = await authService.register(email, password, confirmPassword);
  await authService.sendVerification(data.token);
  await clearToken();
  return { email, token: data.token };
};
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);