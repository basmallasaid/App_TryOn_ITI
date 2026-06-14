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
      setRecycles(data?.latestRecycle ?? []);
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
