// Client-side handlers that use API routes instead of direct Sanity client

export interface SvgAsset {
  _id: string;
  _type: "assetSVG";
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
  color: string;
  order: number;
  svgData: string;
}

export interface ImageAsset {
  _id: string;
  _type: "assetPhoto";
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
  altText: {
    _type: "localeString";
    en: string;
  };
  order: number;
  url: string;
}

export interface VideoAsset {
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
  poster: string;
  sourceType: "cdn";
  cdnSdUrl: string;
  cdn1kUrl: string;
  cdn2kUrl: string;
  cdn4kUrl: string;
}

export interface SvgAssetQuery {
  id?: string;
  title?: string;
  color?: string;
  order?: number;
}

export interface ImageAssetQuery {
  id?: string;
  title?: string;
  order?: number;
}

export interface VideoAssetQuery {
  id?: string;
  title?: string;
  order?: number;
}

export interface SocialAsset {
  _id: string;
  _type: string; // e.g., 'website', 'assetSocial', etc.
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  url: string;
  icon?: { _ref: string; _type: "reference" };
}

export interface SocialAssetQuery {
  id?: string;
  ids?: string[];
  type?: string; // e.g., 'website', 'assetSocial', etc.
}

// Get the correct base URL for the current environment
function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  return "http://localhost:3000";
}

// Client-side SVG handler
export async function getSvgAsset(
  query: SvgAssetQuery,
): Promise<SvgAsset | null> {
  const { id } = query;

  if (!id) {
    console.error("SVG ID is required for client-side fetch");
    return null;
  }

  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/assets/svg/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching SVG asset:", error);
    return null;
  }
}

// Client-side SVG assets handler (for multiple assets)
export async function getSvgAssets(
  query?: Partial<SvgAssetQuery>,
): Promise<SvgAsset[]> {
  try {
    const params = new URLSearchParams();
    if (query?.title) params.append("title", query.title);
    if (query?.color) params.append("color", query.color);
    if (query?.order !== undefined)
      params.append("order", query.order.toString());

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/assets/svg${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching SVG assets:", error);
    return [];
  }
}

// Client-side image handler
export async function getImageAsset(
  query: ImageAssetQuery,
): Promise<ImageAsset | null> {
  const { id } = query;

  if (!id) {
    console.error("Image ID is required for client-side fetch");
    return null;
  }

  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/assets/image/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching image asset:", error);
    return null;
  }
}

// Client-side video handler
export async function getVideoAsset(
  query: VideoAssetQuery,
): Promise<VideoAsset | null> {
  const { id } = query;

  if (!id) {
    console.error("Video ID is required for client-side fetch");
    return null;
  }

  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/assets/video/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching video asset:", error);
    return null;
  }
}

// Video sources utility function
export function getVideoSources(
  asset: VideoAsset,
): { src: string; type: string; quality: string }[] {
  const sources = [];

  if (asset.cdn4kUrl) {
    sources.push({
      src: asset.cdn4kUrl,
      type: "video/webm",
      quality: "4K",
    });
  }

  if (asset.cdn2kUrl) {
    sources.push({
      src: asset.cdn2kUrl,
      type: "video/webm",
      quality: "1080p",
    });
  }

  if (asset.cdn1kUrl) {
    sources.push({
      src: asset.cdn1kUrl,
      type: "video/webm",
      quality: "720p",
    });
  }

  if (asset.cdnSdUrl) {
    sources.push({
      src: asset.cdnSdUrl,
      type: "video/webm",
      quality: "SD",
    });
  }

  return sources;
}

// Utility function to get colored SVG (client-side)
export function getColoredSvg(svgData: string, color: string): string {
  if (!svgData) return "";

  // Remove all style tags and their contents
  let cleanedSvg = svgData.replace(/<style>[\s\S]*?<\/style>/g, "");

  // Remove all defs and their contents
  cleanedSvg = cleanedSvg.replace(/<defs>[\s\S]*?<\/defs>/g, "");

  // Remove all gradient definitions
  cleanedSvg = cleanedSvg
    .replace(/<linearGradient[\s\S]*?<\/linearGradient>/g, "")
    .replace(/<radialGradient[\s\S]*?<\/radialGradient>/g, "")
    .replace(/<stop[\s\S]*?\/>/g, "");

  // Remove all class attributes
  cleanedSvg = cleanedSvg.replace(/class="[^"]*"/g, "");

  // Remove all fill-related attributes
  cleanedSvg = cleanedSvg
    .replace(/fill="[^"]*"/g, "")
    .replace(/fill-opacity="[^"]*"/g, "")
    .replace(/fill-rule="[^"]*"/g, "")
    .replace(/style="[^"]*fill:[^"]*"/g, 'style=""');

  // Remove all gradient-related attributes
  cleanedSvg = cleanedSvg
    .replace(/gradientUnits="[^"]*"/g, "")
    .replace(/gradientTransform="[^"]*"/g, "")
    .replace(/x1="[^"]*"/g, "")
    .replace(/y1="[^"]*"/g, "")
    .replace(/x2="[^"]*"/g, "")
    .replace(/y2="[^"]*"/g, "")
    .replace(/offset="[^"]*"/g, "")
    .replace(/stop-color="[^"]*"/g, "");

  // Remove all stroke-related attributes
  cleanedSvg = cleanedSvg
    .replace(/stroke="[^"]*"/g, "")
    .replace(/stroke-width="[^"]*"/g, "")
    .replace(/stroke-linecap="[^"]*"/g, "")
    .replace(/stroke-linejoin="[^"]*"/g, "")
    .replace(/stroke-opacity="[^"]*"/g, "")
    .replace(/stroke-dasharray="[^"]*"/g, "")
    .replace(/stroke-dashoffset="[^"]*"/g, "")
    .replace(/style="[^"]*stroke:[^"]*"/g, 'style=""');

  // Add our color as both fill and stroke to all paths and shapes
  cleanedSvg = cleanedSvg
    .replace(
      /<(path|rect|circle|ellipse|polygon|polyline|line)/g,
      `<$1 fill="${color}" stroke="${color}"`,
    )
    .replace(
      /<(path|rect|circle|ellipse|polygon|polyline|line)([^>]*?)(\/>|>)/g,
      (match, tag, attrs, end) => {
        if (attrs.includes("fill=") || attrs.includes("stroke=")) {
          return match;
        }
        return `<${tag}${attrs} fill="${color}" stroke="${color}"${end}`;
      },
    );

  return cleanedSvg;
}

// Client-side social handler
export async function getSocialAsset(
  query: SocialAssetQuery,
): Promise<SocialAsset | null> {
  const { id, type } = query;

  if (!id) {
    console.error("Social asset ID is required for client-side fetch");
    return null;
  }

  try {
    const params = new URLSearchParams();
    if (type) params.append("type", type);

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/social/${id}${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching social asset:", error);
    return null;
  }
}

// Client-side social assets handler (for multiple assets)
export async function getSocialAssets(
  query: SocialAssetQuery,
): Promise<SocialAsset[]> {
  try {
    const params = new URLSearchParams();
    if (query.type) params.append("type", query.type);
    if (query.ids && query.ids.length > 0) {
      query.ids.forEach((id) => params.append("ids", id));
    }

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/social${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching social assets:", error);
    return [];
  }
}
