import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { light, dark } from './colors';
import { t } from './translations';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDark, setIsDark]   = useState(false);
  const [lang,   setLang]     = useState('ar');

  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem('tyar-theme');
      const storedLang  = await AsyncStorage.getItem('tyar-lang');
      if (storedTheme === 'dark') setIsDark(true);
      if (storedLang)             setLang(storedLang);
    })();
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('tyar-theme', next ? 'dark' : 'light');
  };

  const toggleLang = async () => {
    const next = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    await AsyncStorage.setItem('tyar-lang', next);
  };

  const colors = isDark ? dark : light;
  const tr     = t[lang];
  const isRTL  = lang === 'ar';

  return (
    <AppContext.Provider value={{ isDark, toggleTheme, lang, toggleLang, colors, tr, isRTL }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
