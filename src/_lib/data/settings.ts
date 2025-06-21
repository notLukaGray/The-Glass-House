import { createSanityClient, envConfig } from '@/_lib/config/sanity';
import { SiteSettings, DEFAULT_SETTINGS } from '@/types/settings';

// Server-side settings fetching (direct Sanity client)
export async function getSettingsServer(): Promise<SiteSettings> {
  try {
    const client = createSanityClient();
    
    const query = `*[_type == "siteSettings"][0] {
      "basicInfo": {
        "title": basicInfo.title,
        "description": basicInfo.description,
        "favicon": {
          "_ref": basicInfo.favicon._ref,
          "_type": "reference",
          "url": basicInfo.favicon->url
        },
        "logo": {
          "_ref": basicInfo.logo._ref,
          "_type": "reference",
          "url": basicInfo.logo->svgData
        }
      },
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
      },
      "seo": {
        "metaTitle": seo.metaTitle,
        "metaDescription": seo.metaDescription,
        "ogImage": {
          "_ref": seo.ogImage._ref,
          "_type": "reference",
          "url": seo.ogImage->url
        }
      }
    }`;
    
    const settings = await client.fetch<SiteSettings>(query);
    
    if (!settings) {
      console.warn('Settings not found, using defaults');
      return DEFAULT_SETTINGS;
    }
    
    return settings;
  } catch (error) {
    console.error('Error fetching settings (server):', error);
    return DEFAULT_SETTINGS;
  }
}

// Client-side settings fetching (via API route)
export async function getSettingsClient(): Promise<SiteSettings> {
  try {
    // In development, always use HTTP for localhost to avoid SSL issues
    let baseUrl: string;
    
    if (typeof window !== 'undefined') {
      // Client-side: use current origin or fallback to localhost
      baseUrl = window.location.origin;
      
      // Debug logging
      console.log('[Settings Client] Window location origin:', window.location.origin);
      console.log('[Settings Client] Window location protocol:', window.location.protocol);
      console.log('[Settings Client] Window location hostname:', window.location.hostname);
      
      // If we're on HTTPS but trying to access localhost, force HTTP
      if (window.location.protocol === 'https:' && 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        baseUrl = `http://${window.location.hostname}:${window.location.port || '3000'}`;
        console.log('[Settings Client] Forced HTTP due to HTTPS protocol on localhost:', baseUrl);
      }
    } else {
      // Server-side: use environment variable or fallback
      baseUrl = envConfig.baseUrl || 'http://localhost:3000';
    }
    
    // Ensure we use HTTP for localhost in development
    if (envConfig.isDevelopment && (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1'))) {
      baseUrl = baseUrl.replace('https://', 'http://');
      console.log('[Settings Client] Forced HTTP for localhost:', baseUrl);
    }
    
    const apiUrl = `${baseUrl}/api/settings`;
    
    console.log('[Settings Client] Final API URL:', apiUrl);
    console.log('[Settings Client] Environment:', envConfig.isDevelopment ? 'development' : 'production');
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control to prevent stale data
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[Settings Client] Successfully fetched settings');
    return data;
  } catch (error) {
    console.error('Error fetching settings (client):', error);
    
    // If it's an SSL error, try with explicit HTTP
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.log('[Settings Client] Attempting fallback to explicit HTTP...');
      try {
        const fallbackUrl = 'http://localhost:3000/api/settings';
        console.log('[Settings Client] Trying fallback URL:', fallbackUrl);
        
        const fallbackResponse = await fetch(fallbackUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('[Settings Client] Fallback successful');
          return fallbackData;
        }
      } catch (fallbackError) {
        console.error('[Settings Client] Fallback also failed:', fallbackError);
      }
    }
    
    console.log('[Settings Client] Falling back to default settings');
    return DEFAULT_SETTINGS;
  }
}

// Universal function that chooses the right method
export async function getSettings(isServer: boolean = false): Promise<SiteSettings> {
  if (isServer) {
    return getSettingsServer();
  } else {
    return getSettingsClient();
  }
} 