import { Rule } from "@sanity/types";
import CastRefInput from "../../components/CastRefInput";
import { createBaseModuleSchema } from "./baseModuleSchema";

// Hero Image module - displays a hero image with positioned elements
export const moduleHeroImage = createBaseModuleSchema(
  "moduleHeroImage",
  "Hero Image Module",
  "heroImage",
  [
    // Background configuration
    {
      name: "background",
      title: "Background",
      type: "object",
      fieldset: "content",
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
      fieldset: "content",
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
  ],
);

export default moduleHeroImage;
