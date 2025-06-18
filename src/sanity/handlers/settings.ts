import { createClient } from 'next-sanity';

const getSanityEnv = (key: string) => {
  if (typeof window !== 'undefined') {
    return process.env[`NEXT_PUBLIC_${key}`] || '';
  }
  return process.env[key] || '';
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || '',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2023-05-03',
  useCdn: true,
});

// Cache for runtime settings with timestamp
interface CachedSettings {
  data: any;
  timestamp: number;
}

let cachedRuntimeSettings: CachedSettings | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Build-time settings - these should be fetched during build
export async function getBuildTimeSettings() {
  const query = `*[_type == "siteSettings"][0] {
    "basicInfo": {
      "title": basicInfo.title,
      "description": basicInfo.description,
      "favicon": basicInfo.favicon,
      "logo": basicInfo.logo
    },
    "defaultTheme": {
      "mode": theme.defaultMode,
      "typography": {
        "headingFont": theme.typography.headingFont,
        "bodyFont": theme.typography.bodyFont
      }
    },
    "defaultSeo": {
      "metaTitle": seo.metaTitle,
      "metaDescription": seo.metaDescription,
      "ogImage": seo.ogImage
    }
  }`;

  return client.fetch(query);
}

// Runtime settings - these can change without redeployment
export async function getRuntimeSettings() {
  const now = Date.now();

  // Return cached settings if they exist and are not expired
  if (cachedRuntimeSettings && (now - cachedRuntimeSettings.timestamp) < CACHE_DURATION) {
    return cachedRuntimeSettings.data;
  }

  const query = `*[_type == "siteSettings"][0] {
    "theme": {
      "defaultMode": theme.defaultMode,
      "lightMode": {
        "colors": theme.lightMode.colors,
        "overlays": theme.lightMode.overlays
      },
      "darkMode": {
        "colors": theme.darkMode.colors,
        "overlays": theme.darkMode.overlays
      },
      "typography": theme.typography,
      "spacing": theme.spacing
    }
  }`;

  const settings = await client.fetch(query);
  
  // Update cache with new data and timestamp
  cachedRuntimeSettings = {
    data: settings,
    timestamp: now
  };

  return settings;
}

// Get specific theme colors for current mode
export async function getThemeColors(mode: 'light' | 'dark') {
  const settings = await getRuntimeSettings();
  return settings.theme[`${mode}Mode`].colors;
}

// Get specific overlay settings
export async function getOverlaySettings(mode: 'light' | 'dark') {
  const settings = await getRuntimeSettings();
  return settings.theme[`${mode}Mode`].overlays;
} 