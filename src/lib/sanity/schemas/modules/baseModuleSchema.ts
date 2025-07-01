import { Rule } from "@sanity/types";

// Base module schema - basic information every module needs
export const createBaseModuleSchema = (
  moduleName: string,
  moduleTitle: string,
  additionalFields: unknown[] = [],
  castingFields?: unknown[],
) => {
  const fields = [
    // Additional fields
    ...additionalFields,
    // Optionally add casting config
    ...(castingFields && castingFields.length > 0
      ? [
          {
            name: "casting",
            title: "Casting Variables",
            type: "object",
            fields: castingFields,
            options: { collapsible: true, collapsed: true },
            description:
              "Which layout/wing variables this module exposes to wings.",
          },
        ]
      : []),
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
