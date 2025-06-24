"use client";

import React from "react";
import { sanitizeString } from "@/lib/utils/string";

// Client-side VideoAsset interface
interface VideoAsset {
  _id: string;
  _type: "assetVideo";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: {
    _type: "localeString";
    en: string;
  };
  description: {
    _type: "localeString";
    en: string;
  };
  caption: {
    _type: "localeString";
    en: string;
  };
  order: number;
  sourceType: "bunny" | "youtube" | "vimeo";
  bunnyVideoUrl?: string;
  youtubeUrl?: string;
  vimeoUrl?: string;
  // Extracted data for Bunny videos
  cdnDomain?: string | null;
  videoGuid?: string | null;
  libraryId?: string | null;
  // Video dimensions
  width?: number | null;
  height?: number | null;
}

interface VideoSectionProps {
  video: VideoAsset;
  autoplay?: boolean;
  loop?: boolean;
  showCaption?: boolean;
  altCaption?: { en?: string };
  caption?: { en?: string };
  size?: string;
  aspectRatio?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  fullBleed?: boolean;
  alignment?: string;
  objectFit?: string;
  titleDisplayMode?: "none" | "below";
  // Theme
  theme?: {
    overlayColor?: string;
    overlayOpacity?: number;
    textColor?: string;
    captionColor?: string;
    spacing?: {
      title?: string;
      caption?: string;
      padding?: string;
    };
  };
  // Advanced
  advanced?: {
    marginTop?: string;
    marginBottom?: string;
    padding?: string;
    borderRadius?: string;
    boxShadow?: string;
    hideOnMobile?: boolean;
    hideOnDesktop?: boolean;
  };
  // Accept any extra props (for flattening)
  [key: string]: unknown;
  muted?: boolean;
  responsive?: boolean;
}

// Utility functions (copied from ImageSection)
function getSizeClass(size?: string) {
  switch (size) {
    case "small":
      return "w-full max-w-xs sm:max-w-sm";
    case "medium":
      return "w-full max-w-sm sm:max-w-md";
    case "large":
      return "w-full max-w-md sm:max-w-lg";
    case "xl":
      return "w-full max-w-lg sm:max-w-xl";
    case "2xl":
      return "w-full max-w-xl sm:max-w-2xl";
    case "3xl":
      return "w-full max-w-2xl sm:max-w-3xl";
    case "4xl":
      return "w-full max-w-3xl sm:max-w-4xl";
    case "5xl":
      return "w-full max-w-4xl sm:max-w-5xl";
    case "6xl":
      return "w-full max-w-5xl sm:max-w-6xl";
    case "7xl":
      return "w-full max-w-6xl sm:max-w-7xl";
    case "full":
      return "w-full";
    default:
      return "";
  }
}
function getBoxShadowClass(boxShadow?: string) {
  switch (boxShadow) {
    case "sm":
      return "shadow-sm";
    case "md":
      return "shadow-md";
    case "lg":
      return "shadow-lg";
    case "xl":
      return "shadow-xl";
    case "2xl":
      return "shadow-2xl";
    case "3xl":
      return "shadow-3xl";
    case "4xl":
      return "shadow-4xl";
    case "5xl":
      return "shadow-5xl";
    default:
      return "";
  }
}
function getBorderRadiusClass(borderRadius?: string) {
  switch (borderRadius) {
    case "sm":
      return "rounded-sm";
    case "md":
      return "rounded-md";
    case "lg":
      return "rounded-lg";
    case "xl":
      return "rounded-xl";
    case "full":
      return "rounded-full";
    default:
      return "";
  }
}

function getObjectFitClass(objectFit?: string) {
  switch (objectFit) {
    case "cover":
      return "object-cover";
    case "contain":
      return "object-contain";
    case "fill":
      return "object-fill";
    case "none":
      return "object-none";
    case "scale-down":
      return "object-scale-down";
    default:
      return "";
  }
}

// Client-side utility function to calculate natural aspect ratio
function calculateNaturalAspectRatio(
  width: number | null,
  height: number | null,
): string | null {
  if (!width || !height) return null;

  // Return the exact ratio without simplifying
  return `${width}:${height}`;
}

const VideoSection: React.FC<VideoSectionProps> = (props) => {
  // Flatten nested fields (effects, meta, positioning, positioningAdvanced, etc.)
  const {
    effects = {},
    meta = {},
    positioning = {},
    positioningAdvanced = {},
    advanced = {},
    ...rest
  } = props;
  const flatProps = {
    ...rest,
    ...(effects as Record<string, unknown>),
    ...(meta as Record<string, unknown>),
    ...(positioning as Record<string, unknown>),
    ...(positioningAdvanced as Record<string, unknown>),
    ...(advanced as Record<string, unknown>),
  };

  // Sanitize all relevant string props
  const video = flatProps.video;
  const altCaption = flatProps.altCaption
    ? { en: sanitizeString(flatProps.altCaption.en as string) }
    : undefined;
  const caption = flatProps.caption
    ? { en: sanitizeString(flatProps.caption.en as string) }
    : undefined;
  const size = sanitizeString(flatProps.size as string);
  const aspectRatio = sanitizeString(flatProps.aspectRatio as string);
  const width = sanitizeString(flatProps.width as string);
  const height = sanitizeString(flatProps.height as string);
  const maxWidth = sanitizeString(flatProps.maxWidth as string);
  const alignment = sanitizeString(flatProps.alignment as string);
  const objectFit = sanitizeString(flatProps.objectFit as string);
  const showCaption =
    flatProps.showCaption !== undefined ? flatProps.showCaption : true;
  const titleDisplayMode = flatProps.titleDisplayMode;
  const autoplay = flatProps.autoplay;
  const loop = flatProps.loop;
  const muted = flatProps.muted;
  const responsive = flatProps.responsive;
  const adv = {
    ...flatProps,
    marginTop: sanitizeString(flatProps.marginTop as string),
    marginBottom: sanitizeString(flatProps.marginBottom as string),
    padding: sanitizeString(flatProps.padding as string),
    borderRadius: sanitizeString(flatProps.borderRadius as string),
    boxShadow: sanitizeString(flatProps.boxShadow as string),
    hideOnMobile: flatProps.hideOnMobile,
    hideOnDesktop: flatProps.hideOnDesktop,
  };

  // Responsive visibility
  let visibilityClass = "";
  if (adv.hideOnMobile) visibilityClass += " hidden sm:block";
  if (adv.hideOnDesktop) visibilityClass += " block sm:hidden";

  // Alignment logic
  let flexJustify = "";
  if (!flatProps.fullBleed) {
    if (alignment === "center") flexJustify = "justify-center";
    if (alignment === "right") flexJustify = "justify-end";
    if (alignment === "left") flexJustify = "justify-start";
  }

  // Container style and classes
  const containerStyle: React.CSSProperties = {
    width: width || (flatProps.fullBleed ? "100%" : undefined),
    height: height || undefined,
    maxWidth: width ? undefined : maxWidth || undefined,
    marginTop: adv.marginTop,
    marginBottom: adv.marginBottom,
    padding: adv.padding,
    overflow: "visible",
  };

  // Size class - apply when size is specified and not fullBleed
  const sizeClass = size && !flatProps.fullBleed ? getSizeClass(size) : "";

  // Aspect ratio logic
  const naturalAspectRatio =
    video?.width && video?.height
      ? calculateNaturalAspectRatio(video.width, video.height)
      : null;

  // Use natural aspect ratio when "auto" is selected, otherwise use specified aspect ratio
  const finalAspectRatio =
    aspectRatio === "auto"
      ? naturalAspectRatio || "16:9"
      : aspectRatio || naturalAspectRatio || "16:9";

  // Calculate CSS aspect ratio for inline styles
  const getAspectRatioStyle = (): React.CSSProperties => {
    if (finalAspectRatio && finalAspectRatio.includes(":")) {
      const [width, height] = finalAspectRatio.split(":").map(Number);
      if (!isNaN(width) && !isNaN(height)) {
        return {
          aspectRatio: `${width} / ${height}`,
        };
      }
    }
    return {};
  };

  // Video class - simplified, no effects here
  const videoClass = [
    "w-full h-full",
    objectFit ? getObjectFitClass(objectFit) : "object-cover",
    visibilityClass,
    "transition-colors duration-300",
  ]
    .filter(Boolean)
    .join(" ");

  // Prefer asset's fields, but overwrite with section overrides if present
  const finalCaption = showCaption
    ? altCaption?.en || caption?.en || video?.caption?.en
    : undefined;
  const finalTitle = video?.title?.en || "";

  // Get title display classes based on mode
  const getTitleDisplayClasses = (mode?: string) => {
    const baseClasses = "text-white";
    const spacing = flatProps.theme?.spacing?.title || "mt-2";
    switch (mode) {
      case "below":
        return `${spacing} text-lg font-medium ${baseClasses}`;
      default:
        return baseClasses;
    }
  };

  // Render video with aspect ratio or fixed dimensions
  const renderVideoContent = () => {
    // Bunny, YouTube, Vimeo, or fallback
    if (!video) return null;

    // Common iframe styles to prevent blue background and scrollbars
    const iframeStyle: React.CSSProperties = {
      border: 0,
      background: "transparent",
      display: "block",
      width: "100%",
      height: "100%",
      overflow: "hidden",
    };

    // Bunny iframe - use proper embed URL format
    if (video.sourceType === "bunny" && video.bunnyVideoUrl) {
      // Extract library ID and video GUID from the Direct Play URL
      const urlParts = video.bunnyVideoUrl.split("/");
      const videoGuid = urlParts[urlParts.length - 1];
      const libraryId = urlParts[urlParts.length - 2];

      if (videoGuid && libraryId) {
        const baseUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoGuid}`;
        const params = new URLSearchParams({
          autoplay: autoplay ? "true" : "false",
          loop: loop ? "true" : "false",
          muted: muted ? "true" : "false",
          preload: "true",
          responsive: responsive ? "true" : "false",
        });

        const iframeUrl = `${baseUrl}?${params.toString()}`;

        return (
          <iframe
            src={iframeUrl}
            title={finalTitle}
            loading="lazy"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            className={videoClass}
            style={iframeStyle}
          />
        );
      }
    }

    // YouTube
    if (video.sourceType === "youtube" && video.youtubeUrl) {
      return (
        <iframe
          src={video.youtubeUrl}
          title={finalTitle}
          allow="autoplay; fullscreen"
          className={videoClass}
          style={iframeStyle}
          allowFullScreen
        />
      );
    }

    // Vimeo
    if (video.sourceType === "vimeo" && video.vimeoUrl) {
      return (
        <iframe
          src={video.vimeoUrl}
          title={finalTitle}
          allow="autoplay; fullscreen"
          className={videoClass}
          style={iframeStyle}
          allowFullScreen
        />
      );
    }

    // Fallback - show a placeholder since VideoAsset doesn't have a direct url property
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Video not available</p>
      </div>
    );
  };

  const videoElement = (
    <div
      className={`relative group overflow-hidden w-full ${getBorderRadiusClass(adv.borderRadius)} ${getBoxShadowClass(adv.boxShadow)}`}
      style={{
        background: "transparent",
        ...getAspectRatioStyle(),
      }}
    >
      {renderVideoContent()}
      {titleDisplayMode !== "none" && finalTitle && (
        <div className={getTitleDisplayClasses(titleDisplayMode)}>
          <div className="relative z-10">
            {finalTitle}
            {finalCaption && (
              <p
                className={`text-xs ${flatProps.theme?.captionColor || "text-white"} ${flatProps.theme?.spacing?.caption || "mt-1"}`}
              >
                {finalCaption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Outer container
  return (
    <div
      className={`flex ${flexJustify} ${visibilityClass} transition-colors duration-300`}
      style={containerStyle}
    >
      <section
        className={`${sizeClass} transition-colors duration-300 relative`}
        style={{
          width: width || (flatProps.fullBleed ? "100%" : undefined),
        }}
      >
        {videoElement}
      </section>
    </div>
  );
};

export default VideoSection;
