import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { SVGElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// SVG Asset type
export interface SVGAsset {
  url?: string;
  originalFilename?: string;
  size?: number;
  mimeType?: string;
}

// SVG Element type for API
export interface SVGElement extends ElementWithCasting {
  svgSource?: "upload" | "string";
  svgFile?: {
    asset?: SVGAsset;
  };
  svgString?: string;
  color?: string;
  recolor?: boolean;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Production-level SVG enhancer that captures ALL schema fields
const enhanceSVGElement = (element: SVGElement) => {
  // Determine SVG content based on source
  const svgContent =
    element.svgSource === "upload"
      ? element.svgFile?.asset?.url
      : element.svgString;

  // Determine if we have valid SVG content
  const hasValidSvg =
    svgContent &&
    (svgContent.trim().startsWith("<svg") || svgContent.includes("<svg"));

  // SVG processing information
  const svgInfo = {
    source: element.svgSource,
    content: svgContent,
    hasValidSvg,
    isUploaded: element.svgSource === "upload",
    isString: element.svgSource === "string",
    color: element.color,
    recolor: element.recolor,
    needsProcessing: hasValidSvg && (element.color || element.recolor),
  };

  // File metadata for uploaded SVGs
  const fileInfo = element.svgFile?.asset
    ? {
        url: element.svgFile.asset.url,
        filename: element.svgFile.asset.originalFilename,
        size: element.svgFile.asset.size,
        mimeType: element.svgFile.asset.mimeType,
      }
    : null;

  return {
    svgInfo: {
      // Localized content
      title: element.title,
      description: element.description,
      alternativeTitle: element.alternativeTitle,
      caption: element.caption,

      // SVG configuration
      svg: svgInfo,
      file: fileInfo,

      // Computed properties
      hasContent: !!svgContent,
      hasValidSvg: svgInfo.hasValidSvg,
      hasColor: !!element.color,
      hasRecolor: !!element.recolor,
      needsProcessing: svgInfo.needsProcessing,
      isUploaded: svgInfo.isUploaded,
      isString: svgInfo.isString,

      // Advanced
      customId: element.customId,
      debug: element.debug,
      computedFields: element.computedFields,

      // Casting properties
      casting: element.casting,
    },
  };
};

// GET /api/elements/svg - Get elementSVG elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // SVG fields
      "svgSource",
      "svgFile.asset->",
      "svgString",
      "color",
      "recolor",

      // Base fields (handled by BASE_ELEMENT_FIELDS)
      // 'title', 'description', 'alternativeTitle', 'caption', 'customId', 'debug', 'computedFields', 'casting'
    ];

    // Fetch elements using shared utility
    const { elements, total } = await fetchElements(
      "elementSVG",
      specificFields,
      params,
    );

    // Process elements with comprehensive SVG enhancement
    const enhancedData = processElements(
      elements as SVGElement[],
      enhanceSVGElement,
    );

    // Build response using shared utility
    return await buildElementResponse(
      enhancedData,
      "elementSVG",
      "svg",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "svg");
  }
}

const crud = createElementCrudHandler({
  elementType: "elementSVG",
  schema: SVGElementSchema,
});

export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;
