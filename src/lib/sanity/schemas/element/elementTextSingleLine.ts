import { createBaseElementSchema } from "./baseElementSchema";
import { Rule } from "@sanity/types";
import { typographyObject, typographyFieldset } from "../objects/typography";
import { GlassLocalizationInput } from "../../components/GlassLocalizationInput";

const base = createBaseElementSchema(
  "elementTextSingleLine",
  "Single Line Text Element",
  "textSingleLine",
  [
    // Text content - this is the main field
    {
      name: "text",
      title: "Text Content",
      type: "glassLocaleString",
      components: { input: GlassLocalizationInput },
      options: {
        fieldType: "string",
      },
      validation: (rule: Rule) => rule.required(),
      fieldset: "content",
      description: "Single line of text (titles, labels, headings)",
    },
    // Usage field for categorization
    {
      name: "usage",
      title: "Usage",
      type: "string",
      options: {
        list: [
          { title: "General", value: "" },
          { title: "Hero Headline", value: "hero-headline" },
        ],
      },
      fieldset: "content",
      description:
        "What this text element is used for (helps with organization)",
    },
    // Shared typography object
    typographyObject,
  ],
  [],
);

// Add typography fieldset to the base schema
base.fieldsets = [...base.fieldsets, typographyFieldset];

// Override fields to remove unnecessary ones and keep only what we need
base.fields = base.fields.filter(
  (field) =>
    // Keep content fields (text, typography)
    field.fieldset === "content" ||
    // Keep typography field
    field.name === "typography" ||
    // Keep computed fields (auto-generated accessibility)
    field.name === "computedFields" ||
    // Keep debug field
    field.name === "debug" ||
    // Keep custom ID
    field.name === "customId",
);

// Override preview to use text field with fallback
base.preview = {
  select: {
    title: "text",
    alternativeTitle: "usage",
    description: "text",
    subtitle: "text",
    media: "text",
  },
  prepare({
    title,
    alternativeTitle,
  }: {
    title?: Record<string, string>;
    alternativeTitle?: string;
  }) {
    // Get the best available text content
    const displayText =
      title?.en ||
      title?.es ||
      Object.values(title || {}).find((val) => val?.trim()) ||
      "Untitled Text";

    return {
      title: displayText,
      subtitle: alternativeTitle
        ? `${alternativeTitle} - Single Line Text Element`
        : "Single Line Text Element",
      media: undefined,
    };
  },
};

export { elementImageCastingFields as elementTextSingleLineCastingFields } from "./elementImage";

export default base;
