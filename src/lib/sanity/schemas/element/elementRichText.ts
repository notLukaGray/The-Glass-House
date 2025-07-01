import { createBaseElementSchema } from "./baseElementSchema";
import { GenericComputedFieldsInput } from "../../components/GenericComputedFieldsInput";
import { createLocalizedRichTextField } from "../../utils/localizationUtils";

const base = createBaseElementSchema(
  "elementRichText",
  "Rich Text Element",
  "richText",
  [
    // Usage field for categorization
    {
      name: "usage",
      title: "Usage",
      type: "string",
      options: {
        list: [
          { title: "General", value: "" },
          { title: "Hero Description", value: "hero-description" },
        ],
      },
      fieldset: "content",
      description:
        "What this rich text element is used for (helps with organization)",
    },
    // Replace single richTextContent with localized version
    createLocalizedRichTextField(
      "richTextContent",
      "Rich Text Content",
      "Rich text content with formatting options",
      "content",
      (rule) => rule.required(),
    ),
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

export { elementImageCastingFields as elementRichTextCastingFields } from "./elementImage";
