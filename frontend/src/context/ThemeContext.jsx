import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'system';
    } catch {
      return 'system';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState('dark');

  useEffect(() => {
    const applyTheme = () => {
      let isDark = false;
      if (themeMode === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = themeMode === 'dark';
      }

      const active = isDark ? 'dark' : 'light';
      setResolvedTheme(active);

      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(active);
      root.setAttribute('data-theme', active);
      root.style.colorScheme = active;

      const metaThemeColor = document.getElementById('meta-theme-color');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDark ? '#0b0f19' : '#ffffff');
      }

      try {
        localStorage.setItem('theme', themeMode);
      } catch (e) {
        // Storage restricted or disabled
      }
    };

    applyTheme();

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  const setTheme = (mode) => {
    setThemeMode(mode);
  };

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, themeMode, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

