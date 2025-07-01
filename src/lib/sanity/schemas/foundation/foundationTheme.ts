import { Rule } from "@sanity/types";

const foundationTheme = {
  name: "foundationTheme",
  title: "Theme Foundation",
  type: "document",
  fieldsets: [
    {
      name: "main",
      title: "Main",
      options: { collapsible: false, collapsed: false },
    },
    {
      name: "lightMode",
      title: "Light Mode",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "darkMode",
      title: "Dark Mode",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "typography",
      title: "Typography",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "spacing",
      title: "Spacing",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    {
      name: "title",
      title: "Theme Name",
      type: "string",
      validation: (rule: Rule) => rule.required(),
      fieldset: "main",
      description: "Human-readable name for this theme",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      fieldset: "main",
      description: "Brief description of this theme's purpose",
    },
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
      validation: (rule: Rule) => rule.required(),
      fieldset: "main",
    },
    // Light Mode Colors
    {
      name: "lightMode",
      title: "Light Mode",
      type: "object",
      fieldset: "lightMode",
      fields: [
        {
          name: "colors",
          title: "Color Palette",
          type: "object",
          options: { collapsible: false, collapsed: false },
          fields: [
            {
              name: "primary",
              title: "Primary Color",
              type: "string",
              description: "Main brand color (e.g., #000000)",
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
              description: "Supporting brand color",
              validation: (rule: Rule) =>
                rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                  name: "hex-color",
                  invert: false,
                }),
            },
            {
              name: "accent",
              title: "Accent Color",
              type: "string",
              description: "Highlight color for important elements",
              validation: (rule: Rule) =>
                rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                  name: "hex-color",
                  invert: false,
                }),
            },
            {
              name: "background",
              title: "Background Color",
              type: "string",
              description: "Main background color",
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
              description: "Main text color",
              validation: (rule: Rule) =>
                rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                  name: "hex-color",
                  invert: false,
                }),
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
              validation: (rule: Rule) =>
                rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                  name: "hex-color",
                  invert: false,
                }),
            },
            {
              name: "opacity",
              title: "Default Opacity",
              type: "number",
              initialValue: 0.3,
              description: "Default overlay opacity (0-1)",
              validation: (rule: Rule) => rule.required().min(0).max(1),
            },
          ],
        },
      ],
    },
    // Dark Mode Colors
    {
      name: "darkMode",
      title: "Dark Mode",
      type: "object",
      fieldset: "darkMode",
      fields: [
        {
          name: "colors",
          title: "Color Palette",
          type: "object",
          options: { collapsible: false, collapsed: false },
          fields: [
            {
              name: "primary",
              title: "Primary Color",
              type: "string",
              description: "Main brand color (e.g., #ffffff)",
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
              description: "Supporting brand color",
              validation: (rule: Rule) =>
                rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                  name: "hex-color",
                  invert: false,
                }),
            },
            {
              name: "accent",
              title: "Accent Color",
              type: "string",
              description: "Highlight color for important elements",
              validation: (rule: Rule) =>
                rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                  name: "hex-color",
                  invert: false,
                }),
            },
            {
              name: "background",
              title: "Background Color",
              type: "string",
              description: "Main background color",
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
              description: "Main text color",
              validation: (rule: Rule) =>
                rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                  name: "hex-color",
                  invert: false,
                }),
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
              description: "Color for image overlays (e.g., #ffffff)",
              validation: (rule: Rule) =>
                rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                  name: "hex-color",
                  invert: false,
                }),
            },
            {
              name: "opacity",
              title: "Default Opacity",
              type: "number",
              initialValue: 0.3,
              description: "Default overlay opacity (0-1)",
              validation: (rule: Rule) => rule.required().min(0).max(1),
            },
          ],
        },
      ],
    },
    // Typography
    {
      name: "typography",
      title: "Typography",
      type: "object",
      fieldset: "typography",
      fields: [
        {
          name: "headingFont",
          title: "Heading Font",
          type: "string",
          description: "Font family for headings (e.g., 'Inter', 'Roboto')",
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: "bodyFont",
          title: "Body Font",
          type: "string",
          description: "Font family for body text (e.g., 'Inter', 'Roboto')",
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: "customFonts",
          title: "Custom Fonts",
          type: "array",
          of: [{ type: "string" }],
          description: "Additional custom fonts to load",
        },
      ],
    },
    // Spacing
    {
      name: "spacing",
      title: "Spacing",
      type: "object",
      fieldset: "spacing",
      fields: [
        {
          name: "baseUnit",
          title: "Base Unit",
          type: "number",
          initialValue: 4,
          description: "Base spacing unit in pixels",
          validation: (rule: Rule) => rule.required().min(1).max(20),
        },
        {
          name: "scale",
          title: "Scale Factor",
          type: "number",
          initialValue: 1.25,
          description: "Spacing scale factor (1.25 = 1.25x, 1.5 = 1.5x)",
          validation: (rule: Rule) => rule.required().min(1).max(2),
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
      defaultMode: "defaultMode",
    },
    prepare({
      title,
      description,
      defaultMode,
    }: {
      title?: string;
      description?: string;
      defaultMode?: string;
    }) {
      return {
        title: title || "Untitled Theme",
        subtitle: description || `Default: ${defaultMode || "system"}`,
      };
    },
  },
};

export default foundationTheme;
