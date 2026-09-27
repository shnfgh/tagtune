// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { createContext, useContext, useState, useEffect } from 'react';

export type FargharTheme = 'light' | 'dark' | 'warm' | 'cool';

interface FargharThemeContextType {
  theme: FargharTheme;
  setTheme: (theme: FargharTheme) => void;
}

const VALID_THEMES: FargharTheme[] = ['light', 'dark', 'warm', 'cool'];

// Load theme from localStorage with validation
const loadTheme = (): FargharTheme => {
  try {
    const saved = localStorage.getItem('farghar_theme');
    if (saved && VALID_THEMES.includes(saved as FargharTheme)) {
      return saved as FargharTheme;
    }
  } catch (error) {
    console.error('Error loading theme from localStorage:', error);
  }
  return 'dark';
};

const FargharThemeContext = createContext<FargharThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});

export const FargharThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<FargharTheme>(loadTheme);

  useEffect(() => {
    try {
      localStorage.setItem('farghar_theme', theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
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
