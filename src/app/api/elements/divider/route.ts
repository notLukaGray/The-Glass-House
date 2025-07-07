import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { DividerElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// Divider Spacing type
export interface DividerSpacing {
  top?: number;
  bottom?: number;
}

// Divider Element type for API
export interface DividerElement extends ElementWithCasting {
  style?: "solid" | "dashed" | "dotted" | "double" | "custom";
  thickness?: number;
  spacing?: DividerSpacing;
  color?: string;
  length?: "full" | "contained" | "short" | "custom";
  customWidth?: number;
  customSVG?: string;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Production-level divider enhancer that captures ALL schema fields
const enhanceDividerElement = (element: DividerElement) => {
  // Divider configuration
  const dividerConfig = {
    style: element.style,
    thickness: element.thickness,
    spacing: element.spacing,
    color: element.color,
    length: element.length,
    customWidth: element.customWidth,
    customSVG: element.customSVG,
  };

  // Divider analysis
  const dividerAnalysis = {
    hasStyle: !!element.style,
    hasThickness: !!element.thickness,
    hasSpacing: !!element.spacing,
    hasColor: !!element.color,
    hasLength: !!element.length,
    hasCustomWidth: !!element.customWidth,
    hasCustomSVG: !!element.customSVG,
    isCustomStyle: element.style === "custom",
    isCustomLength: element.length === "custom",
    isStandardStyle: ["solid", "dashed", "dotted", "double"].includes(
      element.style || "",
    ),
    isStandardLength: ["full", "contained", "short"].includes(
      element.length || "",
    ),
  };

  // Style analysis
  const styleInfo = {
    style: element.style,
    isSolid: element.style === "solid",
    isDashed: element.style === "dashed",
    isDotted: element.style === "dotted",
    isDouble: element.style === "double",
    isCustom: element.style === "custom",
    hasCustomSVG: !!element.customSVG,
  };

  // Length analysis
  const lengthInfo = {
    length: element.length,
    isFullWidth: element.length === "full",
    isContained: element.length === "contained",
    isShort: element.length === "short",
    isCustom: element.length === "custom",
    hasCustomWidth: !!element.customWidth,
    customWidth: element.customWidth,
  };

  // Spacing analysis
  const spacingInfo = element.spacing
    ? {
        top: element.spacing.top,
        bottom: element.spacing.bottom,
        hasTopSpacing: !!element.spacing.top,
        hasBottomSpacing: !!element.spacing.bottom,
        hasEqualSpacing: element.spacing.top === element.spacing.bottom,
        totalSpacing:
          (element.spacing.top || 0) + (element.spacing.bottom || 0),
      }
    : null;

  return {
    dividerInfo: {
      // Localized content
      title: element.title,
      description: element.description,
      alternativeTitle: element.alternativeTitle,
      caption: element.caption,

      // Divider configuration
      config: dividerConfig,

      // Divider analysis
      analysis: dividerAnalysis,
      style: styleInfo,
      length: lengthInfo,
      spacing: spacingInfo,

      // Computed properties
      hasDivider: dividerAnalysis.hasStyle,
      hasThickness: dividerAnalysis.hasThickness,
      hasSpacing: dividerAnalysis.hasSpacing,
      hasColor: dividerAnalysis.hasColor,
      hasLength: dividerAnalysis.hasLength,
      hasCustomWidth: dividerAnalysis.hasCustomWidth,
      hasCustomSVG: dividerAnalysis.hasCustomSVG,
      isCustomStyle: dividerAnalysis.isCustomStyle,
      isCustomLength: dividerAnalysis.isCustomLength,
      isStandardStyle: dividerAnalysis.isStandardStyle,
      isStandardLength: dividerAnalysis.isStandardLength,
      isSolid: styleInfo.isSolid,
      isDashed: styleInfo.isDashed,
      isDotted: styleInfo.isDotted,
      isDouble: styleInfo.isDouble,
      isFullWidth: lengthInfo.isFullWidth,
      isContained: lengthInfo.isContained,
      isShort: lengthInfo.isShort,
      hasEqualSpacing: spacingInfo?.hasEqualSpacing,

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
  elementType: "elementDivider",
  schema: DividerElementSchema,
});

// GET /api/elements/divider - Get elementDivider elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // Divider fields
      "style",
      "thickness",
      "spacing.top",
      "spacing.bottom",
      "color",
      "length",
      "customWidth",
      "customSVG",

      // Base fields (handled by BASE_ELEMENT_FIELDS)
      // 'title', 'description', 'alternativeTitle', 'caption', 'customId', 'debug', 'computedFields', 'casting'
    ];

    // Fetch elements using shared utility
    const { elements, total } = await fetchElements(
      "elementDivider",
      specificFields,
      params,
    );

    // Process elements with comprehensive divider enhancement
    const enhancedData = processElements(
      elements as DividerElement[],
      enhanceDividerElement,
    );

    // Build response using shared utility
    return await buildElementResponse(
      enhancedData,
      "elementDivider",
      "divider",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "divider");
  }
}

export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;
