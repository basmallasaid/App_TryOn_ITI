import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { AppState } from "react-native";
import {
  getAllRecommendations,
  requestRecommendations,
} from "../api/recommendations_services/recommendationsServices";
import {
  getDailyOutfitDate,
  setDailyOutfitDate,
  setDailyOutfitData,
  getDailyOutfitData,
} from "../storage/TokenStorage";
import { useAuth } from "./AuthContext";

function toLocalDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function deduplicateByDate(entries) {
  const map = {};
  entries.forEach((entry) => {
    const dateKey = entry.created_at
      ? toLocalDateKey(new Date(entry.created_at))
      : null;
    if (
      dateKey &&
      (!map[dateKey] ||
        new Date(entry.created_at) > new Date(map[dateKey].created_at))
    ) {
      map[dateKey] = entry;
    }
  });
  return map;
}

function buildWeekFromSaturday() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysSinceSaturday = (dayOfWeek + 1) % 7;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() - daysSinceSaturday);
  saturday.setHours(0, 0, 0, 0);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(saturday);
    day.setDate(saturday.getDate() + i);
    week.push(day);
  }
  return week;
}

const DAY_NAMES = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id;
  const [todaysOutfit, setTodaysOutfit] = useState(null);
  const [todaysWeather, setTodaysWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const appStateRef = useRef(AppState.currentState);

  const logOutfitItems = (label, outfit) => {
    if (!outfit) { console.log(`[RecommendationContext] ${label}: outfit is null/undefined`); return; }
    console.log(`[RecommendationContext] ${label}: keys=${Object.keys(outfit).join(",")}`);
    const realOutfit = outfit.outfits?.[0] || outfit;
    if (outfit.outfits) {
      console.log(`[RecommendationContext] ${label}: has outfits[] array, outfits[0] keys=${Object.keys(realOutfit).join(",")}`);
    }
    const items = realOutfit.items || realOutfit.pieces || realOutfit.garments || [];
    console.log(`[RecommendationContext] ${label}: items.length=${items.length}, first item keys=${items[0] ? Object.keys(items[0]).join(",") : "N/A"}`);
    if (items[0]) {
      console.log(`[RecommendationContext] ${label}: first item raw=`, JSON.stringify(items[0]).slice(0, 800));
    }
  };

  const fetchHistory = useCallback(async () => {
    try {
      const result = await getAllRecommendations();
      console.log(`[RecommendationContext] fetchHistory: history.length=${result.history?.length}`);
      if (result.history?.[0]) logOutfitItems("fetchHistory[0]", result.history[0]);
      setHistory(result.history || []);
    } catch (e) {
      console.error("Failed to load recommendation history", e);
    }
  }, []);

  const checkAndFetchDaily = useCallback(async () => {
    try {
      const today = toLocalDateKey(new Date());
      const currentHour = new Date().getHours();
      const lastDate = await getDailyOutfitDate(userId);

      if (lastDate === today) {
        const cached = await getDailyOutfitData(userId);
        if (cached?.outfits?.[0]) {
          logOutfitItems("cached on foreground", cached.outfits[0]);
          setTodaysOutfit(cached.outfits[0]);
          setTodaysWeather(cached.weather || cached.outfits[0]?.weather || null);
        }
        await fetchHistory();
        return;
      }

      if (currentHour >= 6) {
        setLoading(true);
        try {
          const result = await requestRecommendations();
          console.log(`[RecommendationContext] requestRecommendations: outfits.length=${result.outfits?.length}, weather=`, result.weather ? "present" : "null");
          if (result.outfits?.[0]) logOutfitItems("fresh API", result.outfits[0]);
          await setDailyOutfitDate(today, userId);
          await setDailyOutfitData(result, userId);
          if (result?.outfits?.[0]) {
            setTodaysOutfit(result.outfits[0]);
            setTodaysWeather(result.weather || result.outfits[0]?.weather || null);
          }
        } catch (e) {
          console.error("Auto daily fetch failed", e);
        }
      }

      await fetchHistory();
    } catch (e) {
      console.error("checkAndFetchDaily error", e);
    } finally {
      setLoading(false);
    }
  }, [fetchHistory, userId]);

  useEffect(() => {
    checkAndFetchDaily();
  }, [checkAndFetchDaily]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        checkAndFetchDaily();
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [checkAndFetchDaily]);

  const weeklyOutfits = useMemo(() => {
    const todayKey = toLocalDateKey(new Date());
    const byDate = deduplicateByDate(history);

    if (todaysOutfit && !byDate[todayKey]) {
      byDate[todayKey] = {
        _id: "today",
        outfits: [todaysOutfit],
        weather: todaysWeather || todaysOutfit?.weather || null,
        created_at: new Date().toISOString(),
      };
    }

    const weekDates = buildWeekFromSaturday();
    return weekDates.map((dayDate, idx) => {
      const dateKey = toLocalDateKey(dayDate);
      const entry = byDate[dateKey] || null;
      return {
        dayName: DAY_NAMES[idx],
        dayIndex: idx,
        date: dateKey,
        entry,
        hasOutfit: !!entry,
        isToday: dateKey === todayKey,
      };
    });
  }, [history, todaysOutfit, todaysWeather]);

  return (
    <RecommendationContext.Provider
      value={{
        todaysOutfit,
        todaysWeather,
        weeklyOutfits,
        history,
        loading,
        error,
        refresh: checkAndFetchDaily,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => useContext(RecommendationContext);
