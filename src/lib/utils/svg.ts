export function normalizeSvg(svgData: string): string {
  if (!svgData) return "";
  let normalized = svgData.trim();

  // Remove XML declaration, DOCTYPE, comments
  normalized = normalized.replace(/<\?xml[^>]*>/g, "");
  normalized = normalized.replace(/<!DOCTYPE[^>]*>/gi, "");
  normalized = normalized.replace(/<!--([\s\S]*?)-->/g, "");

  // Extract the <svg>...</svg> content
  const svgMatch = normalized.match(/<svg[\s\S]*?<\/svg>/i);
  if (!svgMatch) return "";
  const svgContent = svgMatch[0];

  // Extract width/height if present
  let viewBox = "";
  const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/i);
  if (viewBoxMatch) {
    viewBox = viewBoxMatch[1];
  } else {
    // Try to infer from width/height
    const widthMatch = svgContent.match(/width="([0-9.]+)"/i);
    const heightMatch = svgContent.match(/height="([0-9.]+)"/i);
    if (widthMatch && heightMatch) {
      viewBox = `0 0 ${widthMatch[1]} ${heightMatch[1]}`;
    } else {
      viewBox = "0 0 100 100";
    }
  }

  // Remove any potentially dangerous tags and attributes
  const cleanSvg = svgContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Only keep allowed shape elements
  const shapeRegex =
    /<(path|rect|circle|ellipse|polygon|polyline|line)([\s\S]*?)(\/>|<\/\1>)/gi;
  let shapes = "";
  let match;
  while ((match = shapeRegex.exec(cleanSvg)) !== null) {
    const tag = match[1];
    const attrs = match[2];
    // Only keep essential attributes
    let allowedAttrs = "";
    const attrRegex = /(d|points|x|y|r|cx|cy|rx|ry|x1|y1|x2|y2)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      allowedAttrs += ` ${attrMatch[1]}="${attrMatch[2]}"`;
    }
    shapes += `<${tag}${allowedAttrs} />`;
  }

  // Build clean SVG
  const cleanSvgContent = `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${shapes}</svg>`;
  return cleanSvgContent;
}

export function sanitizeSvg(svgContent: string): string {
  if (!svgContent) return "";

  // Remove script tags and their content
  let sanitized = svgContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Remove data: URLs (potential security risk)
  sanitized = sanitized.replace(/data:/gi, "");

  // Remove external references
  sanitized = sanitized.replace(/xlink:href\s*=\s*["'][^"']*["']/gi, "");

  return sanitized;
}

export function cleanApiResponse(response: unknown): unknown {
  if (Array.isArray(response)) {
    return response.map(cleanApiResponse);
  }

  if (response && typeof response === "object") {
    const cleaned: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(response)) {
      // Skip internal fields
      if (
        key.startsWith("_") ||
        key === "id" ||
        key === "createdAt" ||
        key === "updatedAt"
      ) {
        continue;
      }

      cleaned[key] = cleanApiResponse(value);
    }

    return cleaned;
  }

  return response;
}
