import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AppState } from 'react-native';
import { getWardrobeItems, deleteWardrobeItem } from '../api/wardrobe_services/wardrobeService';
import { setWardrobeCache, getWardrobeCache } from '../storage/TokenStorage';
import { useAuth } from './AuthContext';
import { getUserFriendlyErrorMessage } from '../utils/errorMessages';
import i18n from '../localization/i18n';

const WardrobeContext = createContext();
const COOLDOWN_MS = 5 * 60 * 1000;

export const WardrobeProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const appStateRef = useRef(AppState.currentState);
  const lastFetchTimeRef = useRef(0);
  const mountedRef = useRef(true);

  const fetchItems = useCallback(async ({ showLoading = true, useCache = true } = {}) => {
    if (!user?.token) return;
    try {
      if (showLoading) setLoading(true);
      setError(null);

      if (useCache) {
        const cached = await getWardrobeCache(userId);
        if (cached) {
          setItems(cached);
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

      const data = await getWardrobeItems();
      if (!mountedRef.current) return;
      const fresh = data ?? [];
      setItems(fresh);
      setWardrobeCache(fresh, userId).catch(() => {});
    } catch (e) {
      if (!mountedRef.current) return;
      setError(getUserFriendlyErrorMessage(e, i18n.t.bind(i18n)));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [user?.token, userId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchItems({ showLoading: true, useCache: true });
    return () => { mountedRef.current = false; };
  }, [fetchItems]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        fetchItems({ showLoading: false, useCache: false });
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [fetchItems]);

  const addItem = useCallback((newItem) => {
    setItems((prev) => {
      const next = [...prev, newItem];
      setWardrobeCache(next, userId).catch(() => {});
      return next;
    });
  }, [userId]);

  const removeItem = useCallback(async (itemId) => {
    let removed = null;
    setItems((prev) => {
      const idx = prev.find((i) => i._id === itemId);
      removed = idx;
      const next = prev.filter((i) => i._id !== itemId);
      setWardrobeCache(next, userId).catch(() => {});
      return next;
    });
    try {
      await deleteWardrobeItem(itemId);
    } catch (e) {
      if (removed) {
        setItems((prev) => {
          const next = [...prev, removed];
          setWardrobeCache(next, userId).catch(() => {});
          return next;
        });
      }
      throw e;
    }
  }, [userId]);

  const updateItem = useCallback((itemId, updates) => {
    setItems((prev) => {
      const next = prev.map((i) => (i._id === itemId ? { ...i, ...updates } : i));
      setWardrobeCache(next, userId).catch(() => {});
      return next;
    });
  }, [userId]);

  const value = useMemo(() => ({
    items,
    loading,
    error,
    refetch: fetchItems,
    addItem,
    removeItem,
    updateItem,
  }), [items, loading, error, fetchItems, addItem, removeItem, updateItem]);

  return (
    <WardrobeContext.Provider value={value}>
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = () => useContext(WardrobeContext);
