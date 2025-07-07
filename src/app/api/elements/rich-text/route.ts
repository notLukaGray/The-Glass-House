import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { RichTextElementSchema } from "@/lib/validation/elementSchemas";
import type { BlockContent, BlockContentChild } from "@/types/content";
import type { ElementWithCasting } from "@/lib/api/types";

// Localized rich text type
export interface LocalizedRichText {
  [lang: string]: BlockContent[];
}

// Rich Text Element type for API
export interface RichTextElement extends ElementWithCasting {
  usage?: string;
  richTextContent?: LocalizedRichText;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Production-level rich-text enhancer that captures ALL schema fields
const enhanceRichTextElement = (element: RichTextElement) => {
  // Get rich text content with proper localization handling
  const richTextContent =
    element.richTextContent?.en ||
    Object.values(element.richTextContent || {}).find(
      (val) => val?.length > 0,
    ) ||
    [];

  // Extract plain text from rich text content
  const extractPlainText = (content: BlockContent[]): string => {
    if (!Array.isArray(content)) return "";

    return content
      .map((block) => {
        if (block._type === "block" && block.children) {
          return block.children
            .map((child: BlockContentChild) => child.text || "")
            .join("");
        }
        return "";
      })
      .join(" ")
      .trim();
  };

  const plainText = extractPlainText(richTextContent);

  // Rich text analysis
  const richTextAnalysis = {
    blockCount: Array.isArray(richTextContent) ? richTextContent.length : 0,
    plainTextLength: plainText.length,
    wordCount: plainText.split(/\s+/).filter((word) => word.length > 0).length,
    hasContent: Array.isArray(richTextContent) && richTextContent.length > 0,
    isEmpty: !Array.isArray(richTextContent) || richTextContent.length === 0,
    isShort: plainText.length < 100,
    isMedium: plainText.length >= 100 && plainText.length < 500,
    isLong: plainText.length >= 500,
    hasBlocks:
      Array.isArray(richTextContent) &&
      richTextContent.some((block) => block._type === "block"),
    hasFormatting:
      Array.isArray(richTextContent) &&
      richTextContent.some((block) =>
        block.children?.some(
          (child) => (child.marks?.length ?? 0) > 0 || child._type !== "span",
        ),
      ),
  };

  // Block type analysis
  const blockTypes = Array.isArray(richTextContent)
    ? richTextContent.reduce(
        (acc: Record<string, number>, block) => {
          acc[block._type] = (acc[block._type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      )
    : {};

  // Formatting analysis
  const formattingAnalysis = {
    hasBold:
      Array.isArray(richTextContent) &&
      richTextContent.some((block) =>
        block.children?.some((child) => child.marks?.includes("strong")),
      ),
    hasItalic:
      Array.isArray(richTextContent) &&
      richTextContent.some((block) =>
        block.children?.some((child) => child.marks?.includes("em")),
      ),
    hasUnderline:
      Array.isArray(richTextContent) &&
      richTextContent.some((block) =>
        block.children?.some((child) => child.marks?.includes("underline")),
      ),
    hasLinks:
      Array.isArray(richTextContent) &&
      richTextContent.some((block) =>
        block.children?.some((child) => child._type === "link"),
      ),
    hasLists:
      Array.isArray(richTextContent) &&
      richTextContent.some((block) =>
        ["bullet", "number"].includes(block.listItem as string),
      ),
  };

  return {
    richTextInfo: {
      // Localized content
      richTextContent,
      localizedRichText: element.richTextContent,
      plainText,

      // Content configuration
      usage: element.usage,

      // Rich text analysis
      analysis: richTextAnalysis,
      blockTypes,
      formatting: formattingAnalysis,

      // Computed properties
      hasContent: richTextAnalysis.hasContent,
      hasUsage: !!element.usage,
      hasBlocks: richTextAnalysis.hasBlocks,
      hasFormatting: richTextAnalysis.hasFormatting,
      hasBold: formattingAnalysis.hasBold,
      hasItalic: formattingAnalysis.hasItalic,
      hasUnderline: formattingAnalysis.hasUnderline,
      hasLinks: formattingAnalysis.hasLinks,
      hasLists: formattingAnalysis.hasLists,
      isEmpty: richTextAnalysis.isEmpty,
      isShort: richTextAnalysis.isShort,
      isMedium: richTextAnalysis.isMedium,
      isLong: richTextAnalysis.isLong,
      isHeroDescription: element.usage === "hero-description",

      // Advanced
      customId: element.customId,
      debug: element.debug,
      computedFields: element.computedFields,

      // Casting properties
      casting: element.casting,
    },
  };
};

const crud = createElementCrudHandler({
  elementType: "elementRichText",
  schema: RichTextElementSchema,
});

// GET /api/elements/rich-text - Get elementRichText elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // Rich text fields
      "usage",
      "richTextContent",

      // Base fields (handled by BASE_ELEMENT_FIELDS)
      // 'customId', 'debug', 'computedFields', 'casting'
    ];

    // Fetch elements using shared utility
    const { elements, total } = await fetchElements(
      "elementRichText",
      specificFields,
      params,
    );

    // Process elements with comprehensive rich-text enhancement
    const enhancedData = processElements(
      elements as RichTextElement[],
      enhanceRichTextElement,
    );

    // Build response using shared utility
    return await buildElementResponse(
      enhancedData,
      "elementRichText",
      "richText",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "rich-text");
  }
}

export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;
