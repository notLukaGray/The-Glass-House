// Core Settings Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface ThemeOverlays {
  color: string;
  opacity: number;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  customFonts?: string;
}

export interface ThemeSpacing {
  baseUnit: string;
  spacingScale: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface ThemeSettings {
  defaultMode: 'light' | 'dark' | 'system';
  lightMode: {
    colors: ThemeColors;
    overlays: ThemeOverlays;
  };
  darkMode: {
    colors: ThemeColors;
    overlays: ThemeOverlays;
  };
  typography: ThemeTypography;
  spacing: ThemeSpacing;
}

export interface BasicInfo {
  title: { _type: 'localeString'; en: string };
  description: { _type: 'localeString'; en: string };
  favicon: { _type: 'reference'; _ref: string };
  logo: { _type: 'reference'; _ref: string };
}

export interface SeoSettings {
  metaTitle: { _type: 'localeString'; en: string };
  metaDescription: { _type: 'localeString'; en: string };
  ogImage: { _type: 'reference'; _ref: string };
}

export interface SiteSettings {
  basicInfo: BasicInfo;
  theme: ThemeSettings;
  seo: SeoSettings;
}

// Sanity Response Types
export interface SanityLocaleString {
  _type: 'localeString';
  en: string;
}

export interface SanityReference {
  _type: 'reference';
  _ref: string;
}

export interface SanitySettingsResponse {
  basicInfo?: {
    title?: SanityLocaleString;
    description?: SanityLocaleString;
    favicon?: SanityReference;
    logo?: SanityReference;
  };
  theme?: {
    defaultMode?: 'light' | 'dark' | 'system';
    lightMode?: {
      colors?: ThemeColors;
      overlays?: ThemeOverlays;
    };
    darkMode?: {
      colors?: ThemeColors;
      overlays?: ThemeOverlays;
    };
    typography?: ThemeTypography;
    spacing?: ThemeSpacing;
  };
  seo?: {
    metaTitle?: SanityLocaleString;
    metaDescription?: SanityLocaleString;
    ogImage?: SanityReference;
  };
}

// Context Types
export interface SettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  error: Error | null;
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

// Default Settings
export const DEFAULT_SETTINGS: SiteSettings = {
  basicInfo: {
    title: { _type: 'localeString', en: 'Portfolio' },
    description: { _type: 'localeString', en: 'My portfolio website' },
    favicon: { _type: 'reference', _ref: '' },
    logo: { _type: 'reference', _ref: '' }
  },
  theme: {
    defaultMode: 'system',
    lightMode: {
      colors: {
        primary: '#000000',
        secondary: '#666666',
        accent: '#3B82F6',
        background: '#FFFFFF',
        text: '#000000'
      },
      overlays: {
        color: '#000000',
        opacity: 0.3
      }
    },
    darkMode: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#CCCCCC',
        accent: '#60A5FA',
        background: '#000000',
        text: '#FFFFFF'
      },
      overlays: {
        color: '#FFFFFF',
        opacity: 0.3
      }
    },
    typography: {
      headingFont: 'system',
      bodyFont: 'system'
    },
    spacing: {
      baseUnit: '4px',
      spacingScale: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
      }
    }
  },
  seo: {
    metaTitle: { _type: 'localeString', en: 'Portfolio' },
    metaDescription: { _type: 'localeString', en: 'My portfolio website' },
    ogImage: { _type: 'reference', _ref: '' }
  }
};

// Utility Types
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontFamily = 'system' | 'inter' | 'roboto' | 'open-sans';

// Settings Validation
export interface SettingsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Cache Types
export interface CachedSettings {
  data: SiteSettings;
  timestamp: number;
  version: string;
} 