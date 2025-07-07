import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { AudioElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// Audio Asset type
export interface AudioAsset {
  url?: string;
  originalFilename?: string;
  size?: number;
  mimeType?: string;
  metadata?: {
    duration?: number;
    bitrate?: number;
    sampleRate?: number;
    channels?: number;
  };
}

// Audio Element type for API
export interface AudioElement extends ElementWithCasting {
  source?: "upload" | "url";
  file?: {
    asset?: AudioAsset;
  };
  url?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Production-level audio enhancer that captures ALL schema fields
const enhanceAudioElement = (element: AudioElement) => {
  // Determine audio URL based on source
  const audioUrl =
    element.source === "upload" ? element.file?.asset?.url : element.url;

  // Audio metadata from Sanity asset
  const audioMetadata = element.file?.asset
    ? {
        url: element.file.asset.url,
        filename: element.file.asset.originalFilename,
        size: element.file.asset.size,
        mimeType: element.file.asset.mimeType,
        duration: element.file.asset.metadata?.duration,
        bitrate: element.file.asset.metadata?.bitrate,
        sampleRate: element.file.asset.metadata?.sampleRate,
        channels: element.file.asset.metadata?.channels,
      }
    : null;

  // Audio information
  const audioInfo = {
    source: element.source,
    url: audioUrl,
    isUploaded: element.source === "upload",
    isExternal: element.source === "url",
    metadata: audioMetadata,
  };

  // Playback configuration
  const playbackConfig = {
    autoplay: element.autoplay,
    controls: element.controls,
    loop: element.loop,
    muted: element.muted,
  };

  // Audio analysis
  const audioAnalysis = {
    hasAudio: !!audioUrl,
    hasUploadedAudio: audioInfo.isUploaded,
    hasExternalAudio: audioInfo.isExternal,
    hasMetadata: !!audioMetadata,
    hasDuration: !!audioMetadata?.duration,
    hasBitrate: !!audioMetadata?.bitrate,
    hasSampleRate: !!audioMetadata?.sampleRate,
    hasChannels: !!audioMetadata?.channels,
    isAutoplay: element.autoplay,
    hasControls: element.controls,
    isLooping: element.loop,
    isMuted: element.muted,
  };

  return {
    audioInfo: {
      // Audio configuration
      audio: audioInfo,
      playback: playbackConfig,

      // Audio analysis
      analysis: audioAnalysis,

      // Computed properties
      hasAudio: audioAnalysis.hasAudio,
      hasUploadedAudio: audioAnalysis.hasUploadedAudio,
      hasExternalAudio: audioAnalysis.hasExternalAudio,
      hasMetadata: audioAnalysis.hasMetadata,
      hasDuration: audioAnalysis.hasDuration,
      hasBitrate: audioAnalysis.hasBitrate,
      hasSampleRate: audioAnalysis.hasSampleRate,
      hasChannels: audioAnalysis.hasChannels,
      isAutoplay: audioAnalysis.isAutoplay,
      hasControls: audioAnalysis.hasControls,
      isLooping: audioAnalysis.isLooping,
      isMuted: audioAnalysis.isMuted,

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
  elementType: "elementAudio",
  schema: AudioElementSchema,
});

// GET /api/elements/audio - Get elementAudio elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // Audio fields
      "source",
      "file.asset->",
      "file.asset.metadata",
      "url",
      "autoplay",
      "controls",
      "loop",
      "muted",

      // Base fields (handled by BASE_ELEMENT_FIELDS)
      // 'customId', 'debug', 'computedFields', 'casting'
    ];

    // Fetch elements using shared utility
    const { elements, total } = await fetchElements(
      "elementAudio",
      specificFields,
      params,
    );

    // Process elements with comprehensive audio enhancement
    const enhancedData = processElements(
      elements as AudioElement[],
      enhanceAudioElement,
    );

    // Build response using shared utility
    return await buildElementResponse(
      enhancedData,
      "elementAudio",
      "audio",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "audio");
  }
}

// POST /api/elements/audio - Create new audio element
export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;
