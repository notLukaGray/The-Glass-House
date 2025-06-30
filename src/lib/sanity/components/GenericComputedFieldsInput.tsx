import React, { useMemo, useEffect, useRef } from "react";
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
  svg: {
    ariaLabel: {
      prefix: "SVG: ",
      sourceField: "title",
    },
    altText: {
      prefix: "",
      sourceField: "description",
    },
  },
  textSingleLine: {
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
  richText: {
    ariaLabel: {
      prefix: "",
      sourceField: "richTextContent",
      isRichText: true,
    },
    altText: {
      prefix: "",
      sourceField: "richTextContent",
      isRichText: true,
    },
  },
  button: {
    ariaLabel: {
      prefix: "Button: ",
      sourceField: "title",
    },
    altText: {
      prefix: "",
      sourceField: "title",
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

// Utility for deep equality of computed fields
function deepEqual(
  objA: Record<string, Record<string, string>> | null | undefined,
  objB: Record<string, Record<string, string>> | null | undefined,
) {
  if (objA === objB) return true;
  if (!objA || !objB) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    const valA = objA[key];
    const valB = objB[key];

    if (typeof valA !== typeof valB) return false;

    if (typeof valA === "object" && valA !== null && valB !== null) {
      const valAKeys = Object.keys(valA);
      const valBKeys = Object.keys(valB);

      if (valAKeys.length !== valBKeys.length) return false;

      for (const subKey of valAKeys) {
        if (valA[subKey] !== valB[subKey]) return false;
      }
    } else if (valA !== valB) {
      return false;
    }
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
  const previousComputedFields = useRef<Record<
    string,
    Record<string, string>
  > | null>(null);

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

    // Special handling for richText element type
    if (elementType === "richText") {
      const richTextContent =
        documentData.richTextContent as PortableTextContent[];
      const extractedText = extractTextFromRichText(richTextContent);

      return {
        ariaLabel: { en: extractedText || "Rich text content" },
        altText: { en: extractedText || "Rich text content" },
      };
    }

    // Special handling for textBlock element type
    if (elementType === "textBlock") {
      const textValue = documentData.text as Record<string, string> | undefined;

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
        const text = textValue?.[lang] || textValue?.en || "Text block content";
        ariaLabel[lang] = text;
        altText[lang] = text;
      });

      return { ariaLabel, altText };
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
        // Better default values based on element type
        let defaultText = `${elementType} content`;
        if (elementType === "button") {
          defaultText = "Interactive button";
        } else if (elementType === "image") {
          defaultText = "Image content";
        } else if (elementType === "video") {
          defaultText = "Video content";
        } else if (elementType === "textBlock") {
          defaultText = "Text content";
        } else if (elementType === "richText") {
          defaultText = "Rich text content";
        }

        ariaLabel[lang] = rule.ariaLabel.prefix
          ? `${rule.ariaLabel.prefix}${defaultText}`
          : defaultText;
      }

      if (altSourceValue && altSourceValue[lang]) {
        const sourceText = altSourceValue[lang];
        altText[lang] = rule.altText.prefix
          ? `${rule.altText.prefix}${sourceText}`
          : sourceText;
      } else {
        // Better default values based on element type
        let defaultText = `${elementType} content`;
        if (elementType === "button") {
          defaultText = "Button element";
        } else if (elementType === "image") {
          defaultText = "Image element";
        } else if (elementType === "video") {
          defaultText = "Video element";
        } else if (elementType === "textBlock") {
          defaultText = "Text content";
        } else if (elementType === "richText") {
          defaultText = "Rich text content";
        }

        altText[lang] = rule.altText.prefix
          ? `${rule.altText.prefix}${defaultText}`
          : defaultText;
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

    // Only patch if the computed fields have actually changed
    if (
      !deepEqual(current, computedFields) &&
      !deepEqual(previousComputedFields.current, computedFields)
    ) {
      // Update the ref to track what we're about to set
      previousComputedFields.current = computedFields;

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
