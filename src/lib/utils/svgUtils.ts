export function processSvg(
  svgContent: string,
  color?: string,
  recolor: boolean = false,
): string {
  if (!svgContent) return "";

  // Basic SVG validation and processing
  const trimmed = svgContent.trim();

  // Handle XML declarations and extract SVG content
  const svgStart = trimmed.indexOf("<svg");
  if (svgStart === -1) {
    throw new Error("Invalid SVG content: must contain <svg tag");
  }

  const svgEnd = trimmed.indexOf("</svg>");
  if (svgEnd === -1) {
    throw new Error("Invalid SVG content: must contain </svg> tag");
  }

  const svgPart = trimmed.substring(svgStart, svgEnd + 6);

  // Basic sanitization - remove script tags for security
  let sanitized = svgPart.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  // Apply color if specified and recolor is enabled
  if (color && recolor) {
    const hexColor = color.startsWith("#") ? color : `#${color}`;

    // Replace existing fill attributes with the specified color
    sanitized = sanitized.replace(
      /fill=["']([^"']*)["']/gi,
      `fill="${hexColor}"`,
    );

    // Add fill to elements that don't have it (but be more careful)
    sanitized = sanitized.replace(
      /<([a-z]+)([^>]*?)(?:\s+fill=["'][^"']*["'])?([^>]*?)>/gi,
      (match, tag, attrs1, attrs2) => {
        // Skip if already has fill or is a specific tag that shouldn't be filled
        if (
          match.includes("fill=") ||
          ["defs", "g", "svg", "title", "desc", "metadata"].includes(tag)
        ) {
          return match;
        }
        // Only add fill to visual elements that should have it
        if (
          [
            "path",
            "rect",
            "circle",
            "ellipse",
            "polygon",
            "polyline",
            "line",
            "text",
          ].includes(tag)
        ) {
          return `<${tag}${attrs1}${attrs2} fill="${hexColor}">`;
        }
        return match;
      },
    );
  }

  // Normalize SVG for preview - ensure it has proper dimensions
  if (!sanitized.includes("width=") && !sanitized.includes("height=")) {
    sanitized = sanitized.replace(
      /<svg([^>]*)>/i,
      '<svg$1 width="24" height="24">',
    );
  }

  // Ensure SVG has viewBox if not present
  if (!sanitized.includes("viewBox=")) {
    const widthMatch = sanitized.match(/width=["']([^"']+)["']/);
    const heightMatch = sanitized.match(/height=["']([^"']+)["']/);

    if (widthMatch && heightMatch) {
      const width = widthMatch[1];
      const height = heightMatch[1];
      sanitized = sanitized.replace(
        /<svg([^>]*)>/i,
        `<svg$1 viewBox="0 0 ${width} ${height}">`,
      );
    }
  }

  return sanitized;
}

export function validateSvg(svgContent: string): boolean {
  if (!svgContent) return false;

  const trimmed = svgContent.trim();

  // Check if it's a valid SVG
  return trimmed.startsWith("<svg") && trimmed.includes("</svg>");
}

export function extractSvgDimensions(svgContent: string): {
  width?: string;
  height?: string;
} {
  if (!svgContent) return {};

  const widthMatch = svgContent.match(/width=["']([^"']+)["']/);
  const heightMatch = svgContent.match(/height=["']([^"']+)["']/);

  return {
    width: widthMatch?.[1],
    height: heightMatch?.[1],
  };
}

export function createSvgPreview(
  svgContent: string,
  color?: string,
  recolor: boolean = false,
): string {
  try {
    const result = processSvg(svgContent, color, recolor);
    if (color && recolor && !result) {
      console.warn("SVG processing returned empty result with color:", color);
    }
    return result;
  } catch (error) {
    console.warn("SVG processing failed:", error);
    return "";
  }
}
