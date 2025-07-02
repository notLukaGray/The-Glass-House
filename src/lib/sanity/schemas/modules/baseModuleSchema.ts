import { Rule } from "@sanity/types";
import CastRefInput from "../../components/CastRefInput";
import { GenericComputedFieldsInput } from "../../components/GenericComputedFieldsInput";
import { createLocalizedComputedFields } from "../../utils/localizationUtils";
import { createCastingFields } from "../objects/sharedCastingFields";

// Base module schema - basic information every module needs
export const createBaseModuleSchema = (
  moduleName: string,
  moduleTitle: string,
  additionalFields: unknown[] = [],
) => {
  // Use the new modular casting system (currently hidden from UI)
  // const defaultCastingFields = createCastingFields("module");
  // const castingFields = customCastingFields || defaultCastingFields;

  const fields = [
    // Additional fields
    ...additionalFields,
    // Module metadata (common to all modules)
    {
      name: "moduleType",
      title: "Module Type",
      type: "string",
      initialValue: moduleName,
      readOnly: true,
      hidden: true,
      fieldset: "metadata",
    },
    {
      name: "title",
      title: "Module Title",
      type: "string",
      description: "Internal title for this module",
      fieldset: "metadata",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "description",
      title: "Module Description",
      type: "text",
      description: "Brief description of what this module does",
      fieldset: "metadata",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Tags for categorizing and filtering modules",
      fieldset: "metadata",
    },
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
        elementType: "module",
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
        name: "content",
        title: "Content",
        options: { collapsible: false, collapsed: false },
      },
      {
        name: "metadata",
        title: "Metadata",
        options: { collapsible: true, collapsed: true },
      },
      {
        name: "advanced",
        title: "Advanced",
        options: { collapsible: true, collapsed: true },
      },
    ],
    fields,
    preview: {
      select: {
        title: "title",
        description: "description",
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
