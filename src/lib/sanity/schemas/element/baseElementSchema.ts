import { Rule } from "@sanity/types";
import { mapElementFields } from "../../utils/elementUtils";
import { createElementPreview } from "../../utils/previewUtils";
import { SanityField } from "../../types";
import {
  createLocalizedStringField,
  createLocalizedTextField,
  createLocalizedComputedFields,
} from "../../utils/localizationUtils";
import { GenericComputedFieldsInput } from "../../components/GenericComputedFieldsInput";

export const createImageFields = (
  fieldName: string,
  title: string,
  description?: string,
  fieldset: string = "content",
): SanityField[] => [
  {
    name: `${fieldName}Source`,
    title: `${title} Source`,
    type: "string",
    options: {
      list: [
        { title: "Upload Image", value: "upload" },
        { title: "External URL", value: "external" },
      ],
      layout: "radio",
    },
    fieldset,
    description: `Choose how to provide the ${title.toLowerCase()}`,
  },
  {
    name: `${fieldName}Upload`,
    title: `Upload ${title}`,
    type: "image",
    options: {
      hotspot: true,
      accept: "image/*",
    },
    fieldset,
    hidden: ({ parent }: { parent: Record<string, unknown> }) =>
      parent &&
      typeof parent === "object" &&
      (parent as Record<string, unknown>)[`${fieldName}Source`] !== "upload",
    validation: (rule: Rule) =>
      rule.custom(
        (value: unknown, context: { document?: Record<string, unknown> }) => {
          const sourceField = context.document?.[`${fieldName}Source`];
          if (sourceField === "upload" && !value) {
            return `${title} is required when using upload option`;
          }
          return true;
        },
      ),
  },
  {
    name: `${fieldName}Url`,
    title: `External ${title} URL`,
    type: "url",
    fieldset,
    hidden: ({ parent }: { parent: Record<string, unknown> }) =>
      parent &&
      typeof parent === "object" &&
      (parent as Record<string, unknown>)[`${fieldName}Source`] !== "external",
    validation: (rule: Rule) =>
      rule.custom(
        (value: unknown, context: { document?: Record<string, unknown> }) => {
          const sourceField = context.document?.[`${fieldName}Source`];
          if (sourceField === "external" && !value) {
            return `URL is required when using external option`;
          }
          if (
            value &&
            typeof value === "string" &&
            !value.match(/^https?:\/\//)
          ) {
            return "URL must start with http:// or https://";
          }
          return true;
        },
      ),
  },
];

export const createSvgFields = (
  fieldName: string,
  title: string,
  description?: string,
  fieldset: string = "content",
): SanityField[] => [
  {
    name: `${fieldName}Source`,
    title: `${title} Source`,
    type: "string",
    options: {
      list: [
        { title: "Upload SVG File", value: "upload" },
        { title: "SVG String/Icon", value: "string" },
      ],
      layout: "radio",
    },
    fieldset,
    description: `Choose how to provide the ${title.toLowerCase()}`,
  },
  {
    name: `${fieldName}File`,
    title: `Upload ${title}`,
    type: "file",
    options: {
      accept: ".svg",
    },
    fieldset,
    hidden: ({ parent }: { parent: Record<string, unknown> }) =>
      parent &&
      typeof parent === "object" &&
      (parent as Record<string, unknown>)[`${fieldName}Source`] !== "upload",
    validation: (rule: Rule) =>
      rule.custom(
        (value: unknown, context: { document?: Record<string, unknown> }) => {
          const sourceField = context.document?.[`${fieldName}Source`];
          if (sourceField === "upload" && !value) {
            return `${title} is required when using upload option`;
          }
          return true;
        },
      ),
  },
  {
    name: `${fieldName}String`,
    title: `${title} String/Icon`,
    type: "text",
    description: description || "Enter SVG code, icon name, or path to SVG",
    fieldset,
    hidden: ({ parent }: { parent: Record<string, unknown> }) =>
      parent &&
      typeof parent === "object" &&
      (parent as Record<string, unknown>)[`${fieldName}Source`] !== "string",
    validation: (rule: Rule) =>
      rule.custom(
        (value: unknown, context: { document?: Record<string, unknown> }) => {
          const sourceField = context.document?.[`${fieldName}Source`];
          if (sourceField === "string" && !value) {
            return `${title} string is required when using string option`;
          }
          return true;
        },
      ),
  },
];

export const createSvgField = (
  fieldName: string = "svgIcon",
  title: string = "SVG Icon",
  description?: string,
  fieldset: string = "content",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  description: description || "SVG icon identifier or path",
  fieldset,
});

export const createColorField = (
  fieldName: string = "color",
  title: string = "Color",
  description?: string,
  fieldset: string = "content",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  description: description || "Hex color code (without #) to apply to the SVG",
  fieldset,
  validation: (rule: Rule) =>
    rule
      .regex(/^[0-9A-Fa-f]{6}$/)
      .error("Color must be a valid 6-digit hex code (e.g., FF5733, 582973)"),
});

export const createRecolorField = (
  fieldName: string = "recolor",
  title: string = "Recolor SVG",
  description?: string,
  fieldset: string = "content",
): SanityField => ({
  name: fieldName,
  title,
  type: "boolean",
  description:
    description ||
    "Apply the color to the SVG (unchecked preserves original colors)",
  fieldset,
  initialValue: false,
});

export const createMediaTypeField = (
  fieldName: string = "mediaType",
  title: string = "Media Type",
  description?: string,
  fieldset: string = "content",
  mediaTypes: Array<{ title: string; value: string }> = [
    { title: "SVG Icon", value: "svg" },
    { title: "Image", value: "image" },
  ],
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: mediaTypes,
    layout: "radio",
  },
  fieldset,
  description: description || "Choose the type of media to display",
});

export const createBaseElementSchema = (
  elementName: string,
  elementTitle: string,
  elementType: string,
  contentFields: SanityField[] = [],
  additionalMetadataFields: SanityField[] = [],
  previewConfig?: { subtitleField?: string; mediaField?: string },
) => {
  const baseFields = [
    // Base Information (shown by default, collapsible)
    createLocalizedStringField(
      "title",
      "Title",
      `Short title for the ${elementType} (required)`,
      "basic",
      (rule: Rule) => rule.required(),
    ),
    createLocalizedStringField(
      "description",
      "Description",
      `Brief description of the ${elementType} content (required)`,
      "basic",
      (rule: Rule) => rule.required(),
    ),

    // Content (hidden by default, collapsible)
    ...contentFields,
    ...additionalMetadataFields,
    createLocalizedTextField(
      "caption",
      "Caption",
      `Optional caption text to display below the ${elementType}`,
      "content",
    ),
    createLocalizedStringField(
      "alternativeTitle",
      "Alternative Title",
      `Optional alternative title for display`,
      "content",
    ),

    // Advanced (hidden by default, collapsible)
    {
      name: "customId",
      title: "Custom ID",
      type: "string",
      validation: (rule: Rule) => rule.max(20),
      fieldset: "advanced",
      description: `Custom ID for linking or analytics (auto-generated from Sanity ID if empty)`,
    },
    {
      name: "debug",
      title: "Debug Mode",
      type: "boolean",
      description: "Flag for debugging visibility or test logging",
      initialValue: false,
      fieldset: "advanced",
    },
    {
      name: "computedFields",
      title: "Auto-generated Fields",
      type: "object",
      fieldset: "advanced",
      components: {
        input: GenericComputedFieldsInput,
      },
      description:
        "These fields are automatically computed based on your content",
      fields: createLocalizedComputedFields(),
    },
  ];

  return {
    name: elementName,
    title: elementTitle,
    type: "document",
    fieldsets: [
      {
        name: "basic",
        title: "Base Information",
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
    fields: mapElementFields(baseFields, elementType),
    preview: createElementPreview({
      elementType,
      subtitleField: previewConfig?.subtitleField,
      mediaField: previewConfig?.mediaField,
    }),
  };
};
