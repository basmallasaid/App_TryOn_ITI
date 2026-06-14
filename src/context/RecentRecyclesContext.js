import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile } from '../api/user_services/userService';

const RecentRecyclesContext = createContext();

export const RecentRecyclesProvider = ({ children }) => {
  const { user } = useAuth();
  const [recycles, setRecycles] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const data = await getUserProfile(user._id);
      const allRecycles = data?.latestRecycle ?? [];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const filtered = allRecycles.filter((item) => {
        const raw = item.created_at || item.createdAt;
        if (!raw) return true;
        const itemDate = new Date(raw);
        return !isNaN(itemDate.getTime()) && itemDate >= thirtyDaysAgo;
      });
      setRecycles(filtered);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <RecentRecyclesContext.Provider value={{ recycles, loading, refresh }}>
      {children}
    </RecentRecyclesContext.Provider>
  );
};

export const useRecentRecycles = () => useContext(RecentRecyclesContext);
