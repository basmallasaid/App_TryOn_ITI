import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getWardrobeItems,deleteWardrobeItem } from '../api/wardrobe_services/wardrobeService';
import { useAuth } from './AuthContext';
import { getUserFriendlyErrorMessage } from '../utils/errorMessages';
import i18n from '../localization/i18n';

const WardrobeContext = createContext();

export const WardrobeProvider = ({ children }) => {
  const { user }              = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchItems = useCallback(async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getWardrobeItems();
      setItems(data ?? []);
    } catch (e) {
      setError(getUserFriendlyErrorMessage(e, i18n.t.bind(i18n)));
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Fetch on login
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Call this after adding an item to sync the list
  const addItem = (newItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((i) => i._id !== itemId));
  };

  const updateItem = (itemId, updates) => {
    setItems((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, ...updates } : i)),
    );
  };

  const value = useMemo(() => ({ items, loading, error, refetch: fetchItems, addItem, removeItem, updateItem }), [items, loading, error, fetchItems, addItem, removeItem, updateItem]);

  return (
    <WardrobeContext.Provider value={value}>
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = () => useContext(WardrobeContext);