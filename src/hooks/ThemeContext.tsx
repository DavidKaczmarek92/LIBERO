// src/hooks/ThemeContext.tsx
import React, { createContext, useContext } from 'react';
import { Theme } from './useTheme';

export const ThemeContext = createContext<{ theme: Theme; isLight: boolean }>({
  theme: 'dark',
  isLight: false,
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ theme: Theme; children: React.ReactNode }> = ({ theme, children }) => (
  <ThemeContext.Provider value={{ theme, isLight: theme === 'light' }}>
    {children}
  </ThemeContext.Provider>
);
