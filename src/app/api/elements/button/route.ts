import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { ButtonElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// Localized string type for button text
export interface LocalizedString {
  [lang: string]: string;
}

// Button Element type for API
export interface ButtonElement extends ElementWithCasting {
  usage?: string;
  contentType?: "text" | "visual" | "visualText";
  mediaType?: "svg" | "image";
  buttonText?: LocalizedString;
  svgIcon?: string;
  svgColor?: string;
  svgRecolor?: boolean;
  imageSource?: "upload" | "external";
  imageUpload?: {
    asset?: {
      url?: string;
      metadata?: Record<string, unknown>;
    };
  };
  imageUrl?: string;
  buttonType?: "link" | "submit" | "action" | "visual";
  url?: string;
  actionId?: string;
  variant?: string;
  size?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Production-level button enhancer that captures ALL schema fields
const enhanceButtonElement = (element: ButtonElement) => {
  // Get button text with proper localization handling
  const buttonText =
    element.buttonText?.en ||
    Object.values(element.buttonText || {}).find((val) => val?.trim()) ||
    "Button";

  // Determine image URL based on source
  const imageUrl =
    element.imageSource === "upload"
      ? element.imageUpload?.asset?.url
      : element.imageUrl;

  // Determine button type and behavior
  const buttonBehavior = {
    type: element.buttonType,
    isLink: element.buttonType === "link",
    isSubmit: element.buttonType === "submit",
    isAction: element.buttonType === "action",
    isVisual: element.buttonType === "visual",
    url: element.url,
    actionId: element.actionId,
  };

  // Determine content type and media
  const contentInfo = {
    contentType: element.contentType,
    mediaType: element.mediaType,
    hasText: ["text", "visualText"].includes(element.contentType || ""),
    hasVisual: ["visual", "visualText"].includes(element.contentType || ""),
    isTextOnly: element.contentType === "text",
    isVisualOnly: element.contentType === "visual",
    isMixed: element.contentType === "visualText",
  };

  // Media information
  const mediaInfo = {
    hasSvg: element.mediaType === "svg" && !!element.svgIcon,
    hasImage:
      element.mediaType === "image" &&
      (imageUrl !== undefined || element.imageUpload !== undefined),
    svgIcon: element.svgIcon,
    svgColor: element.svgColor,
    svgRecolor: element.svgRecolor,
    imageUrl,
    imageMetadata: element.imageUpload?.asset?.metadata,
  };

  return {
    buttonInfo: {
      // Localized content
      text: buttonText,
      localizedText: element.buttonText,
      title: element.title,
      description: element.description,
      alternativeTitle: element.alternativeTitle,
      caption: element.caption,

      // Content configuration
      usage: element.usage,
      contentType: element.contentType,
      mediaType: element.mediaType,

      // Behavior
      behavior: buttonBehavior,
      content: contentInfo,
      media: mediaInfo,

      // Style
      variant: element.variant,
      size: element.size,
      fullWidth: element.fullWidth,
      disabled: element.disabled,

      // Computed properties
      hasText: contentInfo.hasText,
      hasVisual: contentInfo.hasVisual,
      hasSvg: mediaInfo.hasSvg,
      hasImage: mediaInfo.hasImage,
      isInteractive: !element.disabled && element.buttonType !== "visual",
      hasUrl: !!element.url,
      hasAction: !!element.actionId,

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
  elementType: "elementButton",
  schema: ButtonElementSchema,
});

// GET /api/elements/button - Get elementButton elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // Content fields
      "usage",
      "contentType",
      "mediaType",
      "buttonText",
      "svgIcon",
      "svgColor",
      "svgRecolor",
      "imageSource",
      "imageUpload.asset->",
      "imageUrl",

      // Style fields
      "buttonType",
      "url",
      "actionId",
      "variant",
      "size",
      "fullWidth",
      "disabled",

      // Base fields (handled by BASE_ELEMENT_FIELDS)
      // 'title', 'description', 'alternativeTitle', 'caption', 'customId', 'debug', 'computedFields', 'casting'
    ];

    // Fetch elements using shared utility
    const { elements, total } = await fetchElements(
      "elementButton",
      specificFields,
      params,
    );

    // Process elements with comprehensive button enhancement
    const enhancedData = processElements(
      elements as ButtonElement[],
      enhanceButtonElement,
    );

    // Build response using shared utility
    return await buildElementResponse(
      enhancedData,
      "elementButton",
      "button",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "button");
  }
}

export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;
