import { SanityClient } from "@sanity/client";

export interface LanguageConfig {
  code: string;
  name: string;
  enabled: boolean;
  direction: "ltr" | "rtl";
}

export interface FoundationLocalization {
  defaultLanguage: string;
  additionalLanguages: LanguageConfig[];
  fallbackLanguage: string;
}

export interface FoundationSettings {
  localization: FoundationLocalization;
}

/**
 * Get all enabled languages from foundation settings
 */
export async function getEnabledLanguages(
  client: SanityClient,
): Promise<LanguageConfig[]> {
  try {
    const foundation = await client.fetch(`
      *[_type == "foundation"][0] {
        localization {
          additionalLanguages[] {
            code,
            name,
            enabled,
            direction
          }
        }
      }
    `);

    if (!foundation?.localization?.additionalLanguages) {
      // Return default English if no foundation settings found
      return [
        {
          code: "en",
          name: "English",
          enabled: true,
          direction: "ltr" as const,
        },
      ];
    }

    // Filter enabled languages and add English as default
    const enabledLanguages = foundation.localization.additionalLanguages
      .filter((lang: LanguageConfig) => lang.enabled)
      .map((lang: LanguageConfig) => ({
        ...lang,
        direction: lang.direction || "ltr",
      }));

    // Always include English as the first language
    const englishLanguage: LanguageConfig = {
      code: "en",
      name: "English",
      enabled: true,
      direction: "ltr",
    };

    return [englishLanguage, ...enabledLanguages];
  } catch (error) {
    console.error("Error fetching foundation settings:", error);
    // Return default English on error
    return [
      {
        code: "en",
        name: "English",
        enabled: true,
        direction: "ltr" as const,
      },
    ];
  }
}

/**
 * Generate localization options for Sanity fields
 */
export async function generateLocalizationOptions(client: SanityClient) {
  const languages = await getEnabledLanguages(client);

  return {
    list: languages.map((lang) => ({
      title: lang.name,
      value: lang.code,
    })),
    layout: "dropdown" as const,
  };
}

/**
 * Create a localized field configuration
 */
export async function createLocalizedField(
  client: SanityClient,
  fieldName: string,
  fieldType: "string" | "text" | "array" = "string",
  fieldTitle?: string,
  additionalOptions: Record<string, unknown> = {},
) {
  const languages = await getEnabledLanguages(client);

  const fields = languages.map((lang) => ({
    name: lang.code,
    title: lang.name,
    type: fieldType,
    ...additionalOptions,
  }));

  return {
    name: fieldName,
    title: fieldTitle || fieldName,
    type: "object",
    fields,
    options: {
      layout: "dropdown",
    },
  };
}

/**
 * Get the default language from foundation settings
 */
export async function getDefaultLanguage(
  client: SanityClient,
): Promise<string> {
  try {
    const foundation = await client.fetch(`
      *[_type == "foundation"][0] {
        localization {
          defaultLanguage
        }
      }
    `);

    return foundation?.localization?.defaultLanguage || "en";
  } catch (error) {
    console.error("Error fetching default language:", error);
    return "en";
  }
}

/**
 * Get the fallback language from foundation settings
 */
export async function getFallbackLanguage(
  client: SanityClient,
): Promise<string> {
  try {
    const foundation = await client.fetch(`
      *[_type == "foundation"][0] {
        localization {
          fallbackLanguage
        }
      }
    `);

    return foundation?.localization?.fallbackLanguage || "en";
  } catch (error) {
    console.error("Error fetching fallback language:", error);
    return "en";
  }
}
