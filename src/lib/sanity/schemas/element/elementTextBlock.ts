import { createBaseElementSchema } from "./baseElementSchema";
import { Rule } from "@sanity/types";
import { GlassLocalizationInput } from "../../components/GlassLocalizationInput";
import { GenericComputedFieldsInput } from "../../components/GenericComputedFieldsInput";
import { typographyObject, typographyFieldset } from "../objects/typography";

// Import the SanityField type from base schema
interface SanityField {
  name: string;
  title: string;
  type: string;
  fieldset?: string;
  validation?: (rule: Rule) => Rule;
  description?: string;
  options?: Record<string, unknown>;
  hidden?: (params: { parent: Record<string, unknown> }) => boolean;
  components?: Record<string, unknown>;
  readOnly?: boolean;
  fields?: SanityField[];
  initialValue?: unknown;
  of?: SanityField[];
}

const base = createBaseElementSchema(
  "elementTextBlock",
  "Text Block",
  "text",
  [
    // Rich text toggle - first field for easy access
    {
      name: "richText",
      title: "Enable Rich Text",
      type: "object",
      fieldset: "content",
      description:
        "Enable rich text editor for complex formatting (links, lists, etc.)",
      fields: [
        {
          name: "enabled",
          title: "Enable Rich Text",
          type: "boolean",
          initialValue: false,
        },
      ],
    },
    // Text content - simple text when richText is false
    {
      name: "text",
      title: "Text Content",
      type: "glassLocalization",
      validation: (rule: Rule) => rule.required(),
      fieldset: "content",
      description: "Text content (simple text mode)",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        (parent?.richText as { enabled?: boolean })?.enabled === true,
    },
    // Rich text content - when richText is true
    {
      name: "richTextContent",
      title: "Rich Text Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 1", value: "h1" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Heading 5", value: "h5" },
            { title: "Heading 6", value: "h6" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
            annotations: [
              {
                title: "URL",
                name: "link",
                type: "object",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                    validation: (rule: Rule) => rule.required(),
                  },
                  {
                    title: "Open in new tab",
                    name: "blank",
                    type: "boolean",
                    initialValue: true,
                  },
                ],
              },
            ],
          },
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            },
          ],
        },
      ],
      fieldset: "content",
      description: "Rich text content with formatting, links, and images",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        (parent?.richText as { enabled?: boolean })?.enabled !== true,
    } as unknown as SanityField,
    // Shared typography object - hidden when rich text is enabled
    {
      ...typographyObject,
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        (parent?.richText as { enabled?: boolean })?.enabled === true,
    },
  ],
  [],
);

// Add typography fieldset to the base schema
base.fieldsets = [...base.fieldsets, typographyFieldset];

// Override fields to remove unnecessary ones and keep only what we need
base.fields = base.fields.filter(
  (field) =>
    // Keep content fields (richText, text, richTextContent)
    field.fieldset === "content" ||
    // Keep typography field
    field.name === "typography" ||
    // Keep computed fields (auto-generated accessibility)
    field.name === "computedFields" ||
    // Keep debug field
    field.name === "debug" ||
    // Keep custom ID
    field.name === "customId",
);

// Convert localeString fields to glassLocalization and update computed fields
base.fields = base.fields.map((field) => {
  if (
    field.name === "title" ||
    field.name === "description" ||
    field.name === "alternativeTitle" ||
    field.name === "caption"
  ) {
    return {
      ...field,
      type: "glassLocalization",
      components: { input: GlassLocalizationInput },
      options: undefined,
      description: undefined,
    };
  }
  if (field.name === "computedFields") {
    return {
      ...field,
      components: { input: GenericComputedFieldsInput },
      options: {
        elementType: "textBlock",
      },
    };
  }
  return field;
});

// Override preview to use text field
base.preview = {
  select: {
    title: "text.en",
    alternativeTitle: "text.es",
    description: "text.en",
    subtitle: "text",
    media: "text",
  },
  prepare({
    title,
    alternativeTitle,
    description,
  }: {
    title?: string;
    alternativeTitle?: string;
    description?: string;
  }) {
    const displayText =
      title || alternativeTitle || description || "Untitled Text Block";

    return {
      title: displayText,
      subtitle: "Text Block",
      media: undefined,
    };
  },
};

export default base;
