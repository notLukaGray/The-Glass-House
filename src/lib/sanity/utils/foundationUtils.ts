import { createClient } from "@sanity/client";

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

export async function getEnabledLanguages(): Promise<LanguageConfig[]> {
  try {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: "2024-01-01",
      useCdn: false,
    });

    const foundation = await client.fetch(`
      *[_type == "foundationLocalization"][0] {
        additionalLanguages
      }
    `);

    if (!foundation?.additionalLanguages) {
      // Return default English if no foundation settings found
      return [
        {
          code: "en",
          name: "English",
          enabled: true,
          direction: "ltr",
        },
      ];
    }

    const enabledLanguages = foundation.additionalLanguages
      .filter((lang: LanguageConfig) => lang.enabled)
      .map((lang: LanguageConfig) => ({
        code: lang.code,
        name: lang.name,
        enabled: lang.enabled,
        direction: lang.direction,
      }));

    // Always include English as the first language
    const englishLanguage = {
      code: "en",
      name: "English",
      enabled: true,
      direction: "ltr",
    };

    // Check if English is already in the list
    const hasEnglish = enabledLanguages.some(
      (lang: LanguageConfig) => lang.code === "en",
    );
    if (!hasEnglish) {
      enabledLanguages.unshift(englishLanguage);
    }

    return enabledLanguages;
  } catch {
    // Return default English if there's an error
    return [
      {
        code: "en",
        name: "English",
        enabled: true,
        direction: "ltr",
      },
    ];
  }
}

export async function getAllLanguages(): Promise<LanguageConfig[]> {
  try {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: "2024-01-01",
      useCdn: false,
    });

    const foundation = await client.fetch(`
      *[_type == "foundationLocalization"][0] {
        additionalLanguages
      }
    `);

    if (!foundation?.additionalLanguages) {
      // Return default English if no foundation settings found
      return [
        {
          code: "en",
          name: "English",
          enabled: true,
          direction: "ltr",
        },
      ];
    }

    const allLanguages = foundation.additionalLanguages.map(
      (lang: LanguageConfig) => ({
        code: lang.code,
        name: lang.name,
        enabled: lang.enabled,
        direction: lang.direction,
      }),
    );

    // Always include English as the first language
    const englishLanguage = {
      code: "en",
      name: "English",
      enabled: true,
      direction: "ltr",
    };

    // Check if English is already in the list
    const hasEnglish = allLanguages.some(
      (lang: LanguageConfig) => lang.code === "en",
    );
    if (!hasEnglish) {
      allLanguages.unshift(englishLanguage);
    }

    return allLanguages;
  } catch {
    // Return default English if there's an error
    return [
      {
        code: "en",
        name: "English",
        enabled: true,
        direction: "ltr",
      },
    ];
  }
}

export async function getDefaultLanguage(): Promise<string> {
  try {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: "2024-01-01",
      useCdn: false,
    });

    const foundation = await client.fetch(`
      *[_type == "foundationLocalization"][0] {
        defaultLanguage
      }
    `);

    return foundation?.defaultLanguage || "en";
  } catch {
    return "en";
  }
}

export async function getFallbackLanguage(): Promise<string> {
  try {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: "2024-01-01",
      useCdn: false,
    });

    const foundation = await client.fetch(`
      *[_type == "foundationLocalization"][0] {
        fallbackLanguage
      }
    `);

    return foundation?.fallbackLanguage || "en";
  } catch {
    return "en";
  }
}
