import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { setTheme as applyTheme, getTheme } from "../constants/theme/colors";
import { saveTheme as storeTheme, getTheme as loadTheme } from "../storage/TokenStorage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeVersion, setThemeVersion] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadTheme().then((saved) => {
      const dark = saved === "dark";
      setIsDarkMode(dark);
      applyTheme(dark ? "dark" : "light");
      setThemeVersion((v) => v + 1);
      setReady(true);
    });
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    const mode = next ? "dark" : "light";
    applyTheme(mode);
    await storeTheme(mode);
    setThemeVersion((v) => v + 1);
  }, [isDarkMode]);

  const setDarkMode = useCallback(async (dark) => {
    const mode = dark ? "dark" : "light";
    setIsDarkMode(dark);
    applyTheme(mode);
    await storeTheme(mode);
    setThemeVersion((v) => v + 1);
  }, []);

  const value = useMemo(() => ({ isDarkMode, themeVersion, toggleTheme, setDarkMode, ready }), [isDarkMode, themeVersion, toggleTheme, setDarkMode, ready]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
