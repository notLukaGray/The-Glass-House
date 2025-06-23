import { NextRequest, NextResponse } from "next/server";
import { sanityClient, sanityClientBuild } from "@/lib/sanity/client";
import {
  SiteSettings,
  SanitySettingsResponse,
  DEFAULT_SETTINGS,
} from "@/types/settings";
import { validateSettings, logValidationErrors } from "@/lib/validation/utils";
import { schemas } from "@/lib/validation/schemas";
import { z } from "zod";

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

    // Use the appropriate client based on the query type
    const client = type === "build" ? sanityClientBuild : sanityClient;
    const data: SanitySettingsResponse = await client.fetch(query);

    // Merge with defaults BEFORE validation
    const mergedSettings = mergeWithDefaults(data);

    // Validate the merged data, not the raw data
    const validatedData = validateSettings(mergedSettings);

    if (!validatedData) {
      // Log validation errors for debugging
      try {
        schemas.SiteSettings.parse(mergedSettings);
      } catch (error) {
        if (error instanceof Error) {
          logValidationErrors(
            "Settings API",
            error as z.ZodError,
            mergedSettings,
          );
        }
      }
      console.warn("Settings validation failed, using defaults");
      return NextResponse.json(DEFAULT_SETTINGS, {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    // Always return the merged, validated settings
    return NextResponse.json(mergedSettings, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[Settings API] Failed to fetch settings:", error);

    // Return default settings on error
    return NextResponse.json(DEFAULT_SETTINGS, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }
}
