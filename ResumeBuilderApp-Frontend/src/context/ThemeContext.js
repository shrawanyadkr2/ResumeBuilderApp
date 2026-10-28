import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import storage from '../utils/storage';

const THEME_PREF_KEY = 'resume_genie_theme_pref';

export const lightColors = {
  isDark: false,
  primary: '#0D5BFF',
  primaryDark: '#0043CE',
  primaryLight: '#EBF2FC',
  primaryGhost: '#F0F5FF',

  // Surfaces & Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  cardBg: '#FFFFFF',

  // UI inputs and borders
  ui: {
    inputBg: '#EFF4FA',
    border: '#E2E8F0',
    divider: '#F1F5F9',
    focusBorder: '#0D5BFF',
    placeholder: '#94A3B8',
    cardBorder: '#E2E8F0',
  },

  // Text
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },

  // Status
  status: {
    error: '#EF4444',
    errorLight: '#FEF2F2',
    success: '#10B981',
    successLight: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
  },

  // Palettes for Resume Themes
  palettes: {
    navy: {
      id: 'navy',
      name: 'Professional Navy',
      primary: '#0D5BFF',
      secondary: '#3B82F6',
      accent: '#DBEAFE',
      dark: '#172554',
    },
    modernRoyal: {
      id: 'modernRoyal',
      name: 'Modern Royal',
      primary: '#2563EB',
      secondary: '#60A5FA',
      accent: '#EFF6FF',
      dark: '#1E40AF',
    },
    slate: {
      id: 'slate',
      name: 'Executive Slate',
      primary: '#1E293B',
      secondary: '#475569',
      accent: '#F1F5F9',
      dark: '#0F172A',
    },
    emerald: {
      id: 'emerald',
      name: 'Emerald Forest',
      primary: '#047857',
      secondary: '#10B981',
      accent: '#ECFDF5',
      dark: '#064E3B',
    },
    burgundy: {
      id: 'burgundy',
      name: 'Classic Crimson',
      primary: '#991B1B',
      secondary: '#EF4444',
      accent: '#FEF2F2',
      dark: '#7F1D1D',
    },
    charcoal: {
      id: 'charcoal',
      name: 'Minimalist Charcoal',
      primary: '#334155',
      secondary: '#64748B',
      accent: '#F8FAFC',
      dark: '#1E293B',
    },
  },
};

export const darkColors = {
  isDark: true,
  primary: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryLight: '#1E293B',
  primaryGhost: '#0F172A',

  // Surfaces & Backgrounds
  background: '#0B0F19',
  surface: '#111827',
  surfaceAlt: '#1F2937',
  cardBg: '#131C2E',

  // UI inputs and borders
  ui: {
    inputBg: '#1A2333',
    border: '#2A364F',
    divider: '#1F2937',
    focusBorder: '#3B82F6',
    placeholder: '#64748B',
    cardBorder: '#222F47',
  },

  // Text
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    muted: '#64748B',
    inverse: '#0B0F19',
  },

  // Status
  status: {
    error: '#F87171',
    errorLight: '#451A1A',
    success: '#34D399',
    successLight: '#064E3B',
    warning: '#FBBF24',
    warningLight: '#451A03',
  },

  // Palettes for Resume Themes
  palettes: {
    navy: {
      id: 'navy',
      name: 'Professional Navy',
      primary: '#3B82F6',
      secondary: '#60A5FA',
      accent: '#1E293B',
      dark: '#0F172A',
    },
    modernRoyal: {
      id: 'modernRoyal',
      name: 'Modern Royal',
      primary: '#60A5FA',
      secondary: '#93C5FD',
      accent: '#1E3A8A',
      dark: '#172554',
    },
    slate: {
      id: 'slate',
      name: 'Executive Slate',
      primary: '#94A3B8',
      secondary: '#CBD5E1',
      accent: '#1E293B',
      dark: '#0F172A',
    },
    emerald: {
      id: 'emerald',
      name: 'Emerald Forest',
      primary: '#34D399',
      secondary: '#6EE7B7',
      accent: '#064E3B',
      dark: '#022C22',
    },
    burgundy: {
      id: 'burgundy',
      name: 'Classic Crimson',
      primary: '#F87171',
      secondary: '#FCA5A5',
      accent: '#7F1D1D',
      dark: '#450A0A',
    },
    charcoal: {
      id: 'charcoal',
      name: 'Minimalist Charcoal',
      primary: '#CBD5E1',
      secondary: '#E2E8F0',
      accent: '#1E293B',
      dark: '#0F172A',
    },
  },
};

const ThemeContext = createContext({
  isDark: false,
  themeMode: 'system', // 'system' | 'light' | 'dark'
  colors: lightColors,
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme(); // automatically detects device OS setting
  const [themeMode, setThemeModeState] = useState('system');

  useEffect(() => {
    // Read saved user preference if overridden, else defaults to system
    storage.getItem(THEME_PREF_KEY).then((pref) => {
      if (pref && (pref === 'light' || pref === 'dark' || pref === 'system')) {
        setThemeModeState(pref);
      }
    });
  }, []);

  const setThemeMode = async (mode) => {
    setThemeModeState(mode);
    await storage.setItem(THEME_PREF_KEY, mode);
  };

  const isDark =
    themeMode === 'system'
      ? deviceColorScheme === 'dark'
      : themeMode === 'dark';

  const currentColors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    const nextMode = isDark ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        themeMode,
        colors: currentColors,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
