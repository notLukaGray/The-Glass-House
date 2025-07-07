import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { CanvasElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// Canvas Element type for API
export interface CanvasElement extends ElementWithCasting {
  url?: string;
  width?: number;
  height?: number;
  responsive?: boolean;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2" | "custom";
  customAspectRatio?: string;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Production-level canvas enhancer that captures ALL schema fields
const enhanceCanvasElement = (element: CanvasElement) => {
  // Canvas configuration
  const canvasConfig = {
    url: element.url,
    width: element.width,
    height: element.height,
    responsive: element.responsive,
    aspectRatio: element.aspectRatio,
    customAspectRatio: element.customAspectRatio,
  };

  // Canvas analysis
  const canvasAnalysis = {
    hasUrl: !!element.url,
    hasDimensions: !!(element.width && element.height),
    isResponsive: element.responsive,
    hasCustomAspectRatio: element.aspectRatio === "custom",
    hasValidUrl: element.url && element.url.match(/^https?:\/\//),
    isStandardSize: element.width === 800 && element.height === 600,
    isLarge: (element.width ?? 0) > 800 || (element.height ?? 0) > 600,
    isSmall: (element.width ?? 0) < 800 || (element.height ?? 0) < 600,
  };

  // Aspect ratio analysis
  const aspectRatioInfo = {
    ratio: element.aspectRatio,
    customRatio: element.customAspectRatio,
    isStandard: ["16/9", "4/3", "1/1", "3/2"].includes(
      element.aspectRatio || "",
    ),
    isCustom: element.aspectRatio === "custom",
    hasCustomRatio: !!element.customAspectRatio,
    calculatedRatio:
      element.width && element.height ? element.width / element.height : null,
  };

  // Responsive behavior
  const responsiveInfo = {
    isResponsive: element.responsive,
    hasAspectRatio: element.responsive && element.aspectRatio,
    hasCustomAspectRatio:
      element.responsive &&
      element.aspectRatio === "custom" &&
      element.customAspectRatio,
  };

  return {
    canvasInfo: {
      // Canvas configuration
      config: canvasConfig,

      // Canvas analysis
      analysis: canvasAnalysis,
      aspectRatio: aspectRatioInfo,
      responsive: responsiveInfo,

      // Computed properties
      hasCanvas: canvasAnalysis.hasUrl,
      hasValidUrl: canvasAnalysis.hasValidUrl,
      hasDimensions: canvasAnalysis.hasDimensions,
      isResponsive: canvasAnalysis.isResponsive,
      hasCustomAspectRatio: canvasAnalysis.hasCustomAspectRatio,
      isStandardSize: canvasAnalysis.isStandardSize,
      isLarge: canvasAnalysis.isLarge,
      isSmall: canvasAnalysis.isSmall,
      isStandardAspectRatio: aspectRatioInfo.isStandard,
      isCustomAspectRatio: aspectRatioInfo.isCustom,
      hasCustomRatio: aspectRatioInfo.hasCustomRatio,
      hasResponsiveAspectRatio: responsiveInfo.hasAspectRatio,

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
  elementType: "elementCanvas",
  schema: CanvasElementSchema,
});

// GET /api/elements/canvas - Get elementCanvas elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // Canvas fields
      "url",
      "width",
      "height",
      "responsive",
      "aspectRatio",
      "customAspectRatio",

      // Base fields (handled by BASE_ELEMENT_FIELDS)
      // 'customId', 'debug', 'computedFields', 'casting'
    ];

    // Fetch elements using shared utility
    const { elements, total } = await fetchElements(
      "elementCanvas",
      specificFields,
      params,
    );

    // Process elements with comprehensive canvas enhancement
    const enhancedData = processElements(
      elements as CanvasElement[],
      enhanceCanvasElement,
    );

    // Build response using shared utility
    return await buildElementResponse(
      enhancedData,
      "elementCanvas",
      "canvas",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "canvas");
  }
}

// POST /api/elements/canvas - Create new canvas element
export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;
