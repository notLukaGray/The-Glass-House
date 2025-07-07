import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { TextBlockElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// Typography type
export interface Typography {
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  lineHeight?: string;
  altColor?: string;
}

// Text Block Element type for API
export interface TextBlockElement extends ElementWithCasting {
  text?: Record<string, string>;
  typography?: Typography;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Production-level text-block enhancer that captures ALL schema fields
const enhanceTextBlockElement = (element: TextBlockElement) => {
  // Get text content with proper localization handling
  const textContent =
    element.text?.en ||
    Object.values(element.text || {}).find((val: string) => val?.trim()) ||
    "";

  // Typography information
  const typographyInfo = element.typography
    ? {
        fontSize: element.typography.fontSize,
        fontWeight: element.typography.fontWeight,
        textAlign: element.typography.textAlign,
        lineHeight: element.typography.lineHeight,
        altColor: element.typography.altColor,
        // Computed properties
        hasCustomTypography: !!element.typography,
        isHeading:
          element.typography?.fontSize?.startsWith("text-") &&
          [
            "text-6xl",
            "text-5xl",
            "text-4xl",
            "text-3xl",
            "text-2xl",
            "text-xl",
          ].includes(element.typography.fontSize || ""),
        isLarge: element.typography?.fontSize === "text-lg",
        isBody: element.typography?.fontSize === "text-base",
        isSmall: element.typography?.fontSize === "text-sm",
        isCaption: element.typography?.fontSize === "text-xs",
        isBold:
          element.typography?.fontWeight === "font-bold" ||
          element.typography?.fontWeight === "font-extrabold",
        isCentered: element.typography?.textAlign === "text-center",
        isJustified: element.typography?.textAlign === "text-justify",
      }
    : null;

  // Text analysis
  const textAnalysis = {
    length: textContent.length,
    wordCount: textContent
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length,
    lineCount: textContent.split("\n").length,
    hasContent: textContent.length > 0,
    isEmpty: textContent.length === 0,
    isShort: textContent.length < 100,
    isMedium: textContent.length >= 100 && textContent.length < 500,
    isLong: textContent.length >= 500,
  };

  return {
    textBlockInfo: {
      // Localized content
      text: textContent,
      localizedText: element.text,

      // Typography configuration
      typography: typographyInfo,

      // Text analysis
      analysis: textAnalysis,

      // Computed properties
      hasText: textAnalysis.hasContent,
      hasTypography: !!typographyInfo,
      hasCustomTypography: typographyInfo?.hasCustomTypography,
      isHeading: typographyInfo?.isHeading,
      isBold: typographyInfo?.isBold,
      isCentered: typographyInfo?.isCentered,
      isJustified: typographyInfo?.isJustified,
      isEmpty: textAnalysis.isEmpty,
      isShort: textAnalysis.isShort,
      isMedium: textAnalysis.isMedium,
      isLong: textAnalysis.isLong,

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
  elementType: "elementTextBlock",
  schema: TextBlockElementSchema,
});

// GET /api/elements/text-block - Get elementTextBlock elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // Text fields
      "text",

      // Typography fields
      "typography.fontSize",
      "typography.fontWeight",
      "typography.textAlign",
      "typography.lineHeight",
      "typography.altColor",

      // Base fields (handled by BASE_ELEMENT_FIELDS)
      // 'customId', 'debug', 'computedFields', 'casting'
    ];

    // Fetch elements using shared utility
    const { elements, total } = await fetchElements(
      "elementTextBlock",
      specificFields,
      params,
    );

    // Process elements with comprehensive text-block enhancement
    const enhancedData = processElements(
      elements as TextBlockElement[],
      enhanceTextBlockElement,
    );

    // Build response using shared utility
    return await buildElementResponse(
      enhancedData,
      "elementTextBlock",
      "textBlock",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "text-block");
  }
}

// POST /api/elements/text-block - Create new text-block element
export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;
