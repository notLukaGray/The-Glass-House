import { NextRequest, NextResponse } from "next/server";
import {
  client as sanityClient,
  clientBuild as sanityClientBuild,
} from "@/lib/handlers/sanity";
import {
  SiteSettings,
  SanitySettingsResponse,
  DEFAULT_SETTINGS,
} from "@/types/settings";
import { schemas } from "@/lib/validation/schemas";

function cleanInvisibleChars(str: string): string {
  if (typeof str !== "string") return str;
  // Remove zero-width spaces, zero-width non-joiners, and other invisible Unicode characters
  return str
    .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u2060-\u2064\u206A-\u206F]/g, "")
    .trim();
}

function cleanObjectStrings(obj: unknown): unknown {
  if (typeof obj === "string") {
    return cleanInvisibleChars(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanObjectStrings);
  }
  if (obj && typeof obj === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = cleanObjectStrings(value);
    }
    return cleaned;
  }
  return obj;
}

function mergeWithDefaults(data: SanitySettingsResponse): SiteSettings {
  // Clean invisible characters from the data first
  const cleanedData = cleanObjectStrings(data) as SanitySettingsResponse;

  // Helper function to extract string value from either string or localeString object
  const extractStringValue = (
    value: string | import("@/types/settings").SanityLocaleString | undefined,
  ): string => {
    if (typeof value === "string") {
      return value;
    }
    if (value && typeof value === "object" && value._type === "localeString") {
      return value.en || "";
    }
    return "";
  };

  return {
    _id: cleanedData._id || "siteSettings",
    _type: cleanedData._type || "siteSettings",
    basicInfo: {
      title:
        extractStringValue(cleanedData.basicInfo?.title) ||
        DEFAULT_SETTINGS.basicInfo.title,
      description:
        extractStringValue(cleanedData.basicInfo?.description) ||
        DEFAULT_SETTINGS.basicInfo.description,
      favicon:
        cleanedData.basicInfo?.favicon || DEFAULT_SETTINGS.basicInfo.favicon,
      logo: cleanedData.basicInfo?.logo || DEFAULT_SETTINGS.basicInfo.logo,
    },
    theme: {
      defaultMode:
        cleanedData.theme?.defaultMode || DEFAULT_SETTINGS.theme.defaultMode,
      lightMode: {
        colors: {
          ...DEFAULT_SETTINGS.theme.lightMode.colors,
          ...cleanedData.theme?.lightMode?.colors,
        },
        overlays: {
          ...DEFAULT_SETTINGS.theme.lightMode.overlays,
          ...cleanedData.theme?.lightMode?.overlays,
        },
      },
      darkMode: {
        colors: {
          ...DEFAULT_SETTINGS.theme.darkMode.colors,
          ...cleanedData.theme?.darkMode?.colors,
        },
        overlays: {
          ...DEFAULT_SETTINGS.theme.darkMode.overlays,
          ...cleanedData.theme?.darkMode?.overlays,
        },
      },
      typography: {
        ...DEFAULT_SETTINGS.theme.typography,
        ...cleanedData.theme?.typography,
      },
      spacing: {
        ...DEFAULT_SETTINGS.theme.spacing,
        ...cleanedData.theme?.spacing,
      },
    },
    seo: {
      metaTitle: cleanedData.seo?.metaTitle || DEFAULT_SETTINGS.seo.metaTitle,
      metaDescription:
        cleanedData.seo?.metaDescription ||
        DEFAULT_SETTINGS.seo.metaDescription,
      ogImage: cleanedData.seo?.ogImage || DEFAULT_SETTINGS.seo.ogImage,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "runtime";

    let query: string;

    if (type === "build") {
      query = `*[_type == "siteSettings"][0] {
        _id,
        _type,
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
      query = `*[_type == "siteSettings"][0] {
        _id,
        _type,
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

    const client = type === "build" ? sanityClientBuild : sanityClient;
    const rawData: SanitySettingsResponse = await client.fetch(query);

    // If no document exists in Sanity, use defaults
    if (!rawData) {
      return NextResponse.json(DEFAULT_SETTINGS, {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    // Clean the data to remove invisible Unicode characters
    const data = cleanObjectStrings(rawData) as SanitySettingsResponse;

    // Merge with defaults BEFORE validation
    const mergedSettings = mergeWithDefaults(data);

    // Sanitize the defaultMode value to remove any invisible characters
    if (mergedSettings.theme?.defaultMode) {
      // Remove all non-printable characters and trim whitespace
      const cleanedMode = mergedSettings.theme.defaultMode
        .replace(/[^\x20-\x7E]/g, "")
        .trim();
      mergedSettings.theme.defaultMode = cleanedMode as
        | "light"
        | "dark"
        | "system";
    }

    // Zod validation
    try {
      schemas.settings.Settings.parse(mergedSettings);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Settings validation failed",
          details: error instanceof Error ? error.message : error,
        },
        { status: 500 },
      );
    }

    // Always return the merged, validated settings
    return NextResponse.json(mergedSettings, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch settings",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
