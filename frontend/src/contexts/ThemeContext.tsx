import React, { createContext, useContext, useEffect } from 'react';

// Console is locked to Emerald theme
export type Theme = 'emerald';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always emerald — no switching
  const theme: Theme = 'emerald';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setTheme = (_newTheme: Theme) => {
    // No-op: theme is locked to emerald
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', 'emerald');
    localStorage.setItem('app-theme', 'emerald');
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
