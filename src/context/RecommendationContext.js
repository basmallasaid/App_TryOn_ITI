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
import { translateToArabic } from "../utils/dynamicTranslator";
import i18n from "../localization/i18n";

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

async function translateOutfitItems(outfit) {
  if (!outfit || i18n.language !== 'ar') return outfit;
  const items = outfit.items || outfit.outfits?.[0]?.items || [];
  const translatedItems = await Promise.all(
    items.map(async (item) => {
      const nameAr = await translateToArabic(item.name);
      return { ...item, name: nameAr || item.name };
    })
  );
  if (outfit.outfits?.[0]) {
    return { ...outfit, outfits: [{ ...outfit.outfits[0], items: translatedItems }] };
  }
  return { ...outfit, items: translatedItems };
}

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
    if (!outfit) return;
  };

  const fetchHistory = useCallback(async () => {
    try {
      const result = await getAllRecommendations();
      if (result.history) {
        const translated = await Promise.all(
          result.history.map(async (entry) => {
            const translatedEntry = await translateOutfitItems(entry);
            return { ...entry, ...translatedEntry };
          })
        );
        setHistory(translated);
      }
    } catch (e) {
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
          const translatedOutfit = await translateOutfitItems(cached.outfits[0]);
          setTodaysOutfit(translatedOutfit);
          setTodaysWeather(cached.weather || cached.outfits[0]?.weather || null);
        }
        await fetchHistory();
        return;
      }

      if (currentHour >= 6) {
        setLoading(true);
        try {
          const result = await requestRecommendations();
          await setDailyOutfitDate(today, userId);
          await setDailyOutfitData(result, userId);
          if (result?.outfits?.[0]) {
            const translatedOutfit = await translateOutfitItems(result.outfits[0]);
            setTodaysOutfit(translatedOutfit);
            setTodaysWeather(result.weather || result.outfits[0]?.weather || null);
          }
        } catch (e) {
        }
      }

      await fetchHistory();
    } catch (e) {
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
