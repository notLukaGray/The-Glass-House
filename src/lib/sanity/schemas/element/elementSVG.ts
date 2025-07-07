import React from "react";
import {
  createBaseElementSchema,
  createSvgFields,
  createColorField,
  createRecolorField,
} from "./baseElementSchema";
import { createSvgPreview } from "../../../utils/svgUtils";
import {
  sizeAndPositionFields,
  displayAndTransformFields,
} from "../objects/casting/sharedCastingFields";

const base = createBaseElementSchema(
  "elementSVG",
  "SVG Element",
  "svg",
  // Use the createSvgFields function from baseElementSchema
  createSvgFields(
    "svg",
    "SVG",
    "Enter SVG code, icon name, or path to SVG",
    "content",
  ),
  [
    // Add color field for SVG customization
    createColorField(
      "color",
      "Color",
      "Hex color code (without #) to apply to the SVG",
      "content",
    ),
    // Add recolor control field
    createRecolorField(
      "recolor",
      "Recolor SVG",
      "Apply the color to the SVG (unchecked preserves original colors)",
      "content",
    ),
  ],
);

// Create preview configuration separately to avoid TypeScript strict typing
const previewConfig = {
  select: {
    title: "title.en",
    alternativeTitle: "alternativeTitle.en",
    description: "description.en",
    svgSource: "svgSource",
    svgString: "svgString",
    color: "color",
    recolor: "recolor",
  },
  prepare(selection: {
    title?: string;
    alternativeTitle?: string;
    description?: string;
    svgSource?: string;
    svgString?: string;
    color?: string;
    recolor?: boolean;
  }) {
    const {
      title,
      alternativeTitle,
      description,
      svgSource,
      svgString,
      color,
      recolor,
    } = selection;

    const displayTitle =
      alternativeTitle || title || description || "Untitled SVG";

    let displaySubtitle = "SVG Element";
    let displayMedia: React.ReactElement = React.createElement(
      "div",
      {
        style: {
          width: 40,
          height: 40,
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#666",
        },
      },
      "SVG",
    );

    // Always try to render SVG if we have SVG content, regardless of source
    if (
      svgString &&
      svgString.trim() &&
      (svgString.trim().startsWith("<svg") || svgString.trim().includes("<svg"))
    ) {
      try {
        const processedSvg = createSvgPreview(
          svgString,
          color,
          recolor || false,
        );

        if (processedSvg) {
          displayMedia = React.createElement("div", {
            style: {
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
              overflow: "hidden",
            },
            dangerouslySetInnerHTML: { __html: processedSvg },
          });
          displaySubtitle = "SVG Content";
        }
      } catch {
        displaySubtitle = "Failed to load SVG";
      }
    } else if (svgSource === "upload") {
      displaySubtitle = "Uploaded SVG File";
    } else if (svgString && svgString.trim()) {
      // Not valid SVG, show as text
      displaySubtitle =
        svgString.length > 30 ? `${svgString.substring(0, 30)}...` : svgString;
    }

    return {
      title: displayTitle,
      subtitle: displaySubtitle,
      media: displayMedia,
    };
  },
};

// Override the preview with proper type assertion
base.preview = previewConfig as unknown as typeof base.preview;

export const elementSVGCastingFields = [
  { name: "sizeAndPosition", type: "object", fields: sizeAndPositionFields },
  {
    name: "displayAndTransform",
    type: "object",
    fields: displayAndTransformFields,
  },
];

export default base;
