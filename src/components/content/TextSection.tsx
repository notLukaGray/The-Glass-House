"use client";
import React from "react";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { useSettings } from "@/components/providers/SettingsProvider";
import {
  Positioning,
  Effects,
  PositioningAdvanced,
  ResolvedContentBlock,
} from "@/types/content";
import { sanitizeString } from "@/lib/utils/string";

interface TextSectionProps {
  content: ResolvedContentBlock[];
  positioning?: Positioning;
  effects?: Effects;
  positioningAdvanced?: PositioningAdvanced;
  textAlign?: string;
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

function getBlockAlignmentClass(alignment?: string) {
  switch (alignment) {
    case "left":
      return "mx-0";
    case "center":
      return "mx-auto";
    case "right":
      return "ml-auto";
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

function getTextAlignClass(textAlign?: string) {
  switch (textAlign) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    case "justify":
      return "text-justify";
    default:
      return "text-left";
  }
}

const TextSection: React.FC<TextSectionProps> = (props) => {
  const { settings, currentTheme } = useSettings();

  // Flatten nested fields into top-level props
  const {
    positioning = {},
    effects = {},
    positioningAdvanced = {},
    textAlign, // section-wide alignment
    ...rest
  } = props;
  const flatProps = {
    ...rest,
    ...positioning,
    ...effects,
    ...positioningAdvanced,
  };

  // Use content directly since assets should be pre-resolved on server
  const resolvedContent = props.content || [];

  if (!resolvedContent.length) return null;

  // Sanitize all relevant string props
  const size = sanitizeString(flatProps.size);
  const width = sanitizeString(flatProps.width);
  const maxWidth = sanitizeString(flatProps.maxWidth);
  const blockAlignment = sanitizeString(flatProps.blockAlignment);
  const borderRadius = sanitizeString(flatProps.borderRadius);
  const boxShadow = sanitizeString(flatProps.boxShadow);
  const margin = sanitizeString(flatProps.margin);
  const padding = sanitizeString(flatProps.padding);
  const sanitizedTextAlign = sanitizeString(textAlign);

  // Responsive visibility
  let visibilityClass = "";
  if (flatProps.hideOnMobile) visibilityClass += " hidden sm:block";
  if (flatProps.hideOnDesktop) visibilityClass += " block sm:hidden";

  // Get theme-aware styles
  const getThemeStyles = () => {
    if (!settings?.theme) return {};

    const themeColors =
      settings.theme[currentTheme === "dark" ? "darkMode" : "lightMode"].colors;
    const typography = settings.theme.typography;

    return {
      color: flatProps.textColor || themeColors.text,
      backgroundColor: flatProps.backgroundColor || undefined,
      fontFamily: flatProps.fontFamily || typography.bodyFont,
    };
  };

  // --- Container style and classes ---
  const containerStyle: React.CSSProperties = {
    width: width || (flatProps.fullBleed ? "100vw" : undefined),
    maxWidth: width ? undefined : maxWidth || undefined,
    margin: margin,
    padding: padding,
    ...getThemeStyles(),
  };

  // Size class (if no explicit width)
  const sizeClass = !width && !flatProps.fullBleed ? getSizeClass(size) : "";

  // --- Shared classes ---
  const sharedClasses = [
    getBlockAlignmentClass(blockAlignment),
    visibilityClass,
  ]
    .filter(Boolean)
    .join(" ");

  // --- Section-wide text alignment for all blocks ---
  const blockComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p
          className={`mb-4 ${getTextAlignClass(sanitizedTextAlign || "left")}`}
        >
          {children}
        </p>
      ),
      h1: ({ children }) => (
        <h1
          className={`text-4xl font-bold mb-4 ${getTextAlignClass(sanitizedTextAlign || "left")}`}
        >
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2
          className={`text-3xl font-bold mb-3 ${getTextAlignClass(sanitizedTextAlign || "left")}`}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className={`text-2xl font-bold mb-2 ${getTextAlignClass(sanitizedTextAlign || "left")}`}
        >
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4
          className={`text-xl font-bold mb-2 ${getTextAlignClass(sanitizedTextAlign || "left")}`}
        >
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className={`border-l-4 pl-4 italic ${getTextAlignClass(sanitizedTextAlign || "left")}`}
        >
          {children}
        </blockquote>
      ),
      default: ({ children }) => (
        <p
          className={`mb-4 ${getTextAlignClass(sanitizedTextAlign || "left")}`}
        >
          {children}
        </p>
      ),
    },
    marks: {
      underline: ({ children }) => <u>{children}</u>,
      color: ({ children, value }) => {
        const hex = value?.color?.hex || "#000";
        return <span style={{ color: hex }}>{children}</span>;
      },
    },
    types: {
      asset: ({ value }: { value: unknown }) => {
        if (!value || !(value as { _ref?: string })._ref) return null;
        const assetValue = value as {
          _resolvedType?: string;
          url?: string;
          description?: { en?: string };
          svgData?: string;
          cdnSdUrl?: string;
          name?: string;
        };
        if (assetValue._resolvedType === "image") {
          return (
            <Image
              src={assetValue.url || ""}
              alt={assetValue.description?.en || ""}
              width={800}
              height={600}
              style={{ maxWidth: "100%" }}
              className="w-full h-auto"
            />
          );
        }
        if (assetValue._resolvedType === "svg") {
          return (
            <span
              dangerouslySetInnerHTML={{ __html: assetValue.svgData || "" }}
            />
          );
        }
        if (assetValue._resolvedType === "video") {
          return (
            <video
              src={assetValue.cdnSdUrl}
              controls
              style={{ maxWidth: "100%" }}
            />
          );
        }
        if (assetValue._resolvedType === "social") {
          return (
            <a href={assetValue.url} target="_blank" rel="noopener noreferrer">
              {assetValue.name}
            </a>
          );
        }
        return <span style={{ color: "red" }}>[Unknown asset type]</span>;
      },
      assetSVG: ({ value }: { value: { svgData: string } }) => {
        return <span dangerouslySetInnerHTML={{ __html: value.svgData }} />;
      },
      assetPhoto: ({
        value,
      }: {
        value: { url: string; description?: { en?: string } };
      }) => {
        return (
          <Image
            src={value.url}
            alt={value.description?.en || ""}
            width={800}
            height={600}
            style={{ maxWidth: "100%" }}
            className="w-full h-auto"
          />
        );
      },
      assetVideo: ({ value }: { value: { cdnSdUrl: string } }) => {
        return (
          <video src={value.cdnSdUrl} controls style={{ maxWidth: "100%" }} />
        );
      },
      asset3d: ({ value }: { value: { title?: { en?: string } } }) => {
        return <span>[3D Asset: {value.title?.en || "Untitled"}]</span>;
      },
    },
  };

  return (
    <div
      className={`flex ${flatProps.fullBleed ? "w-full" : ""} ${visibilityClass} transition-colors duration-300`}
      style={containerStyle}
    >
      <section
        className={`${sizeClass} ${sharedClasses} ${getBoxShadowClass(boxShadow)} ${getBorderRadiusClass(borderRadius)} overflow-hidden`}
        style={{
          width: width || (!flatProps.fullBleed && size ? undefined : "100%"),
        }}
      >
        <PortableText value={resolvedContent} components={blockComponents} />
      </section>
    </div>
  );
};

export default TextSection;
