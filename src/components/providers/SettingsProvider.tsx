"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { getSettingsClient } from '@/_lib/data/settings';
import { 
  SiteSettings, 
  SettingsContextType, 
  DEFAULT_SETTINGS,
  ThemeMode 
} from '@/types/settings';

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: true,
  error: null,
  currentTheme: 'light',
  toggleTheme: () => {},
  updateSettings: () => {},
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
  const getSystemPreference = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Function to initialize theme
  const initializeTheme = useCallback((defaultMode: ThemeMode): 'light' | 'dark' => {
    switch (defaultMode) {
      case 'system':
        return getSystemPreference();
      case 'dark':
        return 'dark';
      case 'light':
      default:
        return 'light';
    }
  }, [getSystemPreference]);

  // Function to apply theme to CSS variables
  const applyThemeToCSS = useCallback((theme: 'light' | 'dark', themeSettings: SiteSettings['theme']) => {
    if (typeof document === 'undefined') return;
    
    const modeSettings = theme === 'dark' ? themeSettings.darkMode : themeSettings.lightMode;
    const root = document.documentElement;

    // Update CSS variables
    root.style.setProperty('--color-primary', modeSettings.colors.primary);
    root.style.setProperty('--color-secondary', modeSettings.colors.secondary);
    root.style.setProperty('--color-accent', modeSettings.colors.accent);
    root.style.setProperty('--color-background', modeSettings.colors.background);
    root.style.setProperty('--color-text', modeSettings.colors.text);
    
    // Apply typography
    if (themeSettings.typography.headingFont === 'CompressaPRO-GX.woff2') {
      root.style.setProperty('--font-heading', 'CompressaPRO, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
    } else if (themeSettings.typography.headingFont !== 'system') {
      root.style.setProperty('--font-heading', themeSettings.typography.headingFont);
    } else {
      root.style.setProperty('--font-heading', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
    }
    
    if (themeSettings.typography.bodyFont === 'CompressaPRO-GX.woff2') {
      root.style.setProperty('--font-body', 'CompressaPRO, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
    } else if (themeSettings.typography.bodyFont !== 'system') {
      root.style.setProperty('--font-body', themeSettings.typography.bodyFont);
    } else {
      root.style.setProperty('--font-body', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
    }
    
    // Apply spacing scale
    root.style.setProperty('--spacing-xs', themeSettings.spacing.spacingScale.xs);
    root.style.setProperty('--spacing-sm', themeSettings.spacing.spacingScale.sm);
    root.style.setProperty('--spacing-md', themeSettings.spacing.spacingScale.md);
    root.style.setProperty('--spacing-lg', themeSettings.spacing.spacingScale.lg);
    root.style.setProperty('--spacing-xl', themeSettings.spacing.spacingScale.xl);
  }, []);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('[SettingsProvider] Fetching settings...');
        
        // Wait for component to be mounted before fetching
        if (!mounted) {
          console.log('[SettingsProvider] Component not mounted yet, skipping fetch');
          return;
        }
        
        const data = await getSettingsClient();
        
        if (data) {
          console.log('[SettingsProvider] Settings loaded successfully');
          setSettings(data);
          
          // Initialize theme immediately after settings are loaded
          const initialTheme = initializeTheme(data.theme.defaultMode);
          setCurrentTheme(initialTheme);
          
          // Apply initial theme
          applyThemeToCSS(initialTheme, data.theme);
        } else {
          console.warn('[SettingsProvider] No settings data received, using defaults');
          setSettings(DEFAULT_SETTINGS);
          const initialTheme = initializeTheme(DEFAULT_SETTINGS.theme.defaultMode);
          setCurrentTheme(initialTheme);
          applyThemeToCSS(initialTheme, DEFAULT_SETTINGS.theme);
        }
      } catch (err) {
        console.error('[SettingsProvider] Failed to fetch settings:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
        
        // Fallback to default settings
        console.log('[SettingsProvider] Using default settings as fallback');
        setSettings(DEFAULT_SETTINGS);
        const initialTheme = initializeTheme(DEFAULT_SETTINGS.theme.defaultMode);
        setCurrentTheme(initialTheme);
        applyThemeToCSS(initialTheme, DEFAULT_SETTINGS.theme);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if component is mounted
    if (mounted) {
      fetchSettings();
    }
  }, [mounted, initializeTheme, applyThemeToCSS]);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted || !settings?.theme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme.defaultMode === 'system') {
        const newTheme = getSystemPreference();
        setCurrentTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, settings?.theme?.defaultMode, settings?.theme, getSystemPreference]);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Update settings function
  const updateSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    setSettings(prev => prev ? { ...prev, ...newSettings } : null);
  }, []);

  // Update CSS variables when theme changes
  useEffect(() => {
    if (!mounted || !settings?.theme) return;

    applyThemeToCSS(currentTheme, settings.theme);
  }, [mounted, currentTheme, settings?.theme, applyThemeToCSS]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<SettingsContextType>(() => ({
    settings,
    isLoading,
    error,
    currentTheme,
    toggleTheme,
    updateSettings,
  }), [settings, isLoading, error, currentTheme, toggleTheme, updateSettings]);

  // Development helpers
  if (process.env.NODE_ENV === 'development' && mounted) {
    // Expose debug info to window for debugging
    ((window as unknown) as Record<string, unknown>).__SETTINGS_DEBUG__ = {
      currentSettings: settings,
      currentTheme,
    };
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}; 