import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile } from '../api/user_services/userService';

const RecentTryOnsContext = createContext();

export const RecentTryOnsProvider = ({ children }) => {
  const { user } = useAuth();
  const [tryOns, setTryOns] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const data = await getUserProfile(user._id);
      setTryOns(data?.latestTryOn ?? []);
    } catch (e) {
      console.warn('[RecentTryOnsContext] Failed to fetch:', e);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <RecentTryOnsContext.Provider value={{ tryOns, loading, refresh }}>
      {children}
    </RecentTryOnsContext.Provider>
  );
};

export const useRecentTryOns = () => useContext(RecentTryOnsContext);
