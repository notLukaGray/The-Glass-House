import { createBaseElementSchema } from "./baseElementSchema";
import { createLocalizedTextField } from "../../utils/localizationUtils";
import { GlassLocalizationInput } from "../../components/GlassLocalizationInput";
import { GenericComputedFieldsInput } from "../../components/GenericComputedFieldsInput";
import {
  typographyObject,
  typographyFieldset,
} from "../objects/core/typography";

const base = createBaseElementSchema(
  "elementTextBlock",
  "Text Block Element",
  "textBlock",
  [
    createLocalizedTextField(
      "text",
      "Text Content",
      "Multi-line text content for this element",
      "content",
      (rule) => rule.required(),
    ),
    // Shared typography object
    typographyObject,
  ],
  [],
);

// Add typography fieldset to the base schema
base.fieldsets = [...base.fieldsets, typographyFieldset];

// Remove title, description, alternative title and caption fields for text block element
base.fields = base.fields.filter(
  (field) =>
    field.name !== "title" &&
    field.name !== "description" &&
    field.name !== "alternativeTitle" &&
    field.name !== "caption",
);

// Convert fields to use correct localization types and update computed fields
base.fields = base.fields.map((field) => {
  if (field.name === "title" || field.name === "description") {
    return {
      ...field,
      type: "glassLocaleString",
      components: { input: GlassLocalizationInput },
      options: {
        fieldType: "string",
      },
      description: field.description,
    };
  }
  if (field.name === "computedFields") {
    return {
      ...field,
      components: { input: GenericComputedFieldsInput },
      options: {
        elementType: "textBlock",
      },
    };
  }
  return field;
});

// Override preview to use text field
base.preview = {
  select: {
    text: "text.en",
    alternativeText: "text.es",
  } as unknown as typeof base.preview.select,
  prepare({
    text,
    alternativeText,
  }: {
    text?: string;
    alternativeText?: string;
  }) {
    const displayText = text || alternativeText || "Untitled Text Block";

    return {
      title: displayText,
      subtitle: "Text Block Element",
      media: undefined,
    };
  },
};

export default base;

export { elementImageCastingFields as elementTextBlockCastingFields } from "./elementImage";
