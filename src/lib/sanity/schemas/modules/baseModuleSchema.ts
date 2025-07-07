import { Rule } from "@sanity/types";
import CastRefInput from "../../components/CastRefInput";
import { GenericComputedFieldsInput } from "../../components/GenericComputedFieldsInput";
import {
  createLocalizedComputedFields,
  createLocalizedStringField,
} from "../../utils/localizationUtils";
import { createCastingFields } from "../objects/casting/sharedCastingFields";
import { mapModuleFields } from "../../utils/moduleUtils";
import { SanityField } from "../../types";

// Base module schema - basic information every module needs
export const createBaseModuleSchema = (
  moduleName: string,
  moduleTitle: string,
  moduleType: string,
  additionalFields: unknown[] = [],
) => {
  // Use the new modular casting system (currently hidden from UI)
  // const defaultCastingFields = createCastingFields("module");
  // const castingFields = customCastingFields || defaultCastingFields;

  const fields = [
    // Module metadata (common to all modules) - ALWAYS FIRST
    {
      name: "moduleType",
      title: "Module Type",
      type: "string",
      initialValue: moduleName,
      readOnly: true,
      hidden: true,
      fieldset: "metadata",
    },
    // Localized title and description
    createLocalizedStringField(
      "title",
      "Module Title",
      "Internal title for this module",
      "metadata",
      (rule: Rule) => rule.required(),
    ),
    createLocalizedStringField(
      "description",
      "Module Description",
      "Brief description of what this module does",
      "metadata",
    ),
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Tags for categorizing and filtering modules",
      fieldset: "metadata",
    },
    // Additional fields (module-specific content)
    ...additionalFields,
    // Advanced fields (always last)
    {
      name: "debug",
      title: "Debug Mode",
      type: "boolean",
      initialValue: false,
      fieldset: "advanced",
      description: "Enable debug information for this module",
    },
    {
      name: "computedFields",
      title: "Auto-generated Fields",
      type: "object",
      fieldset: "advanced",
      options: {
        elementType: moduleType, // Keep elementType for compatibility
        moduleType: moduleType,
      },
      components: {
        input: GenericComputedFieldsInput,
      },
      description:
        "These fields are automatically computed based on your module content",
      fields: createLocalizedComputedFields(),
    },
  ];
  return {
    name: moduleName,
    title: moduleTitle,
    type: "document",
    fieldsets: [
      {
        name: "metadata",
        title: "Module Information",
        options: { collapsible: true, collapsed: false },
      },
      {
        name: "content",
        title: "Content",
        options: { collapsible: true, collapsed: true },
      },
      {
        name: "advanced",
        title: "Advanced",
        options: { collapsible: true, collapsed: true },
      },
    ],
    fields: mapModuleFields(fields as SanityField[], moduleType),
    preview: {
      select: {
        title: "title.en",
        description: "description.en",
        moduleType: "moduleType",
      },
      prepare({
        title,
        description,
        moduleType,
      }: {
        title?: string;
        description?: string;
        moduleType?: string;
      }) {
        return {
          title: title || "Untitled Module",
          subtitle: description || moduleType || "Module",
        };
      },
    },
  };
};

export function createRefWithCastingField({
  name,
  title,
  refTypes,
  description,
}: {
  name: string;
  title: string;
  refTypes: string[];
  description?: string;
}) {
  return {
    name,
    title,
    type: "object",
    fields: [
      {
        name: "ref",
        type: "reference",
        to: refTypes.map((type: string) => ({ type })),
        description,
        validation: (rule: Rule) =>
          rule.custom(() => {
            // Implement the custom validation logic here
            return true; // Return true for valid cases
          }),
      },
      {
        name: "casting",
        type: "object",
        fields: createCastingFields("element"),
        description:
          "Positioning and layout for this element within the module",
      },
    ],
    components: { input: CastRefInput },
  };
}
