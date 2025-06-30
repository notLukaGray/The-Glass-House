import { GlassLocalizationInput } from "../../components/GlassLocalizationInput";
import type { Rule } from "@sanity/types";

/**
 * Glass Locale String - Dynamic localization field
 * This field type generates language fields based on foundation settings
 */
const glassLocaleString = {
  name: "glassLocaleString",
  type: "object",
  title: "Glass Localized String",
  description: "Dynamic localization field that adapts to configured languages",
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
  components: {
    input: GlassLocalizationInput,
  },
};

export default glassLocaleString;
