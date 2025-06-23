import { getBaseUrl } from "@/lib/utils/getBaseUrl";

export interface SvgAsset {
  _id: string;
  _type: "assetSVG";
  svgData: string;
  color?: string;
}

export interface ImageAsset {
  _id: string;
  _type: "assetPhoto";
  url: string;
  alt?: string;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
  };
}

export interface VideoAsset {
  _id: string;
  _type: "assetVideo";
  url: string;
  title?: string;
  caption?: { en?: string };
  poster?: string;
  cdn4kUrl?: string;
  cdn2kUrl?: string;
  cdn1kUrl?: string;
  cdnSdUrl?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
  };
}

export interface SocialAsset {
  _id: string;
  _type: string;
  platform: string;
  url: string;
  icon?: {
    _id: string;
    svgData: string;
    color?: string;
  };
}

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
  icon?: {
    _id: string;
    svgData: string;
    color?: string;
  };
}

export interface SocialAssetsResponse {
  success: boolean;
  data?: SocialAsset[];
  error?: string;
}

export interface SvgAssetsResponse {
  success: boolean;
  data?: SvgAsset[];
  error?: string;
}

export interface ImageAssetsResponse {
  success: boolean;
  data?: ImageAsset[];
  error?: string;
}

export interface VideoAssetsResponse {
  success: boolean;
  data?: VideoAsset[];
  error?: string;
}

export interface SocialLinksResponse {
  success: boolean;
  data?: SocialLink[];
  error?: string;
}

export const clientHandlers = {
  async getSvgAsset(id: string): Promise<SvgAsset | null> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/assets/svg/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch SVG asset: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error("[clientHandlers] Failed to fetch SVG asset:", error);
      return null;
    }
  },

  async getSvgAssets(ids: string[]): Promise<SvgAsset[]> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/assets/svg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch SVG assets: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error("[clientHandlers] Failed to fetch SVG assets:", error);
      return [];
    }
  },

  async getImageAsset(id: string): Promise<ImageAsset | null> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/assets/image/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch image asset: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error("[clientHandlers] Failed to fetch image asset:", error);
      return null;
    }
  },

  async getImageAssets(ids: string[]): Promise<ImageAsset[]> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/assets/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image assets: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error("[clientHandlers] Failed to fetch image assets:", error);
      return [];
    }
  },

  async getVideoAsset(id: string): Promise<VideoAsset | null> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/assets/video/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch video asset: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error("[clientHandlers] Failed to fetch video asset:", error);
      return null;
    }
  },

  async getVideoAssets(ids: string[]): Promise<VideoAsset[]> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/assets/video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch video assets: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error("[clientHandlers] Failed to fetch video assets:", error);
      return [];
    }
  },

  getVideoSources(videoAsset: VideoAsset): { quality: string; src: string }[] {
    if (!videoAsset) return [];
    const sources: { quality: string; src: string }[] = [];
    if (videoAsset.cdn4kUrl)
      sources.push({ quality: "2160p", src: videoAsset.cdn4kUrl });
    if (videoAsset.cdn2kUrl)
      sources.push({ quality: "1080p", src: videoAsset.cdn2kUrl });
    if (videoAsset.cdn1kUrl)
      sources.push({ quality: "720p", src: videoAsset.cdn1kUrl });
    if (videoAsset.cdnSdUrl)
      sources.push({ quality: "480p", src: videoAsset.cdnSdUrl });
    if (videoAsset.url) sources.push({ quality: "auto", src: videoAsset.url });
    return sources;
  },

  getColoredSvg(svgData: string, color: string): string {
    if (!svgData || !color) return svgData;

    let svg = svgData;

    svg = svg.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    svg = svg.replace(/<defs[^>]*>[\s\S]*?<\/defs>/gi, "");
    svg = svg.replace(/<linearGradient[^>]*>[\s\S]*?<\/linearGradient>/gi, "");
    svg = svg.replace(/<radialGradient[^>]*>[\s\S]*?<\/radialGradient>/gi, "");
    svg = svg.replace(/<pattern[^>]*>[\s\S]*?<\/pattern>/gi, "");
    svg = svg.replace(/class="[^"]*"/gi, "");
    svg = svg.replace(/fill="[^"]*"/gi, "");
    svg = svg.replace(/fill-opacity="[^"]*"/gi, "");
    svg = svg.replace(/fill-rule="[^"]*"/gi, "");
    svg = svg.replace(/stroke="[^"]*"/gi, "");
    svg = svg.replace(/stroke-width="[^"]*"/gi, "");
    svg = svg.replace(/stroke-linecap="[^"]*"/gi, "");
    svg = svg.replace(/stroke-linejoin="[^"]*"/gi, "");
    svg = svg.replace(/stroke-dasharray="[^"]*"/gi, "");
    svg = svg.replace(/stroke-dashoffset="[^"]*"/gi, "");
    svg = svg.replace(/stroke-opacity="[^"]*"/gi, "");
    svg = svg.replace(/stroke-miterlimit="[^"]*"/gi, "");

    svg = svg.replace(
      /<(path|circle|ellipse|line|polyline|polygon|rect|text|g)([^>]*)>/gi,
      `<$1$2 fill="${color}" stroke="${color}">`,
    );

    return svg;
  },

  async getSocialAsset(id: string): Promise<SocialAsset | null> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/social/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch social asset: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error("[clientHandlers] Failed to fetch social asset:", error);
      return null;
    }
  },

  async getSocialAssets(ids: string[]): Promise<SocialAsset[]> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch social assets: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error("[clientHandlers] Failed to fetch social assets:", error);
      return [];
    }
  },
};

export const getSvgAsset = clientHandlers.getSvgAsset;
export const getSvgAssets = clientHandlers.getSvgAssets;
export const getImageAsset = clientHandlers.getImageAsset;
export const getImageAssets = clientHandlers.getImageAssets;
export const getVideoAsset = clientHandlers.getVideoAsset;
export const getVideoAssets = clientHandlers.getVideoAssets;
export const getVideoSources = clientHandlers.getVideoSources;
export const getColoredSvg = clientHandlers.getColoredSvg;
export const getSocialAsset = clientHandlers.getSocialAsset;
export const getSocialAssets = clientHandlers.getSocialAssets;
