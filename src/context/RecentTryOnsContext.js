import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useProfileContext } from './ProfileContext';

const RecentTryOnsContext = createContext();

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

export const RecentTryOnsProvider = ({ children }) => {
  const { profile, loading: profileLoading } = useProfileContext();
  const [tryOns, setTryOns] = useState([]);

  useEffect(() => {
    const allTryOns = profile?.latestTryOn ?? [];
    setTryOns(filterLast30Days(allTryOns));
  }, [profile?.latestTryOn]);

  const refresh = useCallback(async () => {
    // Data comes from ProfileContext — no independent API call needed
  }, []);

  const value = useMemo(() => ({ tryOns, loading: profileLoading, refresh }), [tryOns, profileLoading, refresh]);

  return (
    <RecentTryOnsContext.Provider value={value}>
      {children}
    </RecentTryOnsContext.Provider>
  );
};

export const useRecentTryOns = () => useContext(RecentTryOnsContext);
