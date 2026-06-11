import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWardrobeItems } from '../api/wardrobe_services/wardrobeService';
import { useAuth } from './AuthContext';

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
      setError(e.response?.data?.message || 'Failed to load wardrobe.');
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

  return (
    <WardrobeContext.Provider value={{
      items,
      loading,
      error,
      refetch: fetchItems,
      addItem,
      removeItem,
    }}>
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = () => useContext(WardrobeContext);