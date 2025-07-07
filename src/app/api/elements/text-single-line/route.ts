import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { TextSingleLineElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// Typography type
type Typography = {
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  lineHeight?: string;
  altColor?: string;
};

// Text single line element type
type TextSingleLineElement = ElementWithCasting & {
  text?: Record<string, string>;
  usage?: string;
  typography?: Typography;
};

// Production-level text-single-line enhancer that captures ALL schema fields
const enhanceTextSingleLineElement = (element: TextSingleLineElement) => {
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

  // Text analysis for single line
  const textAnalysis = {
    length: textContent.length,
    wordCount: textContent
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length,
    hasContent: textContent.length > 0,
    isEmpty: textContent.length === 0,
    isShort: textContent.length < 50,
    isMedium: textContent.length >= 50 && textContent.length < 100,
    isLong: textContent.length >= 100,
    isSingleLine: !textContent.includes("\n"),
    hasMultipleWords:
      textContent.split(/\s+/).filter((word: string) => word.length > 0)
        .length > 1,
  };

  return {
    textSingleLineInfo: {
      // Localized content
      text: textContent,
      localizedText: element.text,

      // Content configuration
      usage: element.usage,

      // Typography configuration
      typography: typographyInfo,

      // Text analysis
      analysis: textAnalysis,

      // Computed properties
      hasText: textAnalysis.hasContent,
      hasUsage: !!element.usage,
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
      isSingleLine: textAnalysis.isSingleLine,
      hasMultipleWords: textAnalysis.hasMultipleWords,
      isHeroHeadline: element.usage === "hero-headline",

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
  elementType: "elementTextSingleLine",
  schema: TextSingleLineElementSchema,
});

export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;

// GET /api/elements/text-single-line - Get elementTextSingleLine elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // Text fields
      "text",
      "usage",

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
      "elementTextSingleLine",
      specificFields,
      params,
    );

    // Process elements with comprehensive text-single-line enhancement
    const enhancedData = processElements(
      elements as TextSingleLineElement[],
      enhanceTextSingleLineElement,
    );

    // Build response using shared utility with rate limiting
    return await buildElementResponse(
      enhancedData,
      "elementTextSingleLine",
      "textSingleLine",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "text-single-line");
  }
}
