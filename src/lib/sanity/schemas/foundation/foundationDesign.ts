import { Rule } from "@sanity/types";
import { GlassLocalizationInput } from "../../components/GlassLocalizationInput";

const foundationDesign = {
  name: "foundationDesign",
  title: "Design Foundation",
  type: "document",
  description: "Global design system configuration for The Glass House",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Design Foundation",
      readOnly: true,
      hidden: true,
    },

    // Brand Identity
    {
      name: "brandIdentity",
      title: "Brand Identity",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: "siteTitle",
          title: "Site Title",
          type: "glassLocaleString",
          components: { input: GlassLocalizationInput },
          options: { fieldType: "string" },
          validation: (rule: Rule) => rule.required(),
          description: "Main site title for browser tabs and SEO",
        },
        {
          name: "siteDescription",
          title: "Site Description",
          type: "glassLocaleText",
          components: { input: GlassLocalizationInput },
          options: { fieldType: "text" },
          description: "Brief description of the site for SEO",
        },
        {
          name: "logo",
          title: "Logo",
          type: "reference",
          to: [{ type: "elementSVG" }],
          description: "Site logo using SVG element",
        },
        {
          name: "favicon",
          title: "Favicon",
          type: "reference",
          to: [{ type: "elementImage" }],
          description: "Site favicon using image element",
        },
      ],
    },

    // Color System
    {
      name: "colorSystem",
      title: "Color System",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: "primary",
          title: "Primary Color",
          type: "string",
          description: "Main brand color (hex code)",
          validation: (rule: Rule) =>
            rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: "hex-color",
              invert: false,
            }),
        },
        {
          name: "secondary",
          title: "Secondary Color",
          type: "string",
          description: "Supporting brand color (hex code)",
          validation: (rule: Rule) =>
            rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: "hex-color",
              invert: false,
            }),
        },
        {
          name: "accent",
          title: "Accent Color",
          type: "string",
          description: "Highlight color for important elements (hex code)",
          validation: (rule: Rule) =>
            rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: "hex-color",
              invert: false,
            }),
        },
        {
          name: "background",
          title: "Background Color",
          type: "string",
          description: "Main background color (hex code)",
          validation: (rule: Rule) =>
            rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: "hex-color",
              invert: false,
            }),
        },
        {
          name: "text",
          title: "Text Color",
          type: "string",
          description: "Main text color (hex code)",
          validation: (rule: Rule) =>
            rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: "hex-color",
              invert: false,
            }),
        },
        {
          name: "overlay",
          title: "Overlay Color",
          type: "string",
          description: "Color for image overlays (hex code)",
          validation: (rule: Rule) =>
            rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: "hex-color",
              invert: false,
            }),
        },
        {
          name: "overlayOpacity",
          title: "Overlay Opacity",
          type: "number",
          initialValue: 0.3,
          description: "Default overlay opacity (0-1)",
          validation: (rule: Rule) => rule.min(0).max(1),
        },
      ],
    },

    // Typography
    {
      name: "typography",
      title: "Typography",
      type: "object",
      options: { collapsible: true, collapsed: false },
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
              { title: "Montserrat", value: "montserrat" },
              { title: "Poppins", value: "poppins" },
            ],
          },
          initialValue: "system",
          description: "Font for headings and titles",
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
              { title: "Lato", value: "lato" },
              { title: "Source Sans Pro", value: "source-sans-pro" },
            ],
          },
          initialValue: "system",
          description: "Font for body text and paragraphs",
        },
        {
          name: "fontScale",
          title: "Font Scale",
          type: "array",
          description: "Typography scale for consistent sizing",
          of: [
            {
              type: "object",
              name: "fontSize",
              fields: [
                {
                  name: "size",
                  title: "Size Name",
                  type: "string",
                  options: {
                    list: [
                      { title: "Extra Small", value: "xs" },
                      { title: "Small", value: "sm" },
                      { title: "Base", value: "base" },
                      { title: "Large", value: "lg" },
                      { title: "Extra Large", value: "xl" },
                      { title: "2XL", value: "2xl" },
                      { title: "3XL", value: "3xl" },
                      { title: "4XL", value: "4xl" },
                    ],
                  },
                  validation: (rule: Rule) => rule.required(),
                },
                {
                  name: "value",
                  title: "Font Size Value",
                  type: "string",
                  validation: (rule: Rule) => rule.required(),
                },
                {
                  name: "description",
                  title: "Description",
                  type: "string",
                },
              ],
              preview: {
                select: {
                  size: "size",
                  value: "value",
                },
                prepare({ size, value }: { size: string; value: string }) {
                  return {
                    title: `${size}: ${value}`,
                  };
                },
              },
            },
          ],
          initialValue: [
            { size: "xs", value: "0.75rem", description: "12px equivalent" },
            { size: "sm", value: "0.875rem", description: "14px equivalent" },
            { size: "base", value: "1rem", description: "16px equivalent" },
            { size: "lg", value: "1.125rem", description: "18px equivalent" },
            { size: "xl", value: "1.25rem", description: "20px equivalent" },
            { size: "2xl", value: "1.5rem", description: "24px equivalent" },
            { size: "3xl", value: "1.875rem", description: "30px equivalent" },
            { size: "4xl", value: "2.25rem", description: "36px equivalent" },
          ],
        },
      ],
    },

    // Spacing System
    {
      name: "spacingSystem",
      title: "Spacing System",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: "baseUnit",
          title: "Base Spacing Unit",
          type: "string",
          description: 'Base unit for spacing (e.g., "4px" or "0.25rem")',
          initialValue: "4px",
        },
        {
          name: "spacingScale",
          title: "Spacing Scale",
          type: "array",
          description: "Common spacing values used throughout the site",
          of: [
            {
              type: "object",
              name: "spacingSize",
              fields: [
                {
                  name: "size",
                  title: "Size Name",
                  type: "string",
                  options: {
                    list: [
                      { title: "Extra Small", value: "xs" },
                      { title: "Small", value: "sm" },
                      { title: "Medium", value: "md" },
                      { title: "Large", value: "lg" },
                      { title: "Extra Large", value: "xl" },
                      { title: "2XL", value: "2xl" },
                      { title: "3XL", value: "3xl" },
                    ],
                  },
                  validation: (rule: Rule) => rule.required(),
                },
                {
                  name: "value",
                  title: "Spacing Value",
                  type: "string",
                  validation: (rule: Rule) => rule.required(),
                },
                {
                  name: "description",
                  title: "Description",
                  type: "string",
                },
              ],
              preview: {
                select: {
                  size: "size",
                  value: "value",
                },
                prepare({ size, value }: { size: string; value: string }) {
                  return {
                    title: `${size}: ${value}`,
                  };
                },
              },
            },
          ],
          initialValue: [
            { size: "xs", value: "4px", description: "For tight spacing" },
            { size: "sm", value: "8px", description: "For small gaps" },
            { size: "md", value: "16px", description: "For standard spacing" },
            { size: "lg", value: "24px", description: "For larger gaps" },
            { size: "xl", value: "32px", description: "For major spacing" },
            { size: "2xl", value: "48px", description: "For section spacing" },
            {
              size: "3xl",
              value: "64px",
              description: "For page-level spacing",
            },
          ],
        },
      ],
    },

    // SEO Defaults
    {
      name: "seoDefaults",
      title: "SEO Defaults",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: "defaultMetaTitle",
          title: "Default Meta Title",
          type: "glassLocaleString",
          components: { input: GlassLocalizationInput },
          options: { fieldType: "string" },
          description: "Default title for search engines and social sharing",
        },
        {
          name: "defaultMetaDescription",
          title: "Default Meta Description",
          type: "glassLocaleText",
          components: { input: GlassLocalizationInput },
          options: { fieldType: "text" },
          description:
            "Default description for search engines and social sharing",
        },
        {
          name: "defaultSocialImage",
          title: "Default Social Share Image",
          type: "reference",
          to: [{ type: "elementImage" }],
          description: "Default image for social media sharing",
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare() {
      return {
        title: "Design Foundation",
        subtitle: "Global design system configuration",
      };
    },
  },
};

export default foundationDesign;
