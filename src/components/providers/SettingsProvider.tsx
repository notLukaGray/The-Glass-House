"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { getSettingsClient } from "@/_lib/data/settings";
import {
  SiteSettings,
  SettingsContextType,
  DEFAULT_SETTINGS,
  ThemeMode,
} from "@/types/settings";

/**
 * The context for providing site settings throughout the application.
 * It holds the settings data, loading and error states, and functions to interact with the theme.
 */
const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: true,
  error: null,
  currentTheme: "light",
  toggleTheme: () => {},
  updateSettings: () => {},
});

/**
 * A custom hook for accessing the site settings context.
 * This is the primary way components will consume the settings.
 * @example const { settings, currentTheme, toggleTheme } = useSettings();
 */
export const useSettings = () => useContext(SettingsContext);

/**
 * The provider component that fetches, manages, and distributes site settings.
 * It handles:
 * - Fetching settings from the client-side Sanity query.
 * - Managing loading and error states.
 * - Determining and applying the color theme (light/dark/system).
 * - Dynamically updating CSS variables for theming.
 * - Listening for system theme changes.
 */
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State for the settings data, loading status, and any potential errors.
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // State for the current theme ('light' or 'dark').
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // This `mounted` state is crucial to prevent hydration mismatches.
  // We avoid any client-side-only logic (like checking `window`) until the component is mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Checks the user's operating system preference for color scheme.
   * A useCallback hook is used to memoize the function.
   */
  const getSystemPreference = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "light"; // Default for SSR
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  /**
   * Determines the initial theme based on the settings from Sanity (light, dark, or system).
   */
  const initializeTheme = useCallback(
    (defaultMode: ThemeMode): "light" | "dark" => {
      switch (defaultMode) {
        case "system":
          return getSystemPreference();
        case "dark":
          return "dark";
        case "light":
        default:
          return "light";
      }
    },
    [getSystemPreference],
  );

  /**
   * Applies the current theme's colors, fonts, and spacing to the root
   * document by setting CSS custom properties (variables).
   * This is the mechanism that makes the theming dynamic.
   */
  const applyThemeToCSS = useCallback(
    (theme: "light" | "dark", themeSettings: SiteSettings["theme"]) => {
      if (typeof document === "undefined") return;

      const modeSettings =
        theme === "dark" ? themeSettings.darkMode : themeSettings.lightMode;
      const root = document.documentElement;

      // Set color variables
      Object.entries(modeSettings.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });

      // Set typography variables
      const setFontVariable = (
        variable: string,
        fontName: string,
        fallback: string,
      ) => {
        if (fontName === "CompressaPRO-GX.woff2") {
          root.style.setProperty(variable, `CompressaPRO, ${fallback}`);
        } else if (fontName !== "system") {
          root.style.setProperty(variable, fontName);
        } else {
          root.style.setProperty(variable, fallback);
        }
      };
      const systemFontFallback =
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      setFontVariable(
        "--font-heading",
        themeSettings.typography.headingFont,
        systemFontFallback,
      );
      setFontVariable(
        "--font-body",
        themeSettings.typography.bodyFont,
        systemFontFallback,
      );

      // Set spacing variables
      Object.entries(themeSettings.spacing.spacingScale).forEach(
        ([key, value]) => {
          root.style.setProperty(`--spacing-${key}`, value);
        },
      );
    },
    [],
  );

  // Effect to fetch the initial settings from Sanity.
  // It only runs once the component has mounted to ensure it's client-side.
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getSettingsClient();

        if (data) {
          setSettings(data);
          const initialTheme = initializeTheme(data.theme.defaultMode);
          setCurrentTheme(initialTheme);
          applyThemeToCSS(initialTheme, data.theme);
        } else {
          // Fallback to default settings if fetching fails or returns no data.
          setSettings(DEFAULT_SETTINGS);
          const initialTheme = initializeTheme(
            DEFAULT_SETTINGS.theme.defaultMode,
          );
          setCurrentTheme(initialTheme);
          applyThemeToCSS(initialTheme, DEFAULT_SETTINGS.theme);
        }
      } catch (err) {
        console.error("[SettingsProvider] Failed to fetch settings:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch settings"),
        );
        // Ensure defaults are applied even on catastrophic failure.
        setSettings(DEFAULT_SETTINGS);
        const initialTheme = initializeTheme(
          DEFAULT_SETTINGS.theme.defaultMode,
        );
        setCurrentTheme(initialTheme);
        applyThemeToCSS(initialTheme, DEFAULT_SETTINGS.theme);
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      fetchSettings();
    }
  }, [mounted, initializeTheme, applyThemeToCSS]);

  // Effect to listen for changes in the system's preferred color scheme.
  // This allows the theme to update automatically if the user changes their OS settings.
  useEffect(() => {
    if (!mounted || !settings || settings.theme.defaultMode !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const newTheme = getSystemPreference();
      setCurrentTheme(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted, settings, getSystemPreference]);

  /**
   * A simple function to toggle between light and dark themes.
   * This would override the "system" preference until the next page load.
   */
  const toggleTheme = useCallback(() => {
    setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  /**
   * Allows updating parts of the settings object from other components if needed.
   * For example, this could be used in a live preview editor.
   */
  const updateSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => (prev ? { ...prev, ...newSettings } : null));
  }, []);

  // Effect to re-apply the CSS variables whenever the theme changes.
  useEffect(() => {
    if (mounted && settings?.theme) {
      applyThemeToCSS(currentTheme, settings.theme);
    }
  }, [mounted, currentTheme, settings?.theme, applyThemeToCSS]);

  /**
   * Memoize the context value to prevent unnecessary re-renders of consumer components.
   * The context value only changes if one of its dependencies changes.
   */
  const contextValue = useMemo<SettingsContextType>(
    () => ({
      settings,
      isLoading,
      error,
      currentTheme,
      toggleTheme,
      updateSettings,
    }),
    [settings, isLoading, error, currentTheme, toggleTheme, updateSettings],
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};
