import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Appearance } from "react-native";
import { setTheme as applyTheme, getTheme } from "../constants/theme/colors";
import { saveTheme as storeTheme, getTheme as loadTheme, clearTheme } from "../storage/TokenStorage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeVersion, setThemeVersion] = useState(0);
  const [ready, setReady] = useState(false);

  const applySystemTheme = useCallback(() => {
    const systemColorScheme = Appearance.getColorScheme();
    const dark = systemColorScheme === "dark";
    setIsDarkMode(dark);
    applyTheme(dark ? "dark" : "light");
    setThemeVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    loadTheme().then((saved) => {
      let dark;
      if (saved === "dark" || saved === "light") {
        dark = saved === "dark";
      } else {
        const systemColorScheme = Appearance.getColorScheme();
        dark = systemColorScheme === "dark";
      }
      setIsDarkMode(dark);
      applyTheme(dark ? "dark" : "light");
      setThemeVersion((v) => v + 1);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      loadTheme().then((saved) => {
        if (!saved) {
          const dark = colorScheme === "dark";
          setIsDarkMode(dark);
          applyTheme(dark ? "dark" : "light");
          setThemeVersion((v) => v + 1);
        }
      });
    });
    return () => listener.remove();
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

  const resetTheme = useCallback(async () => {
    await clearTheme();
    applySystemTheme();
  }, [applySystemTheme]);

  const value = useMemo(() => ({ isDarkMode, themeVersion, toggleTheme, setDarkMode, resetTheme, ready }), [isDarkMode, themeVersion, toggleTheme, setDarkMode, resetTheme, ready]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
