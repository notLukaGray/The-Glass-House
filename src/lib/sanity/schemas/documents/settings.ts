import { Rule } from "@sanity/types";
import { GlassLocalizationInput } from "../../components/GlassLocalizationInput";

const settings = {
  name: "siteSettings",
  title: "Website Settings",
  type: "document",
  fields: [
    // Basic Site Info
    {
      name: "basicInfo",
      title: "Basic Information",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: "title",
          title: "Website Title",
          type: "string",
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          name: "description",
          title: "Website Description",
          type: "string",
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          name: "favicon",
          title: "Favicon",
          type: "reference",
          // Temporarily commented out since assetPhoto schema is not loaded
          // to: [{ type: "assetPhoto" }],
          to: [],
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          name: "logo",
          title: "Logo",
          type: "reference",
          // Temporarily commented out since assetSVG schema is not loaded
          // to: [{ type: "assetSVG" }],
          to: [],
          validation: (Rule: Rule) => Rule.required(),
        },
      ],
    },

    // Theme Settings
    {
      name: "theme",
      title: "Theme Settings",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: "defaultMode",
          title: "Default Theme Mode",
          type: "string",
          options: {
            list: [
              { title: "Light", value: "light" },
              { title: "Dark", value: "dark" },
              { title: "System", value: "system" },
            ],
          },
          initialValue: "system",
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          name: "lightMode",
          title: "Light Mode",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            {
              name: "colors",
              title: "Color Palette",
              type: "object",
              options: { collapsible: true, collapsed: false },
              fields: [
                {
                  name: "primary",
                  title: "Primary Color",
                  type: "string",
                  description: "Main brand color (e.g., #000000)",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
                {
                  name: "secondary",
                  title: "Secondary Color",
                  type: "string",
                  description: "Supporting brand color",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
                {
                  name: "accent",
                  title: "Accent Color",
                  type: "string",
                  description: "Highlight color for important elements",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
                {
                  name: "background",
                  title: "Background Color",
                  type: "string",
                  description: "Main background color",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
                {
                  name: "text",
                  title: "Text Color",
                  type: "string",
                  description: "Main text color",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
              ],
            },
            {
              name: "overlays",
              title: "Overlay Settings",
              type: "object",
              options: { collapsible: true, collapsed: true },
              fields: [
                {
                  name: "color",
                  title: "Overlay Color",
                  type: "string",
                  description: "Color for image overlays (e.g., #000000)",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
                {
                  name: "opacity",
                  title: "Default Opacity",
                  type: "number",
                  initialValue: 0.3,
                  description: "Default overlay opacity (0-1)",
                  validation: (Rule: Rule) => Rule.required().min(0).max(1),
                },
              ],
            },
          ],
        },
        {
          name: "darkMode",
          title: "Dark Mode",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            {
              name: "colors",
              title: "Color Palette",
              type: "object",
              options: { collapsible: true, collapsed: false },
              fields: [
                {
                  name: "primary",
                  title: "Primary Color",
                  type: "string",
                  description: "Main brand color (e.g., #000000)",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
                {
                  name: "secondary",
                  title: "Secondary Color",
                  type: "string",
                  description: "Supporting brand color",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
                {
                  name: "accent",
                  title: "Accent Color",
                  type: "string",
                  description: "Highlight color for important elements",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
                {
                  name: "background",
                  title: "Background Color",
                  type: "string",
                  description: "Main background color",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
                {
                  name: "text",
                  title: "Text Color",
                  type: "string",
                  description: "Main text color",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
              ],
            },
            {
              name: "overlays",
              title: "Overlay Settings",
              type: "object",
              options: { collapsible: true, collapsed: true },
              fields: [
                {
                  name: "color",
                  title: "Overlay Color",
                  type: "string",
                  description: "Color for image overlays (e.g., #000000)",
                  validation: (Rule: Rule) =>
                    Rule.required().regex(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      {
                        name: "hex-color",
                        invert: false,
                      },
                    ),
                },
                {
                  name: "opacity",
                  title: "Default Opacity",
                  type: "number",
                  initialValue: 0.3,
                  description: "Default overlay opacity (0-1)",
                  validation: (Rule: Rule) => Rule.required().min(0).max(1),
                },
              ],
            },
          ],
        },
        {
          name: "typography",
          title: "Typography",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            {
              name: "headingFont",
              title: "Heading Font",
              type: "string",
              options: {
                list: [
                  { title: "System Default", value: "system" },
                  { title: "Inter", value: "inter" },
                  { title: "Roboto", value: "roboto" },
                  { title: "Open Sans", value: "open-sans" },
                ],
              },
              initialValue: "system",
              description: "Font for headings and titles",
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: "bodyFont",
              title: "Body Font",
              type: "string",
              options: {
                list: [
                  { title: "System Default", value: "system" },
                  { title: "Inter", value: "inter" },
                  { title: "Roboto", value: "roboto" },
                  { title: "Open Sans", value: "open-sans" },
                ],
              },
              initialValue: "system",
              description: "Font for body text and paragraphs",
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: "customFonts",
              title: "Custom Fonts",
              type: "text",
              description: `To add custom fonts:
1. Add your font files to the /public/fonts directory
2. Import them in your layout.tsx file
3. Add the font family name to your tailwind.config.js
Example:
@font-face {
  font-family: 'YourFont';
  src: url('/fonts/your-font.woff2') format('woff2');
}`,
              rows: 6,
            },
          ],
        },
        {
          name: "spacing",
          title: "Spacing Scale",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            {
              name: "baseUnit",
              title: "Base Spacing Unit",
              type: "string",
              description: 'Base unit for spacing (e.g., "4px" or "0.25rem")',
              initialValue: "4px",
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: "spacingScale",
              title: "Spacing Scale",
              type: "object",
              description: "Common spacing values used throughout the site",
              fields: [
                {
                  name: "xs",
                  title: "Extra Small",
                  type: "string",
                  description: "For tight spacing (e.g., 4px)",
                  initialValue: "4px",
                  validation: (Rule: Rule) => Rule.required(),
                },
                {
                  name: "sm",
                  title: "Small",
                  type: "string",
                  description: "For small gaps (e.g., 8px)",
                  initialValue: "8px",
                  validation: (Rule: Rule) => Rule.required(),
                },
                {
                  name: "md",
                  title: "Medium",
                  type: "string",
                  description: "For standard spacing (e.g., 16px)",
                  initialValue: "16px",
                  validation: (Rule: Rule) => Rule.required(),
                },
                {
                  name: "lg",
                  title: "Large",
                  type: "string",
                  description: "For larger gaps (e.g., 24px)",
                  initialValue: "24px",
                  validation: (Rule: Rule) => Rule.required(),
                },
                {
                  name: "xl",
                  title: "Extra Large",
                  type: "string",
                  description: "For major spacing (e.g., 32px)",
                  initialValue: "32px",
                  validation: (Rule: Rule) => Rule.required(),
                },
              ],
            },
          ],
        },
      ],
    },

    // SEO Settings
    {
      name: "seo",
      title: "SEO Settings",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: "metaTitle",
          title: "Default Meta Title",
          type: "glassLocaleString",
          components: { input: GlassLocalizationInput },
          options: {
            fieldType: "string",
          },
          description: "Default title for search engines and social sharing",
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          name: "metaDescription",
          title: "Default Meta Description",
          type: "glassLocaleString",
          components: { input: GlassLocalizationInput },
          options: {
            fieldType: "string",
          },
          description:
            "Default description for search engines and social sharing",
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          name: "ogImage",
          title: "Default Social Share Image",
          type: "reference",
          // Temporarily commented out since assetPhoto schema is not loaded
          // to: [{ type: "assetPhoto" }],
          to: [],
          description: "Default image for social media sharing",
          validation: (Rule: Rule) => Rule.required(),
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "basicInfo.title",
    },
    prepare({ title }: { title?: string }) {
      return {
        title: title || "Website Settings",
      };
    },
  },
};

export default settings;
