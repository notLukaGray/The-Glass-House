import { createBaseElementSchema } from "./baseElementSchema";
import { Rule } from "@sanity/types";

const base = createBaseElementSchema(
  "elementDivider",
  "Divider Element",
  "divider",
  [
    // Divider style options
    {
      name: "style",
      title: "Divider Style",
      type: "string",
      options: {
        list: [
          { title: "Solid Line", value: "solid" },
          { title: "Dashed Line", value: "dashed" },
          { title: "Dotted Line", value: "dotted" },
          { title: "Double Line", value: "double" },
          { title: "Custom SVG", value: "custom" },
        ],
        layout: "radio",
      },
      initialValue: "solid",
      fieldset: "content",
      description: "Visual style of the divider line",
      validation: (rule: Rule) => rule.required(),
    },
    // Thickness of the divider
    {
      name: "thickness",
      title: "Thickness",
      type: "number",
      initialValue: 1,
      fieldset: "content",
      description: "Thickness of the divider line in pixels",
      validation: (rule: Rule) => rule.min(1).max(20),
    },
    // Spacing around the divider
    {
      name: "spacing",
      title: "Spacing",
      type: "object",
      fieldset: "content",
      description: "Spacing above and below the divider",
      fields: [
        {
          name: "top",
          title: "Top Spacing",
          type: "number",
          initialValue: 16,
          description: "Spacing above the divider in pixels",
        },
        {
          name: "bottom",
          title: "Bottom Spacing",
          type: "number",
          initialValue: 16,
          description: "Spacing below the divider in pixels",
        },
      ],
    },
    // Color override (optional, falls back to theme)
    {
      name: "color",
      title: "Color Override",
      type: "string",
      fieldset: "content",
      description:
        "Optional color override (hex format: FFFFFFFF). Leave empty to use theme color.",
      validation: (rule: Rule) =>
        rule
          .regex(/^[0-9A-Fa-f]{8}$/)
          .error("Color must be a valid 8-digit hex code (e.g., FFFFFFFF)"),
    },
    // Length of the divider
    {
      name: "length",
      title: "Length",
      type: "string",
      options: {
        list: [
          { title: "Full Width", value: "full" },
          { title: "Contained", value: "contained" },
          { title: "Short", value: "short" },
          { title: "Custom", value: "custom" },
        ],
        layout: "radio",
      },
      initialValue: "full",
      fieldset: "content",
      description: "Length of the divider line",
    },
    // Custom width for custom length
    {
      name: "customWidth",
      title: "Custom Width",
      type: "number",
      fieldset: "content",
      description: "Custom width in pixels (only used when length is 'custom')",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent &&
        typeof parent === "object" &&
        (parent as Record<string, unknown>).length !== "custom",
    },
    // Custom SVG for custom style
    {
      name: "customSVG",
      title: "Custom SVG",
      type: "text",
      fieldset: "content",
      description:
        "Custom SVG code for the divider (only used when style is 'custom')",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent &&
        typeof parent === "object" &&
        (parent as Record<string, unknown>).style !== "custom",
    },
  ],
  [],
);

// Override preview to use title field
base.preview = {
  select: {
    title: "title",
    alternativeTitle: "style",
    description: "description",
    subtitle: "title",
    media: "title",
  },
  prepare({
    title,
    alternativeTitle,
    description,
  }: {
    title?: Record<string, string>;
    alternativeTitle?: string;
    description?: Record<string, string>;
  }) {
    const displayTitle = title?.en || title?.es || "Untitled Divider";
    const displayDescription =
      description?.en || description?.es || "Divider Element";
    const styleSuffix = alternativeTitle ? ` (${alternativeTitle})` : "";

    return {
      title: `${displayTitle}${styleSuffix}`,
      subtitle: displayDescription,
      media: undefined,
    };
  },
};

export default base;

export const elementDividerCastingFields = [
  {
    name: "styling",
    title: "Styling",
    type: "object",
    fields: [
      {
        name: "color",
        title: "Color Override",
        type: "string",
        description: "Hex color code (e.g., FFFFFFFF)",
        validation: (rule: Rule) =>
          rule
            .regex(/^[0-9A-Fa-f]{8}$/)
            .error("Color must be a valid 8-digit hex code"),
      },
      {
        name: "opacity",
        title: "Opacity",
        type: "number",
        min: 0,
        max: 100,
        step: 1,
        initialValue: 100,
        description: "Opacity percentage (0-100)",
      },
      {
        name: "zIndex",
        title: "Z-Index",
        type: "number",
        initialValue: 0,
        description: "Stacking order",
      },
    ],
  },
  {
    name: "layout",
    title: "Layout",
    type: "object",
    fields: [
      {
        name: "width",
        title: "Width",
        type: "object",
        fields: [
          { name: "value", title: "Value", type: "number" },
          {
            name: "unit",
            title: "Unit",
            type: "string",
            options: {
              list: [
                { title: "px", value: "px" },
                { title: "%", value: "%" },
              ],
            },
            initialValue: "px",
          },
        ],
      },
      {
        name: "alignment",
        title: "Alignment",
        type: "string",
        options: {
          list: [
            { title: "Left", value: "left" },
            { title: "Center", value: "center" },
            { title: "Right", value: "right" },
          ],
        },
        initialValue: "center",
      },
    ],
  },
];
