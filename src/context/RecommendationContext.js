import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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

const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
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

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split("T")[0];
      const lastDate = await getDailyOutfitDate();

      if (lastDate === today) {
        const cached = await getDailyOutfitData();
        if (cached?.outfits?.[0]) {
          logOutfitItems("cached outfit", cached.outfits[0]);
          setTodaysOutfit(cached.outfits[0]);
          setTodaysWeather(cached.weather || cached.outfits[0]?.weather || null);
        }
      } else {
        setTodaysOutfit(null);
        setTodaysWeather(null);
      }

      await fetchHistory();
    } catch (e) {
      setError(e.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }, [fetchHistory]);

  const checkAndFetchDaily = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const currentHour = new Date().getHours();
      const lastDate = await getDailyOutfitDate();

      if (lastDate === today) {
        const cached = await getDailyOutfitData();
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
          await setDailyOutfitDate(today);
          await setDailyOutfitData(result);
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
  }, [fetchHistory]);

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

  return (
    <RecommendationContext.Provider
      value={{
        todaysOutfit,
        todaysWeather,
        history,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => useContext(RecommendationContext);
