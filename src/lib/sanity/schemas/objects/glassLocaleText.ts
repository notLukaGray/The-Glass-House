import { GlassLocalizationInput } from "../../components/GlassLocalizationInput";
import type { Rule } from "@sanity/types";

/**
 * Glass Locale Text - Multi-line localization field
 * This field type generates language fields based on foundation settings
 */
const glassLocaleText = {
  name: "glassLocaleText",
  type: "object",
  title: "Glass Localized Text",
  description:
    "Dynamic multi-line localization field that adapts to configured languages",
  fields: [
    // Base English field - always present
    {
      name: "en",
      type: "text",
      title: "English",
      validation: (rule: Rule) => rule.required(),
    },
    // Additional languages will be added dynamically by the system
  ],
  components: {
    input: GlassLocalizationInput,
  },
  options: {
    fieldType: "text",
  },
};

export default glassLocaleText;
