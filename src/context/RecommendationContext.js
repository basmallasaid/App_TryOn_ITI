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
  setDailyOutfitDate,
  setDailyOutfitData,
  getDailyOutfitData,
} from "../storage/TokenStorage";
import { useAuth } from "./AuthContext";
import { translateToArabic } from "../utils/dynamicTranslator";
import i18n from "../localization/i18n";

const LOG_TAG = "[Recommendation]";
const COOLDOWN_MS = 5 * 60 * 1000;

const DEFAULT_WEATHER = {
  temperature: 0,
  feelsLike: 0,
  condition: "clear",
  humidity: 0,
  windSpeed: 0,
  isDay: true,
  weatherCode: 0,
};

function normalizeWeather(weather) {
  if (!weather) return { ...DEFAULT_WEATHER };
  return {
    temperature: weather.temperature ?? 0,
    feelsLike: weather.feelsLike ?? 0,
    condition: weather.condition ?? "clear",
    humidity: weather.humidity ?? 0,
    windSpeed: weather.windSpeed ?? 0,
    isDay: weather.isDay ?? true,
    weatherCode: weather.weatherCode ?? 0,
  };
}

function toLocalDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getEntryDate(entry) {
  return entry?.created_at || entry?.createdAt || null;
}

function deduplicateByDate(entries) {
  const map = {};
  entries.forEach((entry) => {
    const rawDate = getEntryDate(entry);
    const dateKey = rawDate ? toLocalDateKey(new Date(rawDate)) : null;
    if (
      dateKey &&
      (!map[dateKey] ||
        new Date(rawDate) > new Date(getEntryDate(map[dateKey])))
    ) {
      map[dateKey] = entry;
    }
  });
  return map;
}

function findTodayInHistory(history) {
  const todayKey = toLocalDateKey(new Date());
  const byDate = deduplicateByDate(history);
  return byDate[todayKey] || null;
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
  if (!outfit || i18n.language !== "ar") return outfit;
  const items = outfit.items || outfit.outfits?.[0]?.items || [];
  const translatedItems = await Promise.all(
    items.map(async (item) => {
      const nameAr = await translateToArabic(item.name);
      return { ...item, name: nameAr || item.name };
    })
  );
  if (outfit.outfits?.[0]) {
    return {
      ...outfit,
      outfits: [{ ...outfit.outfits[0], items: translatedItems }],
    };
  }
  return { ...outfit, items: translatedItems };
}

function mergeCompositeImage(entry, outfit) {
  if (!outfit) return outfit;
  return {
    ...outfit,
    composite_image:
      outfit.composite_image ||
      outfit.compositeImage ||
      entry?.composite_image ||
      entry?.compositeImage ||
      null,
    created_at:
      outfit.created_at || entry?.created_at || entry?.createdAt || null,
  };
}

async function translateHistory(entries) {
  return Promise.all(
    entries.map(async (entry) => {
      const translated = await translateOutfitItems(entry);
      return { ...entry, ...translated };
    })
  );
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
  const lastFetchTimeRef = useRef(0);

  const checkAndFetchDaily = useCallback(async () => {
    try {
      const now = Date.now();
      if (now - lastFetchTimeRef.current < COOLDOWN_MS) {
        console.log(LOG_TAG, "Cooldown active, skipping fetch");
        return;
      }
      lastFetchTimeRef.current = now;

      const todayKey = toLocalDateKey(new Date());
      const currentHour = new Date().getHours();
      console.log(
        LOG_TAG,
        `checkAndFetchDaily — today=${todayKey}, hour=${currentHour}, userId=${userId}`
      );

      if (!userId) {
        console.log(LOG_TAG, "No userId, aborting");
        setLoading(false);
        return;
      }

      // ── Step 1: Fetch history from server ──
      let serverHistory = [];
      try {
        const result = await getAllRecommendations();
        serverHistory = result.history || [];
        console.log(
          LOG_TAG,
          `Server history entries: ${serverHistory.length}`
        );
        serverHistory.forEach((e) => {
          const rawDate = getEntryDate(e);
          const dk = rawDate ? toLocalDateKey(new Date(rawDate)) : "null";
          console.log(
            LOG_TAG,
            `  [History] _id=${e._id} created_at=${rawDate} dateKey=${dk}`
          );
        });
      } catch (e) {
        console.log(LOG_TAG, "GET history failed:", e.message);
      }

      // ── Step 2: Check if today exists in server history ──
      const todayEntry = findTodayInHistory(serverHistory);

      if (todayEntry) {
        console.log(
          LOG_TAG,
          `Match found in history for ${todayKey} — POST not called, using history entry`
        );
        const outfit = todayEntry.outfits?.[0] || null;
        if (outfit) {
          const merged = mergeCompositeImage(todayEntry, outfit);
          const translated = await translateOutfitItems(merged);
          setTodaysOutfit(translated);
          setTodaysWeather(
            normalizeWeather(todayEntry.weather || merged.weather)
          );
          await setDailyOutfitDate(todayKey, userId);
          await setDailyOutfitData(todayEntry, userId);
        }
        const translatedHistory = await translateHistory(serverHistory);
        setHistory(translatedHistory);
        console.log(
          LOG_TAG,
          `History set: ${translatedHistory.length} entries`
        );
        return;
      }

      console.log(LOG_TAG, `No match for ${todayKey} in history`);

      // ── Step 3: No today entry — check hour ──
      if (currentHour < 6) {
        console.log(LOG_TAG, "Before 6AM — no outfit for today yet, leaving empty");
        const translatedHistory = await translateHistory(serverHistory);
        setHistory(translatedHistory);
        return;
      }

      // ── Step 4: After 6AM — POST new recommendation ──
      console.log(LOG_TAG, "POST /recommendations — requesting new outfit");
      setLoading(true);
      try {
        const result = await requestRecommendations();
        console.log(
          LOG_TAG,
          "POST success:",
          JSON.stringify(result).slice(0, 200)
        );
        await setDailyOutfitDate(todayKey, userId);
        await setDailyOutfitData(result, userId);

        if (result?.outfits?.[0]) {
          const merged = mergeCompositeImage(result, result.outfits[0]);
          const translated = await translateOutfitItems(merged);
          setTodaysOutfit(translated);
          setTodaysWeather(normalizeWeather(result.weather || merged.weather));
        }

        // Append synthetic entry to history for immediate UI update
        const syntheticEntry = {
          _id: `today_${todayKey}`,
          outfits: result.outfits || [],
          weather: normalizeWeather(result.weather),
          created_at: new Date().toISOString(),
        };
        const updatedHistory = [...serverHistory, syntheticEntry];
        const translatedHistory = await translateHistory(updatedHistory);
        setHistory(translatedHistory);
        console.log(
          LOG_TAG,
          `POST complete, history now: ${translatedHistory.length} entries`
        );
      } catch (e) {
        console.log(LOG_TAG, "POST failed:", e.message);
        // Fallback to local cache
        const cached = await getDailyOutfitData(userId);
        if (cached?.outfits?.[0]) {
          const merged = mergeCompositeImage(cached, cached.outfits[0]);
          const translated = await translateOutfitItems(merged);
          setTodaysOutfit(translated);
          setTodaysWeather(normalizeWeather(cached.weather || merged.weather));
        }
        const translatedHistory = await translateHistory(serverHistory);
        setHistory(translatedHistory);
        setError(e.message);
      }
    } catch (e) {
      console.log(LOG_TAG, "checkAndFetchDaily error:", e.message);
      setError(e.message);
      // Fallback to local cache
      try {
        const cached = await getDailyOutfitData(userId);
        if (cached?.outfits?.[0]) {
          const merged = mergeCompositeImage(cached, cached.outfits[0]);
          const translated = await translateOutfitItems(merged);
          setTodaysOutfit(translated);
          setTodaysWeather(normalizeWeather(cached.weather || merged.weather));
        }
      } catch (cacheErr) {
        console.log(LOG_TAG, "Cache fallback failed:", cacheErr.message);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

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

  const value = useMemo(() => ({
    todaysOutfit,
    todaysWeather,
    weeklyOutfits,
    history,
    loading,
    error,
    refresh: checkAndFetchDaily,
  }), [todaysOutfit, todaysWeather, weeklyOutfits, history, loading, error, checkAndFetchDaily]);

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => useContext(RecommendationContext);
