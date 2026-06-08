// src/context/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
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
      })
      .finally(() => setLoading(false));
  }, []);

  // Called from SelectLanguageScreen (no token yet)
  const selectLanguage = async (lang) => {
    await saveLanguage(lang);
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  // Called after login/register — syncs to backend in background
  const syncLanguage = () => {
    if (language) syncLanguageToProfile(language); // fire and forget
  };

  return (
    <LanguageContext.Provider
      value={{ language, loading, selectLanguage, syncLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
