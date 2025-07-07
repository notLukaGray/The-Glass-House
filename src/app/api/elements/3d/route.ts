import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { ThreeDElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// 3D Model Asset type
export interface ThreeDAsset {
  url?: string;
  originalFilename?: string;
  size?: number;
  mimeType?: string;
}

// Advanced options for 3D element
export interface ThreeDAdvancedOptions {
  backgroundColor?: string;
  cameraPosition?: {
    x?: number;
    y?: number;
    z?: number;
  };
}

// 3D Element type for API
export interface ThreeDElement extends ElementWithCasting {
  source?: "upload" | "url";
  file?: {
    asset?: ThreeDAsset;
  };
  url?: string;
  autoRotate?: boolean;
  showControls?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  advancedOptions?: ThreeDAdvancedOptions;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Production-level 3D enhancer that captures ALL schema fields
const enhance3DElement = (element: ThreeDElement) => {
  // Determine 3D model URL based on source
  const modelUrl =
    element.source === "upload" ? element.file?.asset?.url : element.url;

  // 3D model metadata from Sanity asset
  const modelMetadata = element.file?.asset
    ? {
        url: element.file.asset.url,
        filename: element.file.asset.originalFilename,
        size: element.file.asset.size,
        mimeType: element.file.asset.mimeType,
      }
    : null;

  // 3D model information
  const modelInfo = {
    source: element.source,
    url: modelUrl,
    isUploaded: element.source === "upload",
    isExternal: element.source === "url",
    metadata: modelMetadata,
  };

  // Display configuration
  const displayConfig = {
    autoRotate: element.autoRotate,
    showControls: element.showControls,
    enableZoom: element.enableZoom,
    enablePan: element.enablePan,
  };

  // Advanced options
  const advancedOptions = element.advancedOptions
    ? {
        backgroundColor: element.advancedOptions.backgroundColor,
        cameraPosition: element.advancedOptions.cameraPosition,
        hasCustomBackground: !!element.advancedOptions.backgroundColor,
        hasCustomCamera: !!element.advancedOptions.cameraPosition,
      }
    : null;

  // 3D analysis
  const modelAnalysis = {
    hasModel: !!modelUrl,
    hasUploadedModel: modelInfo.isUploaded,
    hasExternalModel: modelInfo.isExternal,
    hasMetadata: !!modelMetadata,
    isAutoRotating: element.autoRotate,
    hasControls: element.showControls,
    hasZoom: element.enableZoom,
    hasPan: element.enablePan,
    hasAdvancedOptions: !!advancedOptions,
    hasCustomBackground: advancedOptions?.hasCustomBackground,
    hasCustomCamera: advancedOptions?.hasCustomCamera,
  };

  return {
    model3DInfo: {
      // 3D model configuration
      model: modelInfo,
      display: displayConfig,
      advanced: advancedOptions,

      // 3D analysis
      analysis: modelAnalysis,

      // Computed properties
      hasModel: modelAnalysis.hasModel,
      hasUploadedModel: modelAnalysis.hasUploadedModel,
      hasExternalModel: modelAnalysis.hasExternalModel,
      hasMetadata: modelAnalysis.hasMetadata,
      isAutoRotating: modelAnalysis.isAutoRotating,
      hasControls: modelAnalysis.hasControls,
      hasZoom: modelAnalysis.hasZoom,
      hasPan: modelAnalysis.hasPan,
      hasAdvancedOptions: modelAnalysis.hasAdvancedOptions,
      hasCustomBackground: modelAnalysis.hasCustomBackground,
      hasCustomCamera: modelAnalysis.hasCustomCamera,

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
  elementType: "element3D",
  schema: ThreeDElementSchema,
});

// GET /api/elements/3d - Get element3D elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // 3D model fields
      "source",
      "file.asset->",
      "url",

      // Display settings
      "autoRotate",
      "showControls",
      "enableZoom",
      "enablePan",

      // Advanced options
      "advancedOptions.backgroundColor",
      "advancedOptions.cameraPosition.x",
      "advancedOptions.cameraPosition.y",
      "advancedOptions.cameraPosition.z",

      // Base fields (handled by BASE_ELEMENT_FIELDS)
      // 'customId', 'debug', 'computedFields', 'casting'
    ];

    // Fetch elements using shared utility
    const { elements, total } = await fetchElements(
      "element3D",
      specificFields,
      params,
    );

    // Process elements with comprehensive 3D enhancement
    const enhancedData = processElements(
      elements as ThreeDElement[],
      enhance3DElement,
    );

    // Build response using shared utility
    return await buildElementResponse(
      enhancedData,
      "element3D",
      "3d",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "3d");
  }
}

export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;
