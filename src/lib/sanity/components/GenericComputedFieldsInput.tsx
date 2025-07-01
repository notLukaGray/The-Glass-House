import React, { useMemo, useEffect, useRef } from "react";
import { useFormValue, useDocumentOperation } from "sanity";
import { Card, Stack, Text } from "@sanity/ui";
import { getElementTypeFromDocument } from "../utils/elementUtils";
import { generateCustomId } from "../utils/autoGeneration";

interface ComputedFieldsInputProps {
  onChange?: (patch: PatchEvent) => void;
  elementType?: string;
  options?: {
    elementType?: string;
  };
}

interface ComputedFields {
  ariaLabel: {
    _type: "glassLocaleString";
    [key: string]: string;
  };
  altText: {
    _type: "glassLocaleString";
    [key: string]: string;
  };
  customId: string;
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
  customId?: string;
  meta?: {
    moduleTitle?: Record<string, string>;
    description?: Record<string, string>;
  };
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
      prefix: "Text: ",
      sourceField: "text",
    },
    altText: {
      prefix: "",
      sourceField: "description",
    },
  },
  textBlock: {
    ariaLabel: {
      prefix: "Text: ",
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
      prefix: "Text: ",
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
  moduleHeroImage: {
    ariaLabel: {
      prefix: "Module: ",
      sourceField: "meta.moduleTitle",
    },
    altText: {
      prefix: "",
      sourceField: "meta.description",
    },
  },
  module: {
    ariaLabel: {
      prefix: "Module: ",
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
  objA: ComputedFields | null | undefined,
  objB: ComputedFields | null | undefined,
) {
  if (objA === objB) return true;
  if (!objA || !objB) return false;

  // Deep compare ariaLabel and altText objects (ignoring _type for comparison)
  const ariaLabelEqual =
    JSON.stringify(objA.ariaLabel) === JSON.stringify(objB.ariaLabel);
  const altTextEqual =
    JSON.stringify(objA.altText) === JSON.stringify(objB.altText);
  const customIdEqual = objA.customId === objB.customId;

  return ariaLabelEqual && altTextEqual && customIdEqual;
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
  const previousComputedFields = useRef<ComputedFields | null>(null);

  const elementType =
    getElementTypeFromDocument(documentData?._type as string) ||
    props.options?.elementType ||
    props.elementType ||
    "default";

  console.log(
    "GenericComputedFieldsInput - Document type:",
    documentData?._type,
  );
  console.log("GenericComputedFieldsInput - Element type:", elementType);
  console.log("GenericComputedFieldsInput - Document data:", documentData);

  const rule = useMemo(
    () =>
      GENERATION_RULES[elementType.toLowerCase()] || GENERATION_RULES.default,
    [elementType],
  );

  const computedFields = useMemo((): ComputedFields => {
    if (!documentData)
      return {
        ariaLabel: { _type: "glassLocaleString" },
        altText: { _type: "glassLocaleString" },
        customId: "",
      };

    const ariaSourceField = rule.ariaLabel.sourceField;
    const altSourceField = rule.altText.sourceField;

    // Special handling for richText element type
    if (elementType === "richText") {
      const richTextContent =
        documentData.richTextContent as PortableTextContent[];
      const extractedText = extractTextFromRichText(richTextContent);

      return {
        ariaLabel: {
          _type: "glassLocaleString",
          en: extractedText || "Rich text content",
        },
        altText: {
          _type: "glassLocaleString",
          en: extractedText || "Rich text content",
        },
        customId: documentData.customId || generateCustomId(documentId || ""),
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

      return {
        ariaLabel: { _type: "glassLocaleString", ...ariaLabel },
        altText: { _type: "glassLocaleString", ...altText },
        customId: documentData.customId || generateCustomId(documentId || ""),
      };
    }

    // Standard handling for other element types
    let ariaSourceValue: Record<string, string> | undefined;
    let altSourceValue: Record<string, string> | undefined;

    // Handle nested fields for modules
    if (elementType === "moduleHeroImage") {
      ariaSourceValue = documentData.meta?.moduleTitle as
        | Record<string, string>
        | undefined;
      altSourceValue = documentData.meta?.description as
        | Record<string, string>
        | undefined;
    } else {
      // Handle nested field paths (e.g., "meta.moduleTitle")
      const getNestedValue = (
        obj: Record<string, unknown>,
        path: string,
      ): unknown => {
        return path.split(".").reduce((current, key) => {
          if (current && typeof current === "object" && key in current) {
            return (current as Record<string, unknown>)[key];
          }
          return undefined;
        }, obj as unknown);
      };

      ariaSourceValue = getNestedValue(documentData, ariaSourceField) as
        | Record<string, string>
        | undefined;
      altSourceValue = getNestedValue(documentData, altSourceField) as
        | Record<string, string>
        | undefined;
    }

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

      // For alt text, try description first, then title as fallback
      let altSourceText = "";
      if (altSourceValue && altSourceValue[lang]) {
        altSourceText = altSourceValue[lang];
      } else if (elementType !== "moduleHeroImage") {
        // For elements, try description first, then title
        const description = documentData.description as
          | Record<string, string>
          | undefined;
        const title = documentData.title as Record<string, string> | undefined;

        if (description && description[lang]) {
          altSourceText = description[lang];
        } else if (title && title[lang]) {
          altSourceText = title[lang];
        } else if (description && description.en) {
          altSourceText = description.en;
        } else if (title && title.en) {
          altSourceText = title.en;
        }
      }

      if (altSourceText) {
        altText[lang] = rule.altText.prefix
          ? `${rule.altText.prefix}${altSourceText}`
          : altSourceText;
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

    return {
      ariaLabel: { _type: "glassLocaleString", ...ariaLabel },
      altText: { _type: "glassLocaleString", ...altText },
      customId: documentData.customId || generateCustomId(documentId || ""),
    };
  }, [documentData, rule, elementType, documentId]);

  useEffect(() => {
    const updateComputedFields = async () => {
      if (
        !documentData ||
        !documentData._id ||
        !patch ||
        typeof patch.execute !== "function"
      )
        return;

      const current = ((documentData as Record<string, unknown>)
        .computedFields as ComputedFields) || {
        ariaLabel: { _type: "glassLocaleString" },
        altText: { _type: "glassLocaleString" },
        customId: "",
      };

      // Only patch if the computed fields have actually changed
      if (
        !deepEqual(current, computedFields) &&
        !deepEqual(previousComputedFields.current, computedFields)
      ) {
        // Update the ref to track what we're about to set
        previousComputedFields.current = computedFields;

        console.log("Patching computed fields:", computedFields);
        try {
          await patch.execute([{ set: { computedFields } }]);
          console.log("✅ Computed fields patched successfully");
        } catch (error) {
          console.warn("Failed to patch computedFields:", error);
        }
      } else {
        console.log(
          "No patch needed. Current:",
          current,
          "Computed:",
          computedFields,
        );
      }
    };

    updateComputedFields();
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
      {/* Display ARIA Labels */}
      <Card padding={3} border radius={2}>
        <Stack space={2}>
          <Text weight="semibold" size={1}>
            ARIA Label
          </Text>
          {Object.entries(computedFields.ariaLabel).map(
            ([lang, computedValue]) => {
              if (!computedValue || lang === "_type") return null;
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
            },
          )}
        </Stack>
      </Card>

      {/* Display Alt Text */}
      <Card padding={3} border radius={2}>
        <Stack space={2}>
          <Text weight="semibold" size={1}>
            Alt Text
          </Text>
          {Object.entries(computedFields.altText).map(
            ([lang, computedValue]) => {
              if (!computedValue || lang === "_type") return null;
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
            },
          )}
        </Stack>
      </Card>
    </Stack>
  );
};
