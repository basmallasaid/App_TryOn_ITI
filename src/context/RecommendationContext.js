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
  getDailyOutfitDate,
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

function getEntryDate(entry) {
  return entry.created_at || entry.createdAt || null;
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
  const [fallbackOutfit, setFallbackOutfit] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const appStateRef = useRef(AppState.currentState);
  const lastFetchTimeRef = useRef(0);
  const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

  const logOutfitItems = (label, outfit) => {
    if (!outfit) return;
  };

  const translateHistory = useCallback(async (entries) => {
    return Promise.all(
      entries.map(async (entry) => {
        const translatedEntry = await translateOutfitItems(entry);
        return { ...entry, ...translatedEntry };
      })
    );
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const result = await getAllRecommendations();
      if (result.history) {
        const translated = await translateHistory(result.history);
        setHistory(translated);
      }
    } catch (e) {}
  }, [translateHistory]);

  const setFromCache = useCallback(async (userId) => {
    const cached = await getDailyOutfitData(userId);
    const cachedDate = await getDailyOutfitDate(userId);
    const today = toLocalDateKey(new Date());
    if (cached?.outfits?.[0]) {
      const translatedOutfit = await translateOutfitItems(cached.outfits[0]);
      const outfitWithComposite = {
        ...translatedOutfit,
        composite_image: translatedOutfit.composite_image || cached.composite_image || null,
      };
      if (cachedDate === today) {
        setTodaysOutfit(outfitWithComposite);
        setTodaysWeather(
          cached.weather || cached.outfits[0]?.weather || null
        );
        setFallbackOutfit(null);
      } else {
        setFallbackOutfit(outfitWithComposite);
      }
      if (cachedDate) {
        setHistory((prev) => {
          const exists = prev.some(e => toLocalDateKey(new Date(getEntryDate(e) || '')) === cachedDate);
          if (exists) return prev;
          return [...prev, {
            _id: `cache_${cachedDate}`,
            user_id: userId,
            outfits: [translatedOutfit],
            weather: cached.weather || null,
            created_at: cachedDate,
          }];
        });
      }
      return true;
    }
    return false;
  }, [translateOutfitItems]);

  const loadFromLocalState = useCallback((entry) => {
    const outfit = entry.outfits?.[0] || null;
    if (outfit) {
      setTodaysOutfit({
        ...outfit,
        composite_image: outfit.composite_image || entry.composite_image || null,
      });
      setTodaysWeather(
        entry.weather || outfit?.weather || null
      );
    }
  }, []);

  const checkAndFetchDaily = useCallback(async () => {
    try {
      // Cooldown: skip if fetched within the last 5 minutes
      const nowTime = Date.now();
      if (nowTime - lastFetchTimeRef.current < COOLDOWN_MS) {
        return;
      }
      lastFetchTimeRef.current = nowTime;

      setLoading(true);

      const today = toLocalDateKey(new Date());
      const currentHour = new Date().getHours();

      console.log(`[Recommendation] checkAndFetchDaily — today=${today}, hour=${currentHour}, userId=${userId?.slice(0,8)||'null'}`);

      // Step 1: Fetch history from server
      const result = await getAllRecommendations();
      const serverHistory = result.history || [];
      console.log(`[Recommendation] Server history entries: ${serverHistory.length}`);

      // Step 2: Translate and set history
      const translated = await translateHistory(serverHistory);
      console.log(`[Recommendation] History entries: ${translated.length}`);
      translated.forEach(e => {
        const raw = getEntryDate(e);
        const dk = raw ? toLocalDateKey(new Date(raw)) : 'no-date';
        console.log(`  [History] _id=${(e._id||'').toString().slice(0,8)} created_at=${raw} dateKey=${dk}`);
      });
      setHistory(translated);

      // Step 2.5: Merge cached entries (e.g., June 14) not present in server history
      const cachedData = await getDailyOutfitData(userId);
      const cachedDate = await getDailyOutfitDate(userId);
      if (cachedData && cachedDate) {
        setHistory(prev => {
          const existingDates = new Set(prev.map(e => {
            const r = getEntryDate(e);
            return r ? toLocalDateKey(new Date(r)) : null;
          }).filter(Boolean));
          if (existingDates.has(cachedDate)) return prev;
          console.log(`[Recommendation] Merging cached entry for ${cachedDate} into history`);
          return [...prev, {
            _id: `cache_${cachedDate}`,
            user_id: userId,
            outfits: cachedData.outfits || [],
            weather: cachedData.weather || null,
            created_at: cachedDate,
          }];
        });
      }

      // Step 3: Check if today's entry exists in server history
      const todayEntry = translated.find((entry) => {
        const rawDate = getEntryDate(entry);
        if (!rawDate) return false;
        return toLocalDateKey(new Date(rawDate)) === today;
      });

      if (todayEntry) {
        console.log(`[Recommendation] Match found in history for ${today} — POST not called, using history entry`);
        loadFromLocalState(todayEntry);
        await setDailyOutfitDate(today, userId);
        await setDailyOutfitData(todayEntry, userId);
        return;
      }

      // Step 4: Before 6 AM or no user — serve from cache only
      if (!userId || currentHour < 6) {
        console.log(`[Recommendation] Before 6AM or no user — using cache`);
        await setFromCache(userId);
        return;
      }

      // Step 5: After 6 AM — check if we already POSTed today (local cache guard)
      const lastPostDate = await getDailyOutfitDate(userId);
      if (lastPostDate === today) {
        console.log(`[Recommendation] Cache guard hit — already POSTed for ${today}, using cache`);
        await setFromCache(userId);
        return;
      }

      // Step 6: No today entry anywhere — request new recommendation
      console.log(`[Recommendation] No match found for ${today} — recommendation API called`);
      const newRecommendation = await requestRecommendations();

      // Step 7: Cache locally with today's date
      await setDailyOutfitDate(today, userId);
      await setDailyOutfitData(newRecommendation, userId);

      // Step 8: Set today's outfit from POST result
      if (newRecommendation?.outfits?.[0]) {
        const translatedOutfit = await translateOutfitItems(
          newRecommendation.outfits[0]
        );
        setTodaysOutfit(translatedOutfit);
        setTodaysWeather(
          newRecommendation.weather ||
            newRecommendation.outfits[0]?.weather ||
            null
        );

        // Step 9: Add to local history for immediate UI update
        const syntheticEntry = {
          _id: `temp_${Date.now()}`,
          user_id: userId,
          outfits: [translatedOutfit],
          weather: newRecommendation.weather || null,
          created_at: new Date().toISOString(),
        };
        setHistory((prev) => [...prev, syntheticEntry]);
      }
    } catch (e) {
      console.log(`[Recommendation] Error — falling back to cache:`, e?.message || e);
      await setFromCache(userId);
    } finally {
      setLoading(false);
    }
  }, [translateHistory, translateOutfitItems, setFromCache, loadFromLocalState, userId]);

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
    const week = weekDates.map((dayDate, idx) => {
      const dateKey = toLocalDateKey(dayDate);
      const entry = byDate[dateKey] || null;
      return {
        dayIndex: idx,
        date: dateKey,
        entry,
        hasOutfit: !!entry,
        isToday: dateKey === todayKey,
      };
    });

    const historyKeys = history.map(e => getEntryDate(e) ? toLocalDateKey(new Date(getEntryDate(e))) : 'no-date').join(', ');
    const weekKeys = week.map(d => `${d.date}${d.hasOutfit ? '*' : ''}`).join(', ');
    console.log(`[Recommendation] History dateKeys=[${historyKeys}]  Week=[${weekKeys}]  todayKey=${todayKey}  historyLen=${history.length}`);

    return week;
  }, [history, todaysOutfit, todaysWeather]);

  const value = useMemo(() => ({
    todaysOutfit, todaysWeather, fallbackOutfit, weeklyOutfits, history, loading, error,
    refresh: checkAndFetchDaily,
  }), [todaysOutfit, todaysWeather, fallbackOutfit, weeklyOutfits, history, loading, error, checkAndFetchDaily]);

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => useContext(RecommendationContext);
