// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { createContext, useContext, useState, useEffect } from 'react';

export type FargharTheme = 'light' | 'dark' | 'warm' | 'cool';

interface FargharThemeContextType {
  theme: FargharTheme;
  setTheme: (theme: FargharTheme) => void;
}

const THEME_KEY = 'farghar_theme';

const FargharThemeContext = createContext<FargharThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});

// Read theme from localStorage safely
function loadTheme(): FargharTheme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'warm' || saved === 'cool') {
      return saved;
    }
  } catch (error) {
    console.error('Error loading theme:', error);
  }
  return 'dark';
}

export const FargharThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<FargharTheme>(() => loadTheme());

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <FargharThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </FargharThemeContext.Provider>
  );
};

export const useFargharTheme = () => useContext(FargharThemeContext);
