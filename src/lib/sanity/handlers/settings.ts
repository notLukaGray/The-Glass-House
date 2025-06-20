import { 
  SiteSettings, 
  DEFAULT_SETTINGS, 
  CachedSettings
} from '@/types/settings';

// Cache for runtime settings with timestamp and version
let cachedRuntimeSettings: CachedSettings | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_VERSION = '1.0.0'; // Increment when cache structure changes

/**
 * Fetches settings from the API route
 */
async function fetchSettingsFromAPI(type: 'build' | 'runtime' = 'runtime'): Promise<SiteSettings> {
  try {
    const response = await fetch(`/api/settings?type=${type}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch settings from API:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Build-time settings - these should be fetched during build
 */
export async function getBuildTimeSettings(): Promise<SiteSettings> {
  return fetchSettingsFromAPI('build');
}

/**
 * Runtime settings - these can change without redeployment
 */
export async function getRuntimeSettings(): Promise<SiteSettings> {
  const now = Date.now();

  // Return cached settings if they exist and are not expired
  if (cachedRuntimeSettings && 
      (now - cachedRuntimeSettings.timestamp) < CACHE_DURATION &&
      cachedRuntimeSettings.version === CACHE_VERSION) {
    return cachedRuntimeSettings.data;
  }

  try {
    const settings = await fetchSettingsFromAPI('runtime');
    
    // Update cache with new data and timestamp
    cachedRuntimeSettings = {
      data: settings,
      timestamp: now,
      version: CACHE_VERSION
    };

    return settings;
  } catch (error) {
    console.error('Failed to fetch runtime settings:', error);
    // Return cached settings if available, otherwise defaults
    return cachedRuntimeSettings?.data || DEFAULT_SETTINGS;
  }
}

/**
 * Get specific theme colors for current mode
 */
export async function getThemeColors(mode: 'light' | 'dark'): Promise<SiteSettings['theme']['lightMode']['colors']> {
  try {
    const settings = await getRuntimeSettings();
    return settings.theme[`${mode}Mode`].colors;
  } catch (error) {
    console.error(`Failed to get ${mode} theme colors:`, error);
    return DEFAULT_SETTINGS.theme[`${mode}Mode`].colors;
  }
}

/**
 * Get specific overlay settings
 */
export async function getOverlaySettings(mode: 'light' | 'dark'): Promise<SiteSettings['theme']['lightMode']['overlays']> {
  try {
    const settings = await getRuntimeSettings();
    return settings.theme[`${mode}Mode`].overlays;
  } catch (error) {
    console.error(`Failed to get ${mode} overlay settings:`, error);
    return DEFAULT_SETTINGS.theme[`${mode}Mode`].overlays;
  }
}

/**
 * Clear settings cache (useful for development)
 */
export function clearSettingsCache(): void {
  cachedRuntimeSettings = null;
}

/**
 * Get cache status for debugging
 */
export function getCacheStatus(): { isCached: boolean; age: number | null; version: string | null } {
  if (!cachedRuntimeSettings) {
    return { isCached: false, age: null, version: null };
  }
  
  return {
    isCached: true,
    age: Date.now() - cachedRuntimeSettings.timestamp,
    version: cachedRuntimeSettings.version
  };
} 