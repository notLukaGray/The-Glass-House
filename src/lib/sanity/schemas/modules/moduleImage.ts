import { Rule } from "@sanity/types";
import { createBaseModuleSchema } from "./baseModuleSchema";

// Image module - displays images with optional captions
export const moduleImage = createBaseModuleSchema(
  "moduleImage",
  "Image Module",
  "image",
  [
    // Content elements - image-focused arrays
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
          name: "captions",
          title: "Captions",
          type: "array",
          of: [{ type: "castRefBodyTextObject" }],
          description: "Array of caption text elements with casting variables",
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

export default moduleImage;
