import { useSettings } from "@/components/providers/SettingsProvider";
import { useMemo } from "react";
import { ThemeColors } from "@/types/settings";

export const useSettingsUtils = () => {
  const { settings, currentTheme, isLoading, error } = useSettings();

  // Memoized computed values
  const currentThemeSettings = useMemo(() => {
    if (!settings?.theme) return null;
    return currentTheme === "dark"
      ? settings.theme.darkMode
      : settings.theme.lightMode;
  }, [settings?.theme, currentTheme]);

  const currentColors = useMemo(() => {
    return currentThemeSettings?.colors || null;
  }, [currentThemeSettings]);

  const currentOverlays = useMemo(() => {
    return currentThemeSettings?.overlays || null;
  }, [currentThemeSettings]);

  const typography = useMemo(() => {
    return settings?.theme?.typography || null;
  }, [settings?.theme?.typography]);

  const spacing = useMemo(() => {
    return settings?.theme?.spacing || null;
  }, [settings?.theme?.spacing]);

  const basicInfo = useMemo(() => {
    return settings?.basicInfo || null;
  }, [settings?.basicInfo]);

  const seo = useMemo(() => {
    return settings?.seo || null;
  }, [settings?.seo]);

  // Utility functions
  const getColor = (colorKey: keyof ThemeColors) => {
    return currentColors?.[colorKey] || "";
  };

  const getSpacing = (
    spacingKey: keyof NonNullable<typeof spacing>["spacingScale"],
  ) => {
    return spacing?.spacingScale[spacingKey] || "";
  };

  const getFont = (fontType: "heading" | "body") => {
    if (fontType === "heading") {
      return typography?.headingFont || "system";
    }
    return typography?.bodyFont || "system";
  };

  const getOverlayColor = () => {
    return currentOverlays?.color || "";
  };

  const getOverlayOpacity = () => {
    return currentOverlays?.opacity || 0.3;
  };

  const getTitle = () => {
    if (typeof basicInfo?.title === "string") {
      return basicInfo.title;
    }
    return basicInfo?.title
      ? (basicInfo.title as Record<string, string>)?.en || ""
      : "";
  };

  const getDescription = () => {
    if (typeof basicInfo?.description === "string") {
      return basicInfo.description;
    }
    return basicInfo?.description
      ? (basicInfo.description as Record<string, string>)?.en || ""
      : "";
  };

  const getMetaTitle = () => {
    if (typeof seo?.metaTitle === "string") {
      return seo.metaTitle;
    }
    return seo?.metaTitle
      ? (seo.metaTitle as Record<string, string>)?.en || getTitle()
      : getTitle();
  };

  const getMetaDescription = () => {
    if (typeof seo?.metaDescription === "string") {
      return seo.metaDescription;
    }
    return seo?.metaDescription
      ? (seo.metaDescription as Record<string, string>)?.en || getDescription()
      : getDescription();
  };

  return {
    // State
    isLoading,
    error,
    currentTheme,

    // Computed values
    currentThemeSettings,
    currentColors,
    currentOverlays,
    typography,
    spacing,
    basicInfo,
    seo,

    // Utility functions
    getColor,
    getSpacing,
    getFont,
    getOverlayColor,
    getOverlayOpacity,
    getTitle,
    getDescription,
    getMetaTitle,
    getMetaDescription,

    // Raw settings
    settings,
  };
};
