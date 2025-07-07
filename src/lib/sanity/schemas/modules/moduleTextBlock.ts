import { Rule } from "@sanity/types";
import { createBaseModuleSchema } from "./baseModuleSchema";

// Text Block module - displays text content with headlines and body text
export const moduleTextBlock = createBaseModuleSchema(
  "moduleTextBlock",
  "Text Block Module",
  "textBlock",
  [
    // Content elements - text-focused arrays
    {
      name: "content",
      title: "Content",
      type: "object",
      fieldset: "content",
      fields: [
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

export default moduleTextBlock;
