import { Rule } from "@sanity/types";
import { createBaseModuleSchema } from "./baseModuleSchema";

// Hero Image module - displays a hero image with text overlay
export const moduleHeroImage = createBaseModuleSchema(
  "moduleHeroImage",
  "Hero Image Module",
  [
    // Hero image specific content fields
    {
      name: "heroContent",
      title: "Hero Content",
      type: "object",
      description: "Content for the hero image module",
      options: { collapsible: false, collapsed: false },
      fields: [
        {
          name: "image",
          title: "Hero Image",
          type: "reference",
          to: [{ type: "elementImage" }],
          description: "Main hero image",
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: "title",
          title: "Hero Title",
          type: "glassLocaleString",
          description: "Main title for the hero section",
        },
        {
          name: "subtitle",
          title: "Hero Subtitle",
          type: "glassLocaleText",
          description: "Subtitle or description for the hero section",
        },
        {
          name: "ctaText",
          title: "Call to Action Text",
          type: "glassLocaleString",
          description: "Text for the call-to-action button",
        },
        {
          name: "ctaLink",
          title: "Call to Action Link",
          type: "url",
          description: "Link for the call-to-action button",
        },
        {
          name: "overlayOpacity",
          title: "Overlay Opacity",
          type: "number",
          min: 0,
          max: 1,
          step: 0.1,
          initialValue: 0.3,
          description:
            "Opacity of the text overlay (0 = transparent, 1 = opaque)",
        },
        {
          name: "textColor",
          title: "Text Color",
          type: "string",
          options: {
            list: [
              { title: "White", value: "white" },
              { title: "Black", value: "black" },
              { title: "Primary", value: "primary" },
              { title: "Secondary", value: "secondary" },
            ],
          },
          initialValue: "white",
          description: "Color of the text overlay",
        },
      ],
    },
  ],
);
