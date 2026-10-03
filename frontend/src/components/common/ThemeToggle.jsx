import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = () => {
  const { resolvedTheme, themeMode, toggleTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Current theme is ${themeMode} (${resolvedTheme}). Click to switch to ${isDark ? 'light' : 'dark'} mode.`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-hover)] transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] shadow-sm cursor-pointer"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-in fade-in zoom-in duration-200" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-in fade-in zoom-in duration-200" />
      )}
    </button>
  );
};

