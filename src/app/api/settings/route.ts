import { NextRequest, NextResponse } from "next/server";
import { sanityClient, sanityClientBuild } from "@/lib/sanity/client";
import {
  SiteSettings,
  SanitySettingsResponse,
  DEFAULT_SETTINGS,
  SettingsValidationResult,
} from "@/types/settings";

/**
 * Validates the settings data fetched from Sanity.
 * Ensures that critical fields are present and properly structured.
 * Returns both errors (which prevent the settings from being used)
 * and warnings (which are logged but don't block the response).
 *
 * @param {SanitySettingsResponse} data - The raw data from Sanity.
 * @returns {SettingsValidationResult} Validation result with errors and warnings.
 */
function validateSettings(
  data: SanitySettingsResponse,
): SettingsValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Critical validation - these will cause the API to return defaults
  if (!data.basicInfo?.title?.en) {
    errors.push("Site title is required");
  }

  if (!data.theme?.lightMode?.colors) {
    errors.push("Light mode colors are incomplete");
  }

  if (data.theme?.darkMode?.colors) {
    const colors = data.theme.darkMode.colors;
    if (!colors.primary || !colors.background || !colors.text) {
      errors.push("Dark mode colors are incomplete");
    }
  }

  // Warning validation - these are logged but don't block the response
  if (!data.seo?.metaTitle?.en) {
    warnings.push("SEO meta title is missing");
  }
  if (!data.seo?.metaDescription?.en) {
    warnings.push("SEO meta description is missing");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Merges Sanity data with default settings to ensure all required fields are present.
 * This provides a safety net - if Sanity is missing certain fields, the defaults
 * will be used instead of causing the application to break.
 *
 * @param {SanitySettingsResponse} data - The raw data from Sanity.
 * @returns {SiteSettings} Complete settings object with defaults merged in.
 */
function mergeWithDefaults(data: SanitySettingsResponse): SiteSettings {
  return {
    basicInfo: {
      title: data.basicInfo?.title || DEFAULT_SETTINGS.basicInfo.title,
      description:
        data.basicInfo?.description || DEFAULT_SETTINGS.basicInfo.description,
      favicon: data.basicInfo?.favicon || DEFAULT_SETTINGS.basicInfo.favicon,
      logo: data.basicInfo?.logo || DEFAULT_SETTINGS.basicInfo.logo,
    },
    theme: {
      defaultMode:
        data.theme?.defaultMode || DEFAULT_SETTINGS.theme.defaultMode,
      lightMode: {
        colors: {
          ...DEFAULT_SETTINGS.theme.lightMode.colors,
          ...data.theme?.lightMode?.colors,
        },
        overlays: {
          ...DEFAULT_SETTINGS.theme.lightMode.overlays,
          ...data.theme?.lightMode?.overlays,
        },
      },
      darkMode: {
        colors: {
          ...DEFAULT_SETTINGS.theme.darkMode.colors,
          ...data.theme?.darkMode?.colors,
        },
        overlays: {
          ...DEFAULT_SETTINGS.theme.darkMode.overlays,
          ...data.theme?.darkMode?.overlays,
        },
      },
      typography: {
        ...DEFAULT_SETTINGS.theme.typography,
        ...data.theme?.typography,
      },
      spacing: {
        ...DEFAULT_SETTINGS.theme.spacing,
        ...data.theme?.spacing,
      },
    },
    seo: {
      metaTitle: data.seo?.metaTitle || DEFAULT_SETTINGS.seo.metaTitle,
      metaDescription:
        data.seo?.metaDescription || DEFAULT_SETTINGS.seo.metaDescription,
      ogImage: data.seo?.ogImage || DEFAULT_SETTINGS.seo.ogImage,
    },
  };
}

/**
 * GET handler for the settings API route.
 *
 * This endpoint serves site settings to client-side components. It supports
 * two different query types:
 * - "build": Simplified query for build-time metadata generation
 * - "runtime": Full query for client-side theming and functionality
 *
 * The endpoint includes comprehensive error handling and validation to ensure
 * the application never breaks due to missing or invalid settings data.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} JSON response with settings or defaults.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "runtime";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    let query: string;

    if (type === "build") {
      // Simplified query for build-time metadata generation
      // Only fetches essential fields needed for SEO and basic site info
      query = `*[_type == "siteSettings"][0] {
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
          "typography": {
            "headingFont": theme.typography.headingFont,
            "bodyFont": theme.typography.bodyFont,
            "customFonts": theme.typography.customFonts
          }
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
    } else {
      // Full query for runtime client-side usage
      // Includes all theme colors, spacing, and dynamic content
      query = `*[_type == "siteSettings"][0] {
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
    }

    // Use appropriate client based on query type
    const client = type === "build" ? sanityClientBuild : sanityClient;
    const data: SanitySettingsResponse = await client.fetch(query);

    if (!data) {
      console.warn(
        "[Settings API] No settings found in Sanity, returning defaults",
      );
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    // Validate the fetched data
    const validation = validateSettings(data);

    if (!validation.isValid) {
      console.warn("Settings validation failed:", validation.errors);
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    // Merge with defaults to ensure all fields are present
    const settings = mergeWithDefaults(data);

    // Add the base URL to the response for client-side use
    const responseWithBaseUrl = {
      ...settings,
      _baseUrl: baseUrl,
    };

    return NextResponse.json(responseWithBaseUrl);
  } catch (error) {
    console.error("[Settings API] Failed to fetch settings:", error);
    // Always return defaults on error to prevent application crashes
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}
