"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { client } from '@/_lib/handlers/sanity';
import { getRuntimeSettings } from '@/sanity/handlers/settings';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface ThemeOverlays {
  color: string;
  opacity: number;
}

interface ThemeSettings {
  defaultMode: 'light' | 'dark' | 'system';
  lightMode: {
    colors: ThemeColors;
    overlays: ThemeOverlays;
  };
  darkMode: {
    colors: ThemeColors;
    overlays: ThemeOverlays;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    customFonts?: string;
  };
  spacing: {
    baseUnit: string;
    spacingScale: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
}

interface SiteSettings {
  basicInfo: {
    title: { _type: 'localeString'; en: string };
    description: { _type: 'localeString'; en: string };
    favicon: { _type: 'reference'; _ref: string };
    logo: { _type: 'reference'; _ref: string };
  };
  theme: ThemeSettings;
  seo: {
    metaTitle: { _type: 'localeString'; en: string };
    metaDescription: { _type: 'localeString'; en: string };
    ogImage: { _type: 'reference'; _ref: string };
  };
}

interface SettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  error: Error | null;
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: true,
  error: null,
  currentTheme: 'light',
  toggleTheme: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to get system preference
  const getSystemPreference = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Function to initialize theme
  const initializeTheme = (defaultMode: 'light' | 'dark' | 'system') => {
    let theme: 'light' | 'dark';
    switch (defaultMode) {
      case 'system':
        theme = getSystemPreference();
        break;
      case 'dark':
        theme = 'dark';
        break;
      case 'light':
      default:
        theme = 'light';
    }
    return theme;
  };

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getRuntimeSettings();
        if (data) {
          setSettings(data);
          // Initialize theme immediately after settings are loaded
          const initialTheme = initializeTheme(data.theme.defaultMode || 'system');
          setCurrentTheme(initialTheme);
          
          // Apply initial theme
          const theme = initialTheme === 'dark' ? data.theme.darkMode : data.theme.lightMode;
          const root = document.documentElement;
          root.style.setProperty('--color-primary', theme.colors.primary);
          root.style.setProperty('--color-secondary', theme.colors.secondary);
          root.style.setProperty('--color-accent', theme.colors.accent);
          root.style.setProperty('--color-background', theme.colors.background);
          root.style.setProperty('--color-text', theme.colors.text);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted || !settings?.theme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme.defaultMode === 'system') {
        setCurrentTheme(getSystemPreference());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, settings?.theme?.defaultMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Update CSS variables when theme changes
  useEffect(() => {
    if (!mounted || !settings?.theme) return;

    const theme = currentTheme === 'dark' ? settings.theme.darkMode : settings.theme.lightMode;
    const root = document.documentElement;

    // Update CSS variables
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-text', theme.colors.text);
  }, [mounted, currentTheme, settings?.theme]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, error, currentTheme, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}; 