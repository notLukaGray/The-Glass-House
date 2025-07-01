"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { SiteSettings, ThemeMode } from "@/types/settings";

const DEFAULT_SETTINGS: SiteSettings = {
  basicInfo: {
    title: "Portfolio",
    description: "My portfolio website",
    favicon: { _type: "reference", _ref: "" },
    logo: { _type: "reference", _ref: "" },
  },
  seo: {
    metaTitle: { _type: "localeString", en: "Portfolio" },
    metaDescription: { _type: "localeString", en: "My portfolio website" },
    ogImage: { _type: "reference", _ref: "" },
  },
  theme: {
    defaultMode: "system",
    lightMode: {
      colors: {
        primary: "#000000",
        secondary: "#666666",
        accent: "#007acc",
        background: "#ffffff",
        text: "#000000",
      },
      overlays: {
        color: "#000000",
        opacity: 0.5,
      },
    },
    darkMode: {
      colors: {
        primary: "#ffffff",
        secondary: "#a3a3a3",
        accent: "#3b82f6",
        background: "#000000",
        text: "#ffffff",
      },
      overlays: {
        color: "#ffffff",
        opacity: 0.5,
      },
    },
    typography: {
      headingFont: "system",
      bodyFont: "system",
    },
    spacing: {
      baseUnit: "1rem",
      spacingScale: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      },
    },
  },
};

const SettingsContext = createContext<{
  settings: SiteSettings | null;
  isLoading: boolean;
  error: Error | null;
  currentTheme: "light" | "dark";
  toggleTheme: () => void;
}>({
  settings: null,
  isLoading: true,
  error: null,
  currentTheme: "light",
  toggleTheme: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getSystemPreference = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

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

  const applyThemeToCSS = useCallback(
    (theme: "light" | "dark", themeSettings: SiteSettings["theme"]) => {
      if (typeof document === "undefined") return;

      const modeSettings =
        theme === "dark" ? themeSettings.darkMode : themeSettings.lightMode;
      const root = document.documentElement;

      Object.entries(modeSettings.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });

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

      if (themeSettings.typography) {
        setFontVariable(
          "--font-heading",
          themeSettings.typography.headingFont || "system",
          systemFontFallback,
        );
        setFontVariable(
          "--font-body",
          themeSettings.typography.bodyFont || "system",
          systemFontFallback,
        );
      }

      if (themeSettings.spacing?.spacingScale) {
        Object.entries(themeSettings.spacing.spacingScale).forEach(
          ([key, value]) => {
            root.style.setProperty(`--spacing-${key}`, value);
          },
        );
      }
    },
    [],
  );

  const deepMergeSettings = useCallback(
    (a: SiteSettings, b: Partial<SiteSettings>): SiteSettings => {
      return {
        ...a,
        ...b,
        theme: {
          ...a.theme,
          ...b.theme,
          lightMode: {
            ...a.theme.lightMode,
            ...(b.theme?.lightMode || {}),
            colors: {
              ...a.theme.lightMode.colors,
              ...(b.theme?.lightMode?.colors || {}),
            },
            overlays: {
              ...a.theme.lightMode.overlays,
              ...(b.theme?.lightMode?.overlays || {}),
            },
          },
          darkMode: {
            ...a.theme.darkMode,
            ...(b.theme?.darkMode || {}),
            colors: {
              ...a.theme.darkMode.colors,
              ...(b.theme?.darkMode?.colors || {}),
            },
            overlays: {
              ...a.theme.darkMode.overlays,
              ...(b.theme?.darkMode?.overlays || {}),
            },
          },
          typography: {
            ...a.theme.typography,
            ...(b.theme?.typography || {}),
          },
          spacing: {
            ...a.theme.spacing,
            ...(b.theme?.spacing || {}),
            spacingScale: {
              ...a.theme.spacing.spacingScale,
              ...(b.theme?.spacing?.spacingScale || {}),
            },
          },
        },
        seo: {
          ...a.seo,
          ...(b.seo || {}),
        },
        basicInfo: {
          ...a.basicInfo,
          ...(b.basicInfo || {}),
        },
      };
    },
    [],
  );

  useEffect(() => {
    if (!mounted) return;
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/settings`);
        if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`);
        const fetchedSettings = await res.json();
        const merged = deepMergeSettings(DEFAULT_SETTINGS, fetchedSettings);
        setSettings(merged);
        const initialTheme = initializeTheme(merged.theme.defaultMode);
        setCurrentTheme(initialTheme);
        applyThemeToCSS(initialTheme, merged.theme);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch settings"),
        );
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
    fetchSettings();
  }, [mounted, initializeTheme, deepMergeSettings, applyThemeToCSS]);

  useEffect(() => {
    const handleChange = () => {
      if (settings?.theme.defaultMode === "system") {
        const newTheme = getSystemPreference();
        setCurrentTheme(newTheme);
        applyThemeToCSS(newTheme, settings.theme);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings, getSystemPreference, applyThemeToCSS]);

  useEffect(() => {
    if (settings && mounted) {
      applyThemeToCSS(currentTheme, settings.theme);
    }
  }, [currentTheme, settings, mounted, applyThemeToCSS]);

  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
  }, [currentTheme]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        currentTheme,
        toggleTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
