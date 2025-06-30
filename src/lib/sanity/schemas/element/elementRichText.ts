import { createBaseElementSchema } from "./baseElementSchema";
import { Rule } from "@sanity/types";
import { GenericComputedFieldsInput } from "../../components/GenericComputedFieldsInput";
import { createLocalizedRichTextFields } from "../../utils/localizationUtils";

const base = createBaseElementSchema(
  "elementRichText",
  "Rich Text Element",
  "richText",
  [
    // Replace single richTextContent with localized version
    createLocalizedRichTextFields("richTextContent", "Rich Text Content", {
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
      imageOptions: { hotspot: true },
      imageFields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility.",
        },
      ],
    }),
  ],
  [],
);

// Remove title and description fields completely for rich text element
base.fields = base.fields.filter(
  (field) =>
    field.name !== "title" &&
    field.name !== "description" &&
    field.name !== "alternativeTitle" &&
    field.name !== "caption",
);

// Update computed fields to use rich text content
base.fields = base.fields.map((field) => {
  if (field.name === "computedFields") {
    return {
      ...field,
      components: { input: GenericComputedFieldsInput },
      options: {
        elementType: "richText",
      },
    };
  }
  return field;
});

// Override preview to use localized rich text content
base.preview = {
  select: {
    richTextContent: "richTextContent",
  } as unknown as typeof base.preview.select,
  prepare({
    richTextContent,
  }: {
    richTextContent?: Record<
      string,
      Array<{ _type: string; children?: Array<{ text?: string }> }>
    >;
  }) {
    // Extract text from localized rich text content for preview
    let displayText = "Untitled Rich Text";

    if (richTextContent && typeof richTextContent === "object") {
      // Try to get content from English first, then fall back to any available language
      const content = richTextContent.en || Object.values(richTextContent)[0];

      if (content && Array.isArray(content)) {
        const textContent = content
          .map((block) => {
            if (block._type === "block" && block.children) {
              return block.children.map((child) => child.text || "").join("");
            }
            return "";
          })
          .join(" ")
          .trim();

        if (textContent) {
          displayText =
            textContent.length > 50
              ? `${textContent.substring(0, 50)}...`
              : textContent;
        }
      }
    }

    return {
      title: displayText,
      subtitle: "Rich Text Element",
      media: undefined,
    };
  },
};

export default base;
