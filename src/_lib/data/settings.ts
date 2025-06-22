import { createSanityClient, envConfig } from "@/_lib/config/sanity";
import { SiteSettings, DEFAULT_SETTINGS } from "@/types/settings";

/**
 * Fetches site settings directly from Sanity on the server-side.
 * This function is used in Server Components and API routes where we have
 * direct access to the Sanity client without going through HTTP.
 *
 * The GROQ query is structured to fetch all the necessary settings in a single request,
 * including nested references for favicon, logo, and Open Graph images.
 *
 * @returns {Promise<SiteSettings>} The site settings or default settings if fetch fails.
 */
export async function getSettingsServer(): Promise<SiteSettings> {
  try {
    const client = createSanityClient();

    // This GROQ query fetches the single siteSettings document and projects
    // only the fields we need, resolving image references to get their URLs.
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
      console.warn("Settings not found, using defaults");
      return DEFAULT_SETTINGS;
    }

    return settings;
  } catch (error) {
    console.error("Error fetching settings (server):", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Fetches site settings via the API route on the client-side.
 * This function handles the complex logic of determining the correct base URL,
 * especially for localhost development where HTTPS/HTTP issues can occur.
 *
 * The function includes fallback mechanisms for various error scenarios,
 * including SSL certificate issues that commonly occur in local development.
 *
 * @returns {Promise<SiteSettings>} The site settings or default settings if fetch fails.
 */
export async function getSettingsClient(): Promise<SiteSettings> {
  try {
    // Determine the base URL for the API call
    let baseUrl: string;

    if (typeof window !== "undefined") {
      // Client-side: use the current page's origin
      baseUrl = window.location.origin;

      // Handle the common localhost HTTPS issue in development
      // Many development setups serve HTTPS but don't have valid certificates
      if (
        window.location.protocol === "https:" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1")
      ) {
        baseUrl = `http://${window.location.hostname}:${window.location.port || "3000"}`;
      }
    } else {
      // Server-side: use environment variable or fallback
      baseUrl = envConfig.baseUrl || "http://localhost:3000";
    }

    // Additional safety check for development environments
    if (
      envConfig.isDevelopment &&
      (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1"))
    ) {
      baseUrl = baseUrl.replace("https://", "http://");
    }

    const apiUrl = `${baseUrl}/api/settings`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Disable caching to ensure we always get fresh settings
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching settings (client):", error);

    // If it's a network error (like SSL issues), try with explicit HTTP
    if (error instanceof TypeError && error.message.includes("fetch")) {
      try {
        const fallbackUrl = "http://localhost:3000/api/settings";
        const fallbackResponse = await fetch(fallbackUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          return fallbackData;
        }
      } catch (fallbackError) {
        console.error("Fallback fetch also failed:", fallbackError);
      }
    }

    // If all else fails, return default settings
    return DEFAULT_SETTINGS;
  }
}

/**
 * A universal function that chooses the appropriate fetching method based on context.
 * This is useful when you want to let the function decide whether to use
 * server-side or client-side fetching based on the environment.
 *
 * @param {boolean} isServer - Whether to use server-side fetching (default: false).
 * @returns {Promise<SiteSettings>} The site settings.
 */
export async function getSettings(
  isServer: boolean = false,
): Promise<SiteSettings> {
  if (isServer) {
    return getSettingsServer();
  } else {
    return getSettingsClient();
  }
}
