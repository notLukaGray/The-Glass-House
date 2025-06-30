import { createBaseElementSchema } from "./baseElementSchema";
import { Rule } from "@sanity/types";
import { typographyObject, typographyFieldset } from "../objects/typography";

const base = createBaseElementSchema(
  "elementTextSingleLine",
  "Single Line Text Element",
  "textSingleLine",
  [
    // Text content - this is the main field
    {
      name: "text",
      title: "Text Content",
      type: "glassLocalization",
      validation: (rule: Rule) => rule.required(),
      fieldset: "content",
      description: "Single line of text (titles, labels, headings)",
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

// Override preview to use text field
base.preview = {
  select: {
    title: "text.en",
    alternativeTitle: "text.es",
    description: "text.en",
    subtitle: "text",
    media: "text",
  },
  prepare({
    title,
    alternativeTitle,
    description,
  }: {
    title?: string;
    alternativeTitle?: string;
    description?: string;
  }) {
    const displayText =
      title || alternativeTitle || description || "Untitled Text";
    return {
      title: displayText,
      subtitle: "Single Line Text Element",
      media: undefined,
    };
  },
};

export default base;
