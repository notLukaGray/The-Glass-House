import { NextRequest } from "next/server";
import {
  parseElementParams,
  fetchElements,
  processElements,
  buildElementResponse,
  handleElementError,
} from "@/lib/api/utils/elementUtils";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { VideoElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// Video Source types
export interface VideoEmbed {
  _type: "objectElementVideoEmbed";
  platform?: "youtube" | "vimeo";
  videoId?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  youtubeOptions?: Record<string, unknown>;
  vimeoOptions?: Record<string, unknown>;
  advancedOptions?: Record<string, unknown>;
}

export interface VideoCDN {
  _type: "objectElementVideoCDN";
  provider?: "bunny";
  libraryId?: string;
  videoGuid?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  quality?: string;
  responsive?: boolean;
  advancedOptions?: Record<string, unknown>;
}

export interface VideoDirect {
  _type: "objectElementVideoDirect";
  source?: "upload" | "url";
  file?: {
    asset?: {
      url?: string;
      originalFilename?: string;
      size?: number;
      mimeType?: string;
    };
  };
  url?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  poster?: string;
  advancedOptions?: Record<string, unknown>;
}

export type VideoSource = VideoEmbed | VideoCDN | VideoDirect;

// Video Element type for API
export interface VideoElement extends ElementWithCasting {
  videos?: VideoSource[];
  aspectRatio?: "auto" | "16:9" | "4:3" | "1:1" | "3:4" | "9:16";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Processed Video Source types
export interface ProcessedVideoEmbed {
  type: "embed";
  platform?: "youtube" | "vimeo";
  videoId?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  youtubeOptions?: Record<string, unknown>;
  vimeoOptions?: Record<string, unknown>;
  advancedOptions?: Record<string, unknown>;
  // Computed properties
  isYouTube: boolean;
  isVimeo: boolean;
  hasYouTubeOptions: boolean;
  hasVimeoOptions: boolean;
  hasAdvancedOptions: boolean;
}

export interface ProcessedVideoCDN {
  type: "cdn";
  provider?: "bunny";
  libraryId?: string;
  videoGuid?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  quality?: string;
  responsive?: boolean;
  advancedOptions?: Record<string, unknown>;
  // Computed properties
  isBunny: boolean;
  hasAdvancedOptions: boolean;
}

export interface ProcessedVideoDirect {
  type: "direct";
  source?: "upload" | "url";
  file?: {
    url?: string;
    originalFilename?: string;
    size?: number;
    mimeType?: string;
  };
  url?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  poster?: string;
  advancedOptions?: Record<string, unknown>;
  // Computed properties
  isUploaded: boolean;
  isUrl: boolean;
  hasFile: boolean;
  hasUrl: boolean;
  hasPoster: boolean;
  hasAdvancedOptions: boolean;
}

export type ProcessedVideoSource =
  | ProcessedVideoEmbed
  | ProcessedVideoCDN
  | ProcessedVideoDirect;

// Production-level video enhancer that captures ALL schema fields
const enhanceVideoElement = (element: VideoElement) => {
  // Process video sources array
  const videoSources: ProcessedVideoSource[] =
    element.videos?.map((video: VideoSource) => {
      if (video._type === "objectElementVideoEmbed") {
        const embedVideo = video as VideoEmbed;
        return {
          type: "embed" as const,
          platform: embedVideo.platform,
          videoId: embedVideo.videoId,
          autoplay: embedVideo.autoplay,
          muted: embedVideo.muted,
          loop: embedVideo.loop,
          controls: embedVideo.controls,
          youtubeOptions: embedVideo.youtubeOptions,
          vimeoOptions: embedVideo.vimeoOptions,
          advancedOptions: embedVideo.advancedOptions,
          // Computed properties
          isYouTube: embedVideo.platform === "youtube",
          isVimeo: embedVideo.platform === "vimeo",
          hasYouTubeOptions: !!embedVideo.youtubeOptions,
          hasVimeoOptions: !!embedVideo.vimeoOptions,
          hasAdvancedOptions: !!embedVideo.advancedOptions,
        };
      } else if (video._type === "objectElementVideoCDN") {
        const cdnVideo = video as VideoCDN;
        return {
          type: "cdn" as const,
          provider: cdnVideo.provider,
          libraryId: cdnVideo.libraryId,
          videoGuid: cdnVideo.videoGuid,
          autoplay: cdnVideo.autoplay,
          muted: cdnVideo.muted,
          loop: cdnVideo.loop,
          quality: cdnVideo.quality,
          responsive: cdnVideo.responsive,
          advancedOptions: cdnVideo.advancedOptions,
          // Computed properties
          isBunny: cdnVideo.provider === "bunny",
          hasAdvancedOptions: !!cdnVideo.advancedOptions,
        };
      } else if (video._type === "objectElementVideoDirect") {
        const directVideo = video as VideoDirect;
        return {
          type: "direct" as const,
          source: directVideo.source,
          file: directVideo.file?.asset,
          url: directVideo.url,
          autoplay: directVideo.autoplay,
          muted: directVideo.muted,
          loop: directVideo.loop,
          controls: directVideo.controls,
          poster: directVideo.poster,
          advancedOptions: directVideo.advancedOptions,
          // Computed properties
          isUploaded: directVideo.source === "upload",
          isUrl: directVideo.source === "url",
          hasFile: !!directVideo.file?.asset,
          hasUrl: !!directVideo.url,
          hasPoster: !!directVideo.poster,
          hasAdvancedOptions: !!directVideo.advancedOptions,
        };
      }
      // For unknown video types, return a default processed video
      return {
        type: "direct" as const,
        source: undefined,
        file: undefined,
        url: undefined,
        autoplay: undefined,
        muted: undefined,
        loop: undefined,
        controls: undefined,
        poster: undefined,
        advancedOptions: undefined,
        isUploaded: false,
        isUrl: false,
        hasFile: false,
        hasUrl: false,
        hasPoster: false,
        hasAdvancedOptions: false,
      };
    }) || [];

  // Get primary video source
  const primaryVideo = videoSources[0];

  // Video configuration
  const videoConfig = {
    aspectRatio: element.aspectRatio,
    objectFit: element.objectFit,
    hasMultipleSources: videoSources.length > 1,
    sourceCount: videoSources.length,
  };

  // Video type analysis
  const videoTypes = {
    hasEmbed: videoSources.some((v) => v.type === "embed"),
    hasCDN: videoSources.some((v) => v.type === "cdn"),
    hasDirect: videoSources.some((v) => v.type === "direct"),
    hasYouTube: videoSources.some((v) => v.type === "embed" && v.isYouTube),
    hasVimeo: videoSources.some((v) => v.type === "embed" && v.isVimeo),
    hasBunny: videoSources.some((v) => v.type === "cdn" && v.isBunny),
  };

  return {
    videoInfo: {
      // Localized content
      title: element.title,
      description: element.description,
      alternativeTitle: element.alternativeTitle,
      caption: element.caption,

      // Video configuration
      config: videoConfig,
      sources: videoSources,
      primaryVideo,
      types: videoTypes,

      // Computed properties
      hasVideos: videoSources.length > 0,
      hasPrimaryVideo: !!primaryVideo,
      hasMultipleSources: videoConfig.hasMultipleSources,
      hasEmbedVideos: videoTypes.hasEmbed,
      hasCDNVideos: videoTypes.hasCDN,
      hasDirectVideos: videoTypes.hasDirect,
      hasYouTubeVideos: videoTypes.hasYouTube,
      hasVimeoVideos: videoTypes.hasVimeo,
      hasBunnyVideos: videoTypes.hasBunny,

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
  elementType: "elementVideo",
  schema: VideoElementSchema,
});

export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;

// GET /api/elements/video - Get elementVideo elements
export async function GET(request: NextRequest) {
  try {
    const params = parseElementParams(request);

    // Define ALL element-specific fields from the actual schema
    const specificFields = [
      // Video fields
      "aspectRatio",
      "objectFit",
      "videos[]->",
      "videos[]._type",
      "videos[].platform",
      "videos[].videoId",
      "videos[].autoplay",
      "videos[].muted",
      "videos[].loop",
      "videos[].controls",
      "videos[].youtubeOptions",
      "videos[].vimeoOptions",
      "videos[].advancedOptions",
      "videos[].provider",
      "videos[].libraryId",
      "videos[].videoGuid",
      "videos[].quality",
      "videos[].responsive",
      "videos[].source",
      "videos[].file.asset->",
      "videos[].url",
      "videos[].poster",

      // Base fields (handled by BASE_ELEMENT_FIELDS)
      // 'title', 'description', 'alternativeTitle', 'caption', 'customId', 'debug', 'computedFields', 'casting'
    ];

    // Fetch elements using shared utility
    const { elements, total } = await fetchElements(
      "elementVideo",
      specificFields,
      params,
    );

    // Process elements with comprehensive video enhancement
    const enhancedData = processElements(
      elements as VideoElement[],
      enhanceVideoElement,
    );

    // Build response using shared utility
    return await buildElementResponse(
      enhancedData,
      "elementVideo",
      "video",
      total,
      params,
      request,
    );
  } catch (error) {
    return handleElementError(error, "video");
  }
}
