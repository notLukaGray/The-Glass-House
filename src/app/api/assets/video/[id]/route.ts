import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

// Create server-side Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "",
  apiVersion: process.env.SANITY_API_VERSION || "",
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

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

// Utility function to remove zero-width spaces and sanitize Sanity responses
const sanitizeSanityResponse = <T>(data: T): T => {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    return data.replace(/[\u200B-\u200D\uFEFF]/g, "") as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeSanityResponse(item)) as T;
  }

  if (typeof data === "object" && data !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      sanitized[key] = sanitizeSanityResponse(value);
    }
    return sanitized as T;
  }

  return data;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 },
      );
    }

    const query = `*[_type == "assetVideo" && _id == $id][0]`;

    const asset = await client.fetch<VideoAsset>(query, { id });

    if (!asset) {
      return NextResponse.json(
        { error: "Video asset not found" },
        { status: 404 },
      );
    }

    // Sanitize the response to remove zero-width spaces
    const sanitizedAsset = sanitizeSanityResponse(asset);

    return NextResponse.json(sanitizedAsset);
  } catch (error) {
    console.error("Error fetching video asset:", error);
    return NextResponse.json(
      { error: "Failed to fetch video asset" },
      { status: 500 },
    );
  }
}
