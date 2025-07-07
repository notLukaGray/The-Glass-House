import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { ImageElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// Image Asset type
export interface ImageAsset {
  url?: string;
  originalFilename?: string;
  size?: number;
  mimeType?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
    };
    hasAlpha?: boolean;
    isOpaque?: boolean;
    lqip?: string;
    palette?: Record<string, unknown>;
    exif?: Record<string, unknown>;
  };
}

// Image Hotspot type
export interface ImageHotspot {
  x?: number;
  y?: number;
  height?: number;
  width?: number;
}

// Image Crop type
export interface ImageCrop {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

// Image Element type for API
export interface ImageElement extends ElementWithCasting {
  usage?: string;
  imageSource?: "upload" | "external";
  imageUpload?: {
    asset?: ImageAsset;
    hotspot?: ImageHotspot;
    crop?: ImageCrop;
  };
  imageUrl?: string;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Production-level image enhancer that captures ALL schema fields
const enhanceImageElement = (element: ImageElement) => {
  // Determine image URL based on source
  const imageUrl =
    element.imageSource === "upload"
      ? element.imageUpload?.asset?.url
      : element.imageUrl;

  // Image metadata from Sanity asset
  const imageMetadata = element.imageUpload?.asset
    ? {
        url: element.imageUpload.asset.url,
        filename: element.imageUpload.asset.originalFilename,
        size: element.imageUpload.asset.size,
        mimeType: element.imageUpload.asset.mimeType,
        dimensions: element.imageUpload.asset.metadata?.dimensions,
        hasAlpha: element.imageUpload.asset.metadata?.hasAlpha,
        isOpaque: element.imageUpload.asset.metadata?.isOpaque,
        lqip: element.imageUpload.asset.metadata?.lqip, // Low quality image placeholder
        palette: element.imageUpload.asset.metadata?.palette,
        exif: element.imageUpload.asset.metadata?.exif,
      }
    : null;

  // Image information
  const imageInfo = {
    source: element.imageSource,
    url: imageUrl,
    isUploaded: element.imageSource === "upload",
    isExternal: element.imageSource === "external",
    metadata: imageMetadata,
  };

  // Hotspot information for uploaded images
  const hotspotInfo = element.imageUpload?.hotspot
    ? {
        x: element.imageUpload.hotspot.x,
        y: element.imageUpload.hotspot.y,
        height: element.imageUpload.hotspot.height,
        width: element.imageUpload.hotspot.width,
      }
    : null;

  // Crop information for uploaded images
  const cropInfo = element.imageUpload?.crop
    ? {
        top: element.imageUpload.crop.top,
        bottom: element.imageUpload.crop.bottom,
        left: element.imageUpload.crop.left,
        right: element.imageUpload.crop.right,
      }
    : null;

  return {
    imageInfo: {
      // Localized content
      title: element.title,
      description: element.description,
      alternativeTitle: element.alternativeTitle,
      caption: element.caption,

      // Image configuration
      usage: element.usage,
      image: imageInfo,
      hotspot: hotspotInfo,
      crop: cropInfo,

      // Computed properties
      hasImage: !!imageUrl,
      hasUploadedImage: imageInfo.isUploaded,
      hasExternalImage: imageInfo.isExternal,
      hasMetadata: !!imageMetadata,
      hasHotspot: !!hotspotInfo,
      hasCrop: !!cropInfo,
      hasDimensions: !!imageMetadata?.dimensions,
      hasLqip: !!imageMetadata?.lqip,
      hasPalette: !!imageMetadata?.palette,
      hasExif: !!imageMetadata?.exif,

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
  elementType: "elementImage",
  schema: ImageElementSchema,
});

// GET /api/elements/image - Get elementImage elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // Image fields
      "usage",
      "imageSource",
      "imageUpload.asset->",
      "imageUpload.hotspot",
      "imageUpload.crop",
      "imageUrl",

      // Base fields (handled by BASE_ELEMENT_FIELDS)
      // 'title', 'description', 'alternativeTitle', 'caption', 'customId', 'debug', 'computedFields', 'casting'
    ];

    // Fetch elements using shared utility
    const { elements, total } = await fetchElements(
      "elementImage",
      specificFields,
      params,
    );

    // Process elements with comprehensive image enhancement
    const enhancedData = processElements(
      elements as ImageElement[],
      enhanceImageElement,
    );

    // Build response using shared utility
    return await buildElementResponse(
      enhancedData,
      "elementImage",
      "image",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "image");
  }
}

export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;
