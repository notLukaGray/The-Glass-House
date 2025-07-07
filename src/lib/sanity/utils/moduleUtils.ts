import { MODULE_TYPES } from "./constants";
import { GlassLocalizationInput } from "../components/GlassLocalizationInput";
import { GenericComputedFieldsInput } from "../components/GenericComputedFieldsInput";
import { SanityField } from "../types";

export const getModuleTypeFromDocument = (
  docType: string | undefined,
): string => {
  if (!docType || typeof docType !== "string") return "default";

  return (
    MODULE_TYPES[docType as keyof typeof MODULE_TYPES] ||
    docType.replace("module", "").toLowerCase()
  );
};

export const mapModuleFields = (fields: SanityField[], moduleType: string) => {
  return fields.map((field) => {
    // Convert title and description to glassLocaleString (single line)
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

    // Convert alternativeTitle and caption to glassLocaleText (multi-line)
    if (field.name === "alternativeTitle" || field.name === "caption") {
      return {
        ...field,
        type: "glassLocaleText",
        components: { input: GlassLocalizationInput },
        options: {
          fieldType: "text",
        },
        description: field.description,
      };
    }

    // Update computedFields with module type
    if (field.name === "computedFields") {
      return {
        ...field,
        components: { input: GenericComputedFieldsInput },
        options: {
          elementType: moduleType, // Keep elementType for compatibility
          moduleType: moduleType,
        },
      };
    }

    return field;
  });
};
