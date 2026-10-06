import React, { createContext, useContext, useEffect } from 'react';

// Console is locked to Emerald theme
export type Theme = 'light' | 'sapphire' | 'velvet' | 'dark' | 'emerald';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always blue — no switching
  const theme: Theme = 'light';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setTheme = (_newTheme: Theme) => {
    // No-op: theme is locked to blue
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', 'light');
    localStorage.setItem('app-theme', 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
