import React from "react";
import {
  createBaseElementSchema,
  createSvgFields,
  createColorField,
  createRecolorField,
} from "./baseElementSchema";
import { processSvg } from "../../../utils/svgUtils";

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

    if (svgSource === "upload") {
      displaySubtitle = "Uploaded SVG File";
    } else if (svgSource === "string" && svgString) {
      displaySubtitle =
        svgString.length > 30 ? `${svgString.substring(0, 30)}...` : svgString;

      // Try to render the SVG if it looks like valid SVG code
      if (svgString.trim().startsWith("<svg")) {
        try {
          // Process SVG with recolor control
          const processedSvg = processSvg(svgString, color, recolor || false);

          displayMedia = React.createElement("div", {
            style: {
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#666",
            },
            dangerouslySetInnerHTML: { __html: processedSvg },
          });
        } catch {
          // Fallback to default if SVG rendering fails
        }
      }
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

export default base;
