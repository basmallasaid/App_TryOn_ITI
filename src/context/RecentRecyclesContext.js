import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useProfileContext } from './ProfileContext';

const RecentRecyclesContext = createContext();

const filterLast30Days = (items) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return items.filter((item) => {
    const raw = item.created_at || item.createdAt;
    if (!raw) return true;
    const itemDate = new Date(raw);
    return !isNaN(itemDate.getTime()) && itemDate >= thirtyDaysAgo;
  });
};

export const RecentRecyclesProvider = ({ children }) => {
  const { profile, loading: profileLoading } = useProfileContext();
  const [recycles, setRecycles] = useState([]);

  useEffect(() => {
    const allRecycles = profile?.latestRecycle ?? [];
    setRecycles(filterLast30Days(allRecycles));
  }, [profile?.latestRecycle]);

  const refresh = useCallback(async () => {
    // Data comes from ProfileContext — no independent API call needed
  }, []);

  const value = useMemo(() => ({ recycles, loading: profileLoading, refresh }), [recycles, profileLoading, refresh]);

  return (
    <RecentRecyclesContext.Provider value={value}>
      {children}
    </RecentRecyclesContext.Provider>
  );
};

export const useRecentRecycles = () => useContext(RecentRecyclesContext);
