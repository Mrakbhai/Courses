import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, applyTheme, getTheme, setTheme } from '@/lib/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getTheme());

  useEffect(() => {
    // Apply theme on initial load
    applyTheme();
  }, []);

  const changeTheme = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme: changeTheme }}>
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
