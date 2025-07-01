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
  sourceType: "bunny" | "youtube" | "vimeo";
  bunnyVideoUrl?: string;
  youtubeUrl?: string;
  vimeoUrl?: string;
  // Extracted data for Bunny videos
  cdnDomain?: string | null;
  videoGuid?: string | null;
  libraryId?: string | null;
  // Video dimensions
  width?: number | null;
  height?: number | null;
}

export interface VideoAssetQuery {
  id?: string;
  title?: string;
  order?: number;
}

// Extract CDN domain from Bunny Video URL
async function extractBunnyCdnDomain(videoUrl: string): Promise<string | null> {
  try {
    const response = await fetch(videoUrl);
    const html = await response.text();
    const cdnMatch = html.match(/https:\/\/[^\/]*\.b-cdn\.net/);
    return cdnMatch ? cdnMatch[0] : null;
  } catch {
    return null;
  }
}

// Extract video GUID and library ID from Bunny Video URL
function extractBunnyVideoInfo(videoUrl: string): {
  videoGuid: string | null;
  libraryId: string | null;
} {
  try {
    const urlParts = videoUrl.split("/");
    const videoGuid = urlParts[urlParts.length - 1];
    const libraryId = urlParts[urlParts.length - 2];

    return {
      videoGuid: videoGuid || null,
      libraryId: libraryId || null,
    };
  } catch {
    return { videoGuid: null, libraryId: null };
  }
}

// Extract video dimensions from Bunny Video metadata
async function extractBunnyVideoDimensions(videoUrl: string): Promise<{
  width: number | null;
  height: number | null;
}> {
  try {
    const response = await fetch(videoUrl);
    const html = await response.text();

    // Extract width and height from og:video metadata
    const widthMatch = html.match(
      /<meta property="og:video:width" content="(\d+)">/,
    );
    const heightMatch = html.match(
      /<meta property="og:video:height" content="(\d+)">/,
    );

    const width = widthMatch ? parseInt(widthMatch[1], 10) : null;
    const height = heightMatch ? parseInt(heightMatch[1], 10) : null;

    return { width, height };
  } catch {
    return { width: null, height: null };
  }
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

    if (!asset) return null;

    // Extract additional data for Bunny videos
    if (asset.sourceType === "bunny" && asset.bunnyVideoUrl) {
      const { videoGuid, libraryId } = extractBunnyVideoInfo(
        asset.bunnyVideoUrl,
      );
      asset.videoGuid = videoGuid;
      asset.libraryId = libraryId;

      // Extract CDN domain server-side
      const cdnDomain = await extractBunnyCdnDomain(asset.bunnyVideoUrl);
      asset.cdnDomain = cdnDomain;

      // Extract video dimensions
      const { width, height } = await extractBunnyVideoDimensions(
        asset.bunnyVideoUrl,
      );
      asset.width = width;
      asset.height = height;
    }

    return asset;
  } catch {
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

    if (!assets || assets.length === 0) return [];

    // Process each asset to extract additional data
    const processedAssets = await Promise.all(
      assets.map(async (asset) => {
        if (asset.sourceType === "bunny" && asset.bunnyVideoUrl) {
          const { videoGuid, libraryId } = extractBunnyVideoInfo(
            asset.bunnyVideoUrl,
          );
          asset.videoGuid = videoGuid;
          asset.libraryId = libraryId;

          // Extract CDN domain server-side
          const cdnDomain = await extractBunnyCdnDomain(asset.bunnyVideoUrl);
          asset.cdnDomain = cdnDomain;

          // Extract video dimensions
          const { width, height } = await extractBunnyVideoDimensions(
            asset.bunnyVideoUrl,
          );
          asset.width = width;
          asset.height = height;
        }
        return asset;
      }),
    );

    return processedAssets;
  } catch {
    return [];
  }
}

// Helper function to build Bunny Video URLs
export function buildBunnyVideoUrls(
  asset: VideoAsset,
  quality: string = "720p",
): {
  iframeUrl: string;
  directUrl: string;
  thumbnailUrl: string;
} | null {
  if (
    asset.sourceType !== "bunny" ||
    !asset.cdnDomain ||
    !asset.videoGuid ||
    !asset.libraryId
  ) {
    return null;
  }

  return {
    iframeUrl: `https://iframe.mediadelivery.net/embed/${asset.libraryId}/${asset.videoGuid}`,
    directUrl: `${asset.cdnDomain}/${asset.videoGuid}/play_${quality}.mp4`,
    thumbnailUrl: `${asset.cdnDomain}/${asset.videoGuid}/thumbnail.jpg`,
  };
}

// Calculate natural aspect ratio from video dimensions
export function calculateNaturalAspectRatio(
  width: number | null,
  height: number | null,
): string | null {
  if (!width || !height) return null;

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const aspectWidth = width / divisor;
  const aspectHeight = height / divisor;

  // Return common aspect ratios or custom format
  if (aspectWidth === 16 && aspectHeight === 9) return "16:9";
  if (aspectWidth === 4 && aspectHeight === 3) return "4:3";
  if (aspectWidth === 1 && aspectHeight === 1) return "1:1";
  if (aspectWidth === 3 && aspectHeight === 4) return "3:4";
  if (aspectWidth === 9 && aspectHeight === 16) return "9:16";

  // Return custom aspect ratio
  return `${aspectWidth}:${aspectHeight}`;
}
