import React, { useMemo, useEffect } from "react";
import { useFormValue, useDocumentOperation } from "sanity";
import { Card, Stack, Text } from "@sanity/ui";
import { getElementTypeFromDocument } from "../utils/elementUtils";

interface ComputedFieldsInputProps {
  onChange?: (patch: PatchEvent) => void;
  elementType?: string;
  options?: {
    elementType?: string;
  };
}

interface PatchEvent {
  patches: unknown[];
}

interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
}

interface PortableTextBlock {
  _type: "block";
  _key: string;
  style: string;
  children: PortableTextSpan[];
  markDefs: unknown[];
}

interface PortableTextImage {
  _type: "image";
  _key: string;
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

type PortableTextContent = PortableTextBlock | PortableTextImage;

interface SanityDocument {
  [key: string]: unknown;
  title?: Record<string, string>;
  description?: Record<string, string>;
  alternativeTitle?: Record<string, string>;
  caption?: Record<string, string>;
  text?: Record<string, string>;
  richText?: { enabled?: boolean };
  richTextContent?: PortableTextContent[];
  ariaLabel?: Record<string, string>;
  altText?: Record<string, string>;
}

interface GenerationRule {
  ariaLabel: {
    prefix?: string;
    sourceField: string;
    isRichText?: boolean;
  };
  altText: {
    prefix?: string;
    sourceField: string;
    isRichText?: boolean;
  };
}

// Function to extract plain text from Portable Text blocks
const extractTextFromRichText = (
  richTextContent: PortableTextContent[],
): string => {
  if (!Array.isArray(richTextContent)) return "";

  return richTextContent
    .map((block) => {
      if (block._type === "block") {
        // Extract text from block children
        return (
          block.children
            ?.map((child: PortableTextSpan) => {
              if (child._type === "span") {
                return child.text || "";
              }
              return "";
            })
            .join("") || ""
        );
      }
      return "";
    })
    .join(" ")
    .trim();
};

const GENERATION_RULES: Record<string, GenerationRule> = {
  image: {
    ariaLabel: {
      prefix: "Image: ",
      sourceField: "title",
    },
    altText: {
      prefix: "",
      sourceField: "description",
    },
  },
  text: {
    ariaLabel: {
      prefix: "",
      sourceField: "text",
    },
    altText: {
      prefix: "",
      sourceField: "text",
    },
  },
  textBlock: {
    ariaLabel: {
      prefix: "",
      sourceField: "text",
      isRichText: false,
    },
    altText: {
      prefix: "",
      sourceField: "text",
      isRichText: false,
    },
  },
  video: {
    ariaLabel: {
      prefix: "Video: ",
      sourceField: "title",
    },
    altText: {
      prefix: "",
      sourceField: "description",
    },
  },
  default: {
    ariaLabel: {
      prefix: "",
      sourceField: "title",
    },
    altText: {
      prefix: "",
      sourceField: "description",
    },
  },
};

// Utility for shallow equality of computed fields
function shallowEqual(
  objA: Record<string, Record<string, string>> | null | undefined,
  objB: Record<string, Record<string, string>> | null | undefined,
) {
  if (objA === objB) return true;
  if (!objA || !objB) return false;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (objA[key] !== objB[key]) return false;
  }
  return true;
}

export const GenericComputedFieldsInput: React.FC<ComputedFieldsInputProps> = (
  props,
) => {
  const documentData = useFormValue([]) as SanityDocument;
  const documentId = documentData?._id as string;
  const publishedId = documentId?.startsWith("drafts.")
    ? documentId.replace("drafts.", "")
    : documentId;
  const { patch } = useDocumentOperation(publishedId, "patch");

  const elementType =
    getElementTypeFromDocument(documentData?._type as string) ||
    props.options?.elementType ||
    props.elementType ||
    "default";

  const rule = useMemo(
    () =>
      GENERATION_RULES[elementType.toLowerCase()] || GENERATION_RULES.default,
    [elementType],
  );

  const computedFields = useMemo(() => {
    if (!documentData) return { ariaLabel: {}, altText: {} };

    const ariaSourceField = rule.ariaLabel.sourceField;
    const altSourceField = rule.altText.sourceField;

    // Special handling for textBlock element type
    if (elementType === "textBlock") {
      const richTextEnabled = documentData.richText?.enabled;

      if (richTextEnabled) {
        // Use rich text content and extract plain text
        const richTextContent =
          documentData.richTextContent as PortableTextContent[];
        const extractedText = extractTextFromRichText(richTextContent);

        return {
          ariaLabel: { en: extractedText || "Text block content" },
          altText: { en: extractedText || "Text block content" },
        };
      } else {
        // Use simple text field with localization
        const textValue = documentData.text as
          | Record<string, string>
          | undefined;

        const langs = new Set<string>();
        if (textValue && typeof textValue === "object") {
          Object.keys(textValue).forEach((lang) => {
            if (lang !== "_type") langs.add(lang);
          });
        }
        langs.add("en");

        const ariaLabel: { [lang: string]: string } = {};
        const altText: { [lang: string]: string } = {};

        Array.from(langs).forEach((lang) => {
          const text =
            textValue?.[lang] || textValue?.en || "Text block content";
          ariaLabel[lang] = text;
          altText[lang] = text;
        });

        return { ariaLabel, altText };
      }
    }

    // Standard handling for other element types
    const ariaSourceValue = documentData[ariaSourceField] as
      | Record<string, string>
      | undefined;
    const altSourceValue = documentData[altSourceField] as
      | Record<string, string>
      | undefined;

    const langs = new Set<string>();

    if (ariaSourceValue && typeof ariaSourceValue === "object") {
      Object.keys(ariaSourceValue).forEach((lang) => {
        if (lang !== "_type") langs.add(lang);
      });
    }

    if (altSourceValue && typeof altSourceValue === "object") {
      Object.keys(altSourceValue).forEach((lang) => {
        if (lang !== "_type") langs.add(lang);
      });
    }

    langs.add("en");

    const ariaLabel: { [lang: string]: string } = {};
    const altText: { [lang: string]: string } = {};

    Array.from(langs).forEach((lang) => {
      if (ariaSourceValue && ariaSourceValue[lang]) {
        const sourceText = ariaSourceValue[lang];
        ariaLabel[lang] = rule.ariaLabel.prefix
          ? `${rule.ariaLabel.prefix}${sourceText}`
          : sourceText;
      } else {
        ariaLabel[lang] = rule.ariaLabel.prefix
          ? `${rule.ariaLabel.prefix}${elementType} content`
          : `${elementType} content`;
      }

      if (altSourceValue && altSourceValue[lang]) {
        const sourceText = altSourceValue[lang];
        altText[lang] = rule.altText.prefix
          ? `${rule.altText.prefix}${sourceText}`
          : sourceText;
      } else {
        altText[lang] = rule.altText.prefix
          ? `${rule.altText.prefix}${elementType} content`
          : `${elementType} content`;
      }
    });

    return { ariaLabel, altText };
  }, [documentData, rule, elementType]);

  useEffect(() => {
    if (
      !documentData ||
      !documentData._id ||
      !patch ||
      typeof patch.execute !== "function"
    )
      return;

    const current =
      ((documentData as Record<string, unknown>).computedFields as {
        ariaLabel: Record<string, string>;
        altText: Record<string, string>;
      }) || {};

    // Only patch if different
    if (!shallowEqual(current, computedFields)) {
      try {
        patch.execute([{ set: { computedFields } }]);
      } catch (error) {
        console.warn("Failed to patch computedFields:", error);
      }
    }
  }, [computedFields, documentData, patch]);

  if (!documentData) {
    return (
      <Card padding={3} tone="caution">
        <Text>Loading document data...</Text>
      </Card>
    );
  }

  return (
    <Stack space={3}>
      <Text size={1} muted>
        Auto-generated fields based on your content:
      </Text>
      {Object.entries(computedFields).map(([fieldName, langValues]) => (
        <Card key={fieldName} padding={3} border radius={2}>
          <Stack space={2}>
            <Text weight="semibold" size={1}>
              {fieldName === "ariaLabel" ? "ARIA Label" : "Alt Text"}
            </Text>
            {Object.entries(langValues).map(([lang, computedValue]) => {
              if (!computedValue) return null;
              return (
                <Card key={lang} padding={2} border radius={1}>
                  <Stack space={2}>
                    <Text
                      size={0}
                      weight="semibold"
                      style={{ textTransform: "uppercase" }}
                    >
                      {lang}
                    </Text>
                    <Text size={1}>{computedValue}</Text>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};
