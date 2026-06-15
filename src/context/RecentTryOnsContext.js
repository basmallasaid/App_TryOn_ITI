import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
      const allTryOns = data?.latestTryOn ?? [];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const filtered = allTryOns.filter((item) => {
        const raw = item.created_at || item.createdAt;
        if (!raw) return true;
        const itemDate = new Date(raw);
        return !isNaN(itemDate.getTime()) && itemDate >= thirtyDaysAgo;
      });
      setTryOns(filtered);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ tryOns, loading, refresh }), [tryOns, loading, refresh]);

  return (
    <RecentTryOnsContext.Provider value={value}>
      {children}
    </RecentTryOnsContext.Provider>
  );
};

export const useRecentTryOns = () => useContext(RecentTryOnsContext);
