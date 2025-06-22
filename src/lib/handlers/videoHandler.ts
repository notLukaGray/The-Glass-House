import { client } from "@/lib/handlers/sanity";

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

export interface VideoAssetQuery {
  id?: string;
  title?: string;
  order?: number;
}

export async function getVideoAsset(
  query: VideoAssetQuery,
): Promise<VideoAsset | null> {
  const { id, title, order } = query;

  let groqQuery = `*[_type == "assetVideo"`;

  if (id) {
    groqQuery += ` && _id == "${id}"`;
  }
  if (title) {
    groqQuery += ` && title.en match "${title}"`;
  }
  if (order !== undefined) {
    groqQuery += ` && order == ${order}`;
  }

  groqQuery += `][0]`;

  try {
    const asset = await client.fetch<VideoAsset>(groqQuery);
    return asset || null;
  } catch (error) {
    console.error("Error fetching video asset:", error);
    return null;
  }
}

export async function getVideoAssets(
  query?: Partial<VideoAssetQuery>,
): Promise<VideoAsset[]> {
  let groqQuery = `*[_type == "assetVideo"`;

  if (query) {
    const { title, order } = query;

    if (title) {
      groqQuery += ` && title.en match "${title}"`;
    }
    if (order !== undefined) {
      groqQuery += ` && order == ${order}`;
    }
  }

  groqQuery += `] | order(order asc)`;

  try {
    const assets = await client.fetch<VideoAsset[]>(groqQuery);
    return assets || [];
  } catch (error) {
    console.error("Error fetching video assets:", error);
    return [];
  }
}

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
