import { Rule } from "@sanity/types";
import CastRefInput from "../../components/CastRefInput";
import { GenericComputedFieldsInput } from "../../components/GenericComputedFieldsInput";
import { createLocalizedComputedFields } from "../../utils/localizationUtils";

// Hero Image module - displays a hero image with positioned elements
export const moduleHeroImage = {
  name: "moduleHeroImage",
  title: "Hero Image Module",
  type: "document",
  fields: [
    // Module metadata and identification
    {
      name: "meta",
      title: "Module Information",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        // Module Title (localized, required)
        {
          name: "moduleTitle",
          title: "Module Title",
          type: "glassLocaleString",
          description: "Internal title for this module (localized)",
          validation: (rule: Rule) => rule.required(),
        },
        // Module Description (localized, required)
        {
          name: "description",
          title: "Module Description",
          type: "glassLocaleText",
          description: "Brief description of what this module does (localized)",
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: "moduleTags",
          title: "Module Tags",
          type: "array",
          of: [{ type: "string" }],
          description: "Tags for categorizing and filtering modules",
        },
      ],
    },
    // Background configuration
    {
      name: "background",
      title: "Background",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: "type",
          title: "Background Type",
          type: "string",
          options: {
            list: [
              { title: "Color", value: "color" },
              { title: "Gradient", value: "gradient" },
              { title: "Image", value: "image" },
            ],
            layout: "radio",
          },
          description: "Choose the type of background for this hero module",
        },
        // Color background
        {
          name: "color",
          title: "Background Color",
          type: "string",
          description:
            "Background color with transparency (hex format: FFFFFFFF)",
          hidden: ({ parent }: { parent: Record<string, unknown> }) =>
            parent &&
            typeof parent === "object" &&
            (parent as Record<string, unknown>).type !== "color",
        },
        // Gradient background
        {
          name: "gradientType",
          title: "Gradient Type",
          type: "string",
          options: {
            list: [
              { title: "Linear", value: "linear" },
              { title: "Radial", value: "radial" },
              { title: "Conic", value: "conic" },
            ],
          },
          description: "Type of gradient to apply",
          hidden: ({ parent }: { parent: Record<string, unknown> }) =>
            parent &&
            typeof parent === "object" &&
            (parent as Record<string, unknown>).type !== "gradient",
        },
        {
          name: "gradientColor1",
          title: "Gradient Color 1",
          type: "string",
          description: "First gradient color (hex format: FFFFFFFF)",
          hidden: ({ parent }: { parent: Record<string, unknown> }) =>
            parent &&
            typeof parent === "object" &&
            (parent as Record<string, unknown>).type !== "gradient",
        },
        {
          name: "gradientColor2",
          title: "Gradient Color 2",
          type: "string",
          description: "Second gradient color (hex format: FFFFFFFF)",
          hidden: ({ parent }: { parent: Record<string, unknown> }) =>
            parent &&
            typeof parent === "object" &&
            (parent as Record<string, unknown>).type !== "gradient",
        },
        // Image background
        {
          name: "image",
          title: "Background Image",
          type: "object",
          fields: [
            {
              name: "ref",
              type: "reference",
              to: [{ type: "elementImage" }],
              description: "Main hero background image",
              validation: (rule: Rule) => rule.required(),
            },
            {
              name: "casting",
              type: "object",
              fields: [{ name: "hiddenDummy", type: "string", hidden: true }],
            },
          ],
          components: { input: CastRefInput },
          hidden: ({ parent }: { parent: Record<string, unknown> }) =>
            parent &&
            typeof parent === "object" &&
            (parent as Record<string, unknown>).type !== "image",
        },
      ],
    },
    // Content elements
    {
      name: "content",
      title: "Content",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: "images",
          title: "Images",
          type: "array",
          of: [{ type: "castRefImageObject" }],
          description: "Array of image elements with casting variables",
        },
        {
          name: "headlines",
          title: "Headlines",
          type: "array",
          of: [{ type: "castRefHeadlineObject" }],
          description: "Array of headline elements with casting variables",
        },
        {
          name: "bodyText",
          title: "Body Text",
          type: "array",
          of: [{ type: "castRefBodyTextObject" }],
          description: "Array of body text elements with casting variables",
        },
        {
          name: "buttons",
          title: "Buttons",
          type: "array",
          of: [{ type: "castRefButtonObject" }],
          description: "Array of button elements with casting variables",
        },
        {
          name: "vectors",
          title: "Vectors",
          type: "array",
          of: [{ type: "castRefVectorObject" }],
          description: "Array of vector elements with casting variables",
        },
      ],
    },
    // Custom ID (auto-generated, editable)
    {
      name: "customId",
      title: "Custom ID",
      type: "string",
      validation: (rule: Rule) => rule.max(20),
      fieldset: "advanced",
      description:
        "Custom ID for linking or analytics (auto-generated from Sanity ID if empty)",
    },
    {
      name: "debug",
      title: "Debug Mode",
      type: "boolean",
      initialValue: false,
      fieldset: "advanced",
      description: "Enable debug information for this module",
    },
    // Computed fields (auto-generated ARIA and alt text)
    {
      name: "computedFields",
      title: "Auto-generated Fields",
      type: "object",
      fieldset: "advanced",
      options: {
        elementType: "moduleHeroImage",
      },
      components: {
        input: GenericComputedFieldsInput,
      },
      description:
        "These fields are automatically computed based on your module title and description",
      fields: createLocalizedComputedFields(),
    },
  ],
  fieldsets: [
    {
      name: "advanced",
      title: "Advanced",
      options: { collapsible: true, collapsed: true },
    },
  ],
  preview: {
    select: {
      title: "meta.moduleTitle",
      description: "meta.description",
      customId: "customId",
    },
    prepare({
      title,
      description,
      customId,
    }: {
      title?: Record<string, string>;
      description?: Record<string, string>;
      customId?: string;
    }) {
      const displayTitle = title?.en || "Untitled Hero Image Module";
      const displayDescription = description?.en || "No description";
      const idSuffix = customId ? ` (ID: ${customId})` : "";

      return {
        title: `Hero Image Module: ${displayTitle}${idSuffix}`,
        subtitle: displayDescription,
      };
    },
  },
};
