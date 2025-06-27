import { ELEMENT_TYPE_MAPPINGS } from "./constants";
import { GlassLocalizationInput } from "../components/GlassLocalizationInput";
import { GenericComputedFieldsInput } from "../components/GenericComputedFieldsInput";
import { SanityField } from "../types";

export const getElementTypeFromDocument = (
  docType: string | undefined,
): string => {
  if (!docType || typeof docType !== "string") return "default";

  return (
    ELEMENT_TYPE_MAPPINGS[docType as keyof typeof ELEMENT_TYPE_MAPPINGS] ||
    docType.replace("element", "").toLowerCase()
  );
};

export const mapElementFields = (
  fields: SanityField[],
  elementType: string,
) => {
  return fields.map((field) => {
    // Convert localeString fields to glassLocalization
    if (
      field.name === "title" ||
      field.name === "description" ||
      field.name === "alternativeTitle" ||
      field.name === "caption"
    ) {
      return {
        ...field,
        type: "glassLocalization",
        components: { input: GlassLocalizationInput },
        options: undefined,
        description: undefined,
      };
    }

    // Apply GlassLocalizationInput to any field that's already glassLocalization type
    if (field.type === "glassLocalization") {
      return {
        ...field,
        components: { input: GlassLocalizationInput },
      };
    }

    // Update computedFields with element type
    if (field.name === "computedFields") {
      return {
        ...field,
        components: { input: GenericComputedFieldsInput },
        options: {
          elementType: elementType,
        },
      };
    }

    return field;
  });
};
