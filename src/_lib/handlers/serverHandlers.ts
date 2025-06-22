import { createSanityClient } from "@/_lib/config/sanity";

export interface ImageAsset {
  _id: string;
  url: string;
  title?: { en: string };
  description?: { en: string };
  alt?: { en: string };
  width?: number;
  height?: number;
}

export interface SvgAsset {
  _id: string;
  svgData: string;
  title?: { en: string };
  description?: { en: string };
}

export interface VideoAsset {
  _id: string;
  url: string;
  title?: { en: string };
  description?: { en: string };
  duration?: number;
  width?: number;
  height?: number;
  cdn4kUrl?: string;
  cdn2kUrl?: string;
  cdn1kUrl?: string;
  cdnSdUrl?: string;
}

// Server-side image asset fetching
export async function getImageAssetServer({
  id,
}: {
  id: string;
}): Promise<ImageAsset | null> {
  try {
    const client = createSanityClient();

    const query = `*[_type == "assetPhoto" && _id == $id][0]{
      _id,
      url,
      title,
      description,
      altText
    }`;

    const imageAsset = await client.fetch<ImageAsset>(query, { id });

    if (!imageAsset) {
      console.warn(`Image asset not found for id: ${id}`);
      return null;
    }

    return imageAsset;
  } catch (error) {
    console.error("Error fetching image asset (server):", error);
    return null;
  }
}

// Server-side SVG asset fetching
export async function getSvgAssetServer({
  id,
}: {
  id: string;
}): Promise<SvgAsset | null> {
  try {
    const client = createSanityClient();

    const query = `*[_type == "assetSVG" && _id == $id][0]{
      _id,
      svgData,
      title,
      description
    }`;

    const svgAsset = await client.fetch<SvgAsset>(query, { id });

    if (!svgAsset) {
      console.warn(`SVG asset not found for id: ${id}`);
      return null;
    }

    return svgAsset;
  } catch (error) {
    console.error("Error fetching SVG asset (server):", error);
    return null;
  }
}

// Server-side video asset fetching
export async function getVideoAssetServer({
  id,
}: {
  id: string;
}): Promise<VideoAsset | null> {
  try {
    const client = createSanityClient();

    const query = `*[_type == "assetVideo" && _id == $id][0]{
      _id,
      cdn4kUrl,
      cdn2kUrl,
      cdn1kUrl,
      cdnSdUrl,
      title,
      description
    }`;

    const videoAsset = await client.fetch<VideoAsset>(query, { id });

    if (!videoAsset) {
      console.warn(`Video asset not found for id: ${id}`);
      return null;
    }

    // Use the best available URL (4K > 2K > 1K > SD)
    const url =
      videoAsset.cdn4kUrl ||
      videoAsset.cdn2kUrl ||
      videoAsset.cdn1kUrl ||
      videoAsset.cdnSdUrl;

    return {
      ...videoAsset,
      url: url || "",
    };
  } catch (error) {
    console.error("Error fetching video asset (server):", error);
    return null;
  }
}
