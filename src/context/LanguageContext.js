import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getLanguage,
  saveLanguage,
} from '../storage/tokenStorage';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {

  const [language, setLanguageState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreLanguage();
  }, []);

  const restoreLanguage = async () => {
    const storedLanguage = await getLanguage();

    if (storedLanguage) {
      setLanguageState(storedLanguage);
    }

    setLoading(false);
  };

  const setLanguage = async (language) => {
    await saveLanguage(language);
    setLanguageState(language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        loading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () =>
  useContext(LanguageContext);