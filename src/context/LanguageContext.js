// src/context/LanguageContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import { getLanguage, saveLanguage } from "../storage/TokenStorage";
import { syncLanguageToProfile } from "../api/language_service/languageService";
import i18n from "../localization/i18n";
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved language on app start
   useEffect(() => {
    getLanguage()
      .then((lang) => {
        const resolved = lang ?? "en";
        setLanguage(resolved);
        i18n.changeLanguage(resolved);
        I18nManager.forceRTL(resolved === "ar");
      })
      .finally(() => setLoading(false));
  }, []);

  // Called from SelectLanguageScreen (no token yet)
  const selectLanguage = useCallback(async (lang) => {
    await saveLanguage(lang);
    setLanguage(lang);
    i18n.changeLanguage(lang);
    I18nManager.forceRTL(lang === "ar");
    await Updates.reloadAsync();
  }, []);

  // Called after login/register — syncs to backend in background
  const syncLanguage = useCallback(() => {
    if (language) syncLanguageToProfile(language); // fire and forget
  }, [language]);

  const isRTL = language === "ar";

  const value = useMemo(() => ({ language, loading, isRTL, selectLanguage, syncLanguage }), [language, loading, isRTL, selectLanguage, syncLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
