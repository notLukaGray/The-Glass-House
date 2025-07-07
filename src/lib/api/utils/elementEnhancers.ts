import { ElementEnhancer } from "./elementUtils";
import { ElementWithCasting } from "../types";
import { TextElement } from "@/app/api/elements/text/route";
import { RichTextElement } from "@/app/api/elements/rich-text/route";
import { ImageElement } from "@/app/api/elements/image/route";
import { VideoElement } from "@/app/api/elements/video/route";
import { AudioElement } from "@/app/api/elements/audio/route";
import { ButtonElement } from "@/app/api/elements/button/route";
import { SVGElement } from "@/app/api/elements/svg/route";
import { ThreeDElement } from "@/app/api/elements/3d/route";
import { CanvasElement } from "@/app/api/elements/canvas/route";
import { DividerElement } from "@/app/api/elements/divider/route";
import { WidgetElement } from "@/app/api/elements/widget/route";

// Text element enhancer (for both single line and block)
export const enhanceTextElement: ElementEnhancer<TextElement> = (element) => ({
  textInfo: {
    content: element.text,
    fontSize: element.fontSize,
    fontWeight: element.fontWeight,
    textAlign: element.textAlign,
    lineHeight: element.lineHeight,
    characterCount: element.text?.en?.length || 0,
    wordCount: element.text?.en?.split(/\s+/).length || 0,
    hasStyling: !!(element.fontSize || element.fontWeight || element.textAlign),
  },
});

// Rich text element enhancer
export const enhanceRichTextElement: ElementEnhancer<RichTextElement> = (
  element,
) => ({
  richTextInfo: {
    usage: element.usage,
    hasContent: !!element.richTextContent,
    contentLength: element.richTextContent?.length || 0,
  },
});

// Image element enhancer
export const enhanceImageElement: ElementEnhancer<ImageElement> = (element) => {
  const mediaUrl =
    element.imageSource === "upload"
      ? element.imageUpload?.asset?.url
      : element.imageUrl;

  return {
    imageInfo: {
      source: element.imageSource,
      url: mediaUrl,
      hasMedia: !!mediaUrl,
      isUploaded: element.imageSource === "upload",
      isExternal: element.imageSource === "external",
    },
  };
};

// Video element enhancer
export const enhanceVideoElement: ElementEnhancer<VideoElement> = (element) => {
  // Get the first video source for basic info
  const primaryVideo = element.videos?.[0];
  const mediaUrl =
    primaryVideo?._type === "objectElementVideoDirect"
      ? primaryVideo.source === "upload"
        ? primaryVideo.file?.asset?.url
        : primaryVideo.url
      : undefined;

  return {
    videoInfo: {
      sources: element.videos,
      primaryVideo,
      url: mediaUrl,
      hasMedia: !!mediaUrl,
      aspectRatio: element.aspectRatio,
      objectFit: element.objectFit,
      sourceCount: element.videos?.length || 0,
    },
  };
};

// Audio element enhancer
export const enhanceAudioElement: ElementEnhancer<AudioElement> = (element) => {
  const mediaUrl =
    element.source === "upload" ? element.file?.asset?.url : element.url;

  return {
    audioInfo: {
      source: element.source,
      url: mediaUrl,
      hasMedia: !!mediaUrl,
      isUploaded: element.source === "upload",
      isExternal: element.source === "url",
    },
  };
};

// Button element enhancer
export const enhanceButtonElement: ElementEnhancer<ButtonElement> = (
  element,
) => {
  const imageUrl =
    element.imageSource === "upload"
      ? element.imageUpload?.asset?.url
      : element.imageUrl;

  return {
    buttonInfo: {
      text: element.buttonText,
      url: element.url,
      variant: element.variant,
      size: element.size,
      icon: element.svgIcon,
      mediaType: element.mediaType,
      imageUrl,
      hasMedia: !!imageUrl,
      hasIcon: !!element.svgIcon,
      hasUrl: !!element.url,
    },
  };
};

// SVG element enhancer
export const enhanceSvgElement: ElementEnhancer<SVGElement> = (element) => {
  const svgContent =
    element.svgSource === "upload"
      ? element.svgFile?.asset?.url
      : element.svgString;

  const viewBoxMatch = element.svgString?.match(/viewBox=["']([^"']+)["']/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : null;

  return {
    svgInfo: {
      source: element.svgSource,
      content: svgContent,
      viewBox,
      color: element.color,
      recolor: element.recolor,
      hasSvg: !!svgContent,
      isValidSvg: element.svgString?.includes("<svg") || element.svgFile?.asset,
      hasViewBox: !!viewBox,
    },
  };
};

// 3D element enhancer
export const enhance3DElement: ElementEnhancer<ThreeDElement> = (element) => {
  const modelUrl =
    element.source === "upload" ? element.file?.asset?.url : element.url;

  const fileInfo = element.file?.asset
    ? {
        fileName: element.file.asset.originalFilename,
        fileSize: element.file.asset.size,
        mimeType: element.file.asset.mimeType,
      }
    : null;

  const fileType = fileInfo?.fileName
    ? fileInfo.fileName.split(".").pop()?.toLowerCase()
    : element.url
      ? element.url.split(".").pop()?.toLowerCase()
      : null;

  const valid3DFormats = ["glb", "gltf", "obj", "fbx", "dae", "stl", "ply"];
  const isValid3DFile = fileType && valid3DFormats.includes(fileType);

  return {
    model3dInfo: {
      source: element.source,
      url: modelUrl,
      fileInfo,
      fileType,
      isValid3DFile,
      autoRotate: element.autoRotate,
      showControls: element.showControls,
      enableZoom: element.enableZoom,
      enablePan: element.enablePan,
      backgroundColor: element.advancedOptions?.backgroundColor,
      cameraPosition: element.advancedOptions?.cameraPosition,
      hasFile: !!element.file?.asset,
      hasUrl: !!element.url,
      isUploaded: element.source === "upload",
      isExternal: element.source === "url",
      hasAdvancedOptions: !!element.advancedOptions,
    },
  };
};

// Canvas element enhancer
export const enhanceCanvasElement: ElementEnhancer<CanvasElement> = (
  element,
) => {
  const aspectRatio =
    element.aspectRatio === "custom"
      ? element.customAspectRatio
      : element.aspectRatio;

  let aspectRatioValue = null;
  if (aspectRatio && aspectRatio.includes("/")) {
    const [width, height] = aspectRatio.split("/").map(Number);
    aspectRatioValue = width / height;
  }

  const dimensions = {
    width: element.width,
    height: element.height,
    aspectRatio,
    aspectRatioValue,
    isResponsive: element.responsive,
  };

  return {
    canvasInfo: {
      url: element.url,
      dimensions,
      responsive: element.responsive,
      aspectRatio: element.aspectRatio,
      customAspectRatio: element.customAspectRatio,
      hasUrl: !!element.url,
      hasCustomAspectRatio: element.aspectRatio === "custom",
      isValidUrl: element.url && element.url.match(/^https?:\/\//),
    },
  };
};

// Divider element enhancer
export const enhanceDividerElement: ElementEnhancer<DividerElement> = (
  element,
) => {
  const style = element.style;
  const length = element.length;

  return {
    dividerInfo: {
      style,
      length,
      thickness: element.thickness,
      spacing: element.spacing,
      color: element.color,
      customWidth: element.customWidth,
      customSVG: element.customSVG,
      isCustomStyle: style === "custom",
      isCustomLength: length === "custom",
      hasCustomWidth: !!element.customWidth,
      hasCustomSVG: !!element.customSVG,
    },
  };
};

// Widget element enhancer
export const enhanceWidgetElement: ElementEnhancer<WidgetElement> = (
  element,
) => {
  const apiRefs = element.apiRefs || [];

  return {
    widgetInfo: {
      apiRefs,
      refreshInterval: element.refreshInterval,
      hasApiRefs: apiRefs.length > 0,
      apiCount: apiRefs.length,
      hasRefreshInterval: !!element.refreshInterval,
    },
  };
};

// Generic media element enhancer (for backward compatibility)
export const enhanceMediaElement =
  (mediaType: "image" | "video" | "audio"): ElementEnhancer =>
  (element: ElementWithCasting) => {
    switch (mediaType) {
      case "image":
        return enhanceImageElement(element as ImageElement);
      case "video":
        return enhanceVideoElement(element as VideoElement);
      case "audio":
        return enhanceAudioElement(element as AudioElement);
      default:
        return {};
    }
  };
