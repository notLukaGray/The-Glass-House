"use client";

import React from "react";
import { useSettings } from "@/components/providers/SettingsProvider";
import Image from "next/image";
import { sanitizeString } from "@/lib/utils/string";

interface ImageSectionProps {
  image: {
    url: string;
    caption?: { en?: string };
    altCaption?: { en?: string };
    altDescription?: { en?: string };
    description?: { en?: string };
    title?: { en?: string };
  } | null;
  altCaption?: { en?: string };
  altDescription?: { en?: string };
  caption?: { en?: string };
  linkUrl?: string;
  size?: string;
  aspectRatio?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  fullBleed?: boolean;
  alignment?: string;
  objectFit?: string;
  showCaption?: boolean;
  titleDisplayMode?:
    | "none"
    | "below"
    | "overlay-top"
    | "overlay-bottom"
    | "overlay-center"
    | "hover";
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
    backgroundColor?: string;
    overlayColor?: string;
    overlayOpacity?: number;
    hoverEffect?: string;
    hideOnMobile?: boolean;
    hideOnDesktop?: boolean;
  };
  // Accept any extra props (for flattening)
  [key: string]: unknown;
}

function getSizeClass(size?: string) {
  switch (size) {
    case "small":
      return "max-w-xs";
    case "medium":
      return "max-w-md";
    case "large":
      return "max-w-lg";
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

function getAspectRatioClass(aspectRatio?: string) {
  switch (aspectRatio) {
    case "16:9":
      return "aspect-[16/9]";
    case "4:3":
      return "aspect-[4/3]";
    case "1:1":
      return "aspect-square";
    case "3:4":
      return "aspect-[3/4]";
    case "9:16":
      return "aspect-[9/16]";
    default:
      return "";
  }
}

const ImageSection: React.FC<ImageSectionProps> = (props) => {
  const { settings, currentTheme } = useSettings();

  // Flatten nested fields (effects, meta, positioning, positioningAdvanced) into top-level props
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
  const image = flatProps.image && {
    ...flatProps.image,
    caption: flatProps.image.caption
      ? { en: sanitizeString(flatProps.image.caption.en as string) }
      : undefined,
    altCaption: flatProps.image.altCaption
      ? { en: sanitizeString(flatProps.image.altCaption.en as string) }
      : undefined,
    altDescription: flatProps.image.altDescription
      ? { en: sanitizeString(flatProps.image.altDescription.en as string) }
      : undefined,
    description: flatProps.image.description
      ? { en: sanitizeString(flatProps.image.description.en as string) }
      : undefined,
    title: flatProps.image.title
      ? { en: sanitizeString(flatProps.image.title.en as string) }
      : undefined,
  };
  const altCaption = flatProps.altCaption
    ? { en: sanitizeString(flatProps.altCaption.en as string) }
    : undefined;
  const altDescription = flatProps.altDescription
    ? { en: sanitizeString(flatProps.altDescription.en as string) }
    : undefined;
  const caption = flatProps.caption
    ? { en: sanitizeString(flatProps.caption.en as string) }
    : undefined;
  const linkUrl = sanitizeString(flatProps.linkUrl as string);
  const size = sanitizeString(flatProps.size as string);
  const aspectRatio = sanitizeString(flatProps.aspectRatio as string);
  const width = sanitizeString(flatProps.width as string);
  const height = sanitizeString(flatProps.height as string);
  const maxWidth = sanitizeString(flatProps.maxWidth as string);
  const alignment = sanitizeString(flatProps.alignment as string);
  const objectFit = sanitizeString(flatProps.objectFit as string);
  const showCaption = flatProps.showCaption;
  const adv = {
    ...flatProps,
    marginTop: sanitizeString(flatProps.marginTop as string),
    marginBottom: sanitizeString(flatProps.marginBottom as string),
    padding: sanitizeString(flatProps.padding as string),
    borderRadius: sanitizeString(flatProps.borderRadius as string),
    boxShadow: sanitizeString(flatProps.boxShadow as string),
    backgroundColor: sanitizeString(flatProps.backgroundColor as string),
    overlayColor: sanitizeString(flatProps.overlayColor as string),
    overlayOpacity: flatProps.overlayOpacity,
    hoverEffect: sanitizeString(flatProps.hoverEffect as string),
    hideOnMobile: flatProps.hideOnMobile,
    hideOnDesktop: flatProps.hideOnDesktop,
  };

  // Responsive visibility
  let visibilityClass = "";
  if (adv.hideOnMobile) visibilityClass += " hidden sm:block";
  if (adv.hideOnDesktop) visibilityClass += " block sm:hidden";

  // --- Alignment logic ---
  let flexJustify = "";
  if (!flatProps.fullBleed) {
    if (alignment === "center") flexJustify = "justify-center";
    if (alignment === "right") flexJustify = "justify-end";
    if (alignment === "left") flexJustify = "justify-start";
  }

  // Get theme-aware styles
  const getThemeStyles = () => {
    if (!settings?.theme) return {};
    const themeColors =
      settings.theme[currentTheme === "dark" ? "darkMode" : "lightMode"].colors;
    const safeColor =
      typeof flatProps.textColor === "string" &&
      flatProps.textColor.trim() !== ""
        ? flatProps.textColor
        : undefined;
    return {
      color: safeColor || themeColors.text,
    };
  };

  // --- Container style and classes ---
  const fallbackBg =
    settings?.theme[currentTheme === "dark" ? "darkMode" : "lightMode"].colors
      .background;
  const safeBackgroundColor =
    typeof adv.backgroundColor === "string" && adv.backgroundColor.trim() !== ""
      ? adv.backgroundColor
      : undefined;
  const containerStyle: React.CSSProperties = {
    width: width || (flatProps.fullBleed ? "100vw" : undefined),
    height: height || undefined,
    maxWidth: width ? undefined : maxWidth || undefined,
    marginTop: adv.marginTop,
    marginBottom: adv.marginBottom,
    padding: adv.padding,
    backgroundColor:
      safeBackgroundColor ||
      (typeof fallbackBg === "string" ? fallbackBg : undefined),
    position: adv.overlayColor ? "relative" : undefined,
    overflow: "visible",
    ...getThemeStyles(),
  };

  // Size class (if no explicit width)
  const sizeClass = !width && !flatProps.fullBleed ? getSizeClass(size) : "";

  // --- Aspect ratio logic ---
  const aspectRatioClass = getAspectRatioClass(aspectRatio);
  const shouldUseAspectRatio = !!aspectRatioClass;

  // --- Overlay style ---
  const getOverlayStyle = (): React.CSSProperties => {
    const themeColors =
      settings?.theme[currentTheme === "dark" ? "darkMode" : "lightMode"]
        .colors;
    const themeOverlays =
      settings?.theme[currentTheme === "dark" ? "darkMode" : "lightMode"]
        .overlays;

    return {
      backgroundColor:
        flatProps.theme?.overlayColor ||
        themeOverlays?.color ||
        themeColors?.primary ||
        "#000000",
      opacity: flatProps.theme?.overlayOpacity ?? themeOverlays?.opacity ?? 0.3,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    };
  };

  // --- Shared overlay/image classes for border radius and hover effects ---
  const sharedOverlayClasses = [
    getBorderRadiusClass(adv.borderRadius),
    adv.hoverEffect === "zoom"
      ? "transition-transform duration-300 group-hover:scale-105"
      : "",
    adv.hoverEffect === "colorShift" ? "group-hover:brightness-75" : "",
    adv.hoverEffect === "blur" ? "group-hover:blur-sm" : "",
    "transition-colors duration-300",
  ]
    .filter(Boolean)
    .join(" ");

  // --- Image class ---
  const imgClass = [
    "w-full h-full",
    getBoxShadowClass(adv.boxShadow),
    shouldUseAspectRatio
      ? objectFit
        ? getObjectFitClass(objectFit)
        : "object-cover"
      : getObjectFitClass(objectFit),
    visibilityClass,
    "transition-colors duration-300",
  ]
    .filter(Boolean)
    .join(" ");

  // Prefer asset's fields, but overwrite with section overrides if present
  const finalCaption = showCaption
    ? altCaption?.en ||
      image?.altCaption?.en ||
      caption?.en ||
      image?.caption?.en
    : undefined;
  const finalAlt =
    altDescription?.en ||
    image?.altDescription?.en ||
    image?.description?.en ||
    "";
  const finalTitle = image?.title?.en || "";

  // Get title display classes based on mode
  const getTitleDisplayClasses = (mode?: string) => {
    const baseClasses = "text-white"; // Default, can be overridden by theme
    const spacing = flatProps.theme?.spacing?.title || "mt-2";
    const padding = flatProps.theme?.spacing?.padding || "p-4";

    switch (mode) {
      case "overlay-top":
        return `absolute top-0 left-0 right-0 ${padding} ${baseClasses}`;
      case "overlay-bottom":
        return `absolute bottom-0 left-0 right-0 ${padding} ${baseClasses}`;
      case "overlay-center":
        return `absolute inset-0 flex flex-col items-center justify-center ${padding} ${baseClasses}`;
      case "hover":
        return `absolute inset-0 flex flex-col items-center justify-center ${padding} ${baseClasses} opacity-0 group-hover:opacity-100 transition-opacity duration-300`;
      case "below":
        return `${spacing} text-lg font-medium ${baseClasses}`;
      default:
        return baseClasses;
    }
  };

  // --- Render image with aspect ratio or fixed dimensions ---
  const renderImageContent = () => (
    <>
      {image?.url && (
        <Image
          src={image.url}
          alt={finalAlt}
          width={width ? parseInt(width) : 800}
          height={height ? parseInt(height) : 600}
          className={imgClass}
        />
      )}
      {flatProps.titleDisplayMode !== "none" && finalTitle && (
        <div className={getTitleDisplayClasses(flatProps.titleDisplayMode)}>
          {(flatProps.titleDisplayMode?.includes("overlay") ||
            flatProps.titleDisplayMode === "hover") && (
            <div style={getOverlayStyle()} />
          )}
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
    </>
  );

  let imgElement = null;
  if (shouldUseAspectRatio) {
    imgElement = (
      <div
        className={`relative group ${aspectRatioClass} ${sizeClass} ${sharedOverlayClasses}`}
      >
        {renderImageContent()}
      </div>
    );
  } else {
    imgElement = (
      <div className={`relative group ${sizeClass} ${sharedOverlayClasses}`}>
        {renderImageContent()}
      </div>
    );
  }

  // --- Link wrapper ---
  const content = linkUrl ? (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {imgElement}
    </a>
  ) : (
    imgElement
  );

  // --- Outer container ---
  return (
    <div
      className={`flex ${flexJustify} ${visibilityClass} transition-colors duration-300`}
      style={containerStyle}
    >
      <section
        style={{
          width: width || (!flatProps.fullBleed && size ? undefined : "100%"),
        }}
      >
        {content}
      </section>
    </div>
  );
};

export default ImageSection;
