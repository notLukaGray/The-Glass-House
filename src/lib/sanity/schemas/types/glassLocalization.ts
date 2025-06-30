import { SanityClient } from "@sanity/client";
import { getEnabledLanguages } from "../../utils/foundationUtils";
import type { Rule } from "@sanity/types";

export interface GlassLocalizationConfig {
  fieldName?: string;
  fieldType?: "string" | "text" | "array";
  fieldTitle?: string;
  additionalOptions?: Record<string, unknown>;
}

export async function createGlassLocalization(
  client: SanityClient,
  config: GlassLocalizationConfig = {},
) {
  const {
    fieldName = "localizedContent",
    fieldType = "string",
    fieldTitle = "Localized Content",
    additionalOptions = {},
  } = config;

  const languages = await getEnabledLanguages(client);

  const fields = languages.map((lang) => ({
    name: lang.code,
    title: lang.name,
    type: fieldType,
    ...additionalOptions,
  }));

  return {
    name: fieldName,
    title: fieldTitle,
    type: "object",
    fields,
    options: {
      layout: "dropdown",
    },
  };
}

const glassLocalization = {
  name: "glassLocalization",
  title: "Glass Localization",
  type: "object",
  description: "Dynamic localization field that adapts to foundation settings",
  fields: [
    // Base English field - always present
    {
      name: "en",
      type: "string",
      title: "English",
      validation: (rule: Rule) => rule.required(),
    },
    // Additional languages will be added dynamically by the system
  ],
  // Custom component will handle the dynamic rendering
  components: {
    input: (props: unknown) => {
      // This will be replaced with our dynamic component
      // @ts-expect-error - placeholder
      return props.children;
    },
  },
};

export default glassLocalization;
