import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { getAllProducts } from '../api/user_services/userService';
import { setProductsCache, getProductsCache } from '../storage/TokenStorage';
import { useAuth } from './AuthContext';
import { getUserFriendlyErrorMessage } from '../utils/errorMessages';
import i18n from '../localization/i18n';

const StoreContext = createContext();
const COOLDOWN_MS = 5 * 60 * 1000;

export const StoreProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const appStateRef = useRef(AppState.currentState);
  const lastFetchTimeRef = useRef(0);
  const mountedRef = useRef(true);

  const fetchProducts = useCallback(async ({ showLoading = true, useCache = true } = {}) => {
    if (!user?.token) return;
    try {
      if (showLoading) setLoading(true);
      setError(null);

      if (useCache) {
        const cached = await getProductsCache(userId);
        if (cached) {
          setProducts(cached);
          setLoading(false);
          if (!mountedRef.current) return;
        }
      }

      const now = Date.now();
      if (now - lastFetchTimeRef.current < COOLDOWN_MS && !showLoading) {
        setLoading(false);
        return;
      }
      lastFetchTimeRef.current = now;

      const data = await getAllProducts();
      if (!mountedRef.current) return;
      const fresh = Array.isArray(data) ? data : [];
      setProducts(fresh);
      setProductsCache(fresh, userId).catch(() => {});
    } catch (e) {
      if (!mountedRef.current) return;
      setError(getUserFriendlyErrorMessage(e, i18n.t.bind(i18n)));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [user?.token, userId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchProducts({ showLoading: true, useCache: true });
    return () => { mountedRef.current = false; };
  }, [fetchProducts]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        fetchProducts({ showLoading: false, useCache: false });
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [fetchProducts]);

  const getProductById = useCallback((id) => {
    return products.find((p) => p._id === id || p.id === id) || null;
  }, [products]);

  return (
    <StoreContext.Provider value={{
      products,
      loading,
      error,
      refetch: fetchProducts,
      getProductById,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
