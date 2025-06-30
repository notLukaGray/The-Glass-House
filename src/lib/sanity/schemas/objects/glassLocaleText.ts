import { GlassLocalizationInput } from "../../components/GlassLocalizationInput";
import type { Rule } from "@sanity/types";

const glassLocaleText = {
  name: "glassLocaleText",
  type: "object",
  title: "Glass Localized Text",
  description: "Dynamic localization field for longer text content",
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
