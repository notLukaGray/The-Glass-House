import { NextRequest, NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

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

const VideoAssetParamsSchema = z.object({
  id: z.string().min(1).max(100),
});

const VideoAssetSchema = z.object({
  _id: z.string(),
  _type: z.literal("assetVideo"),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _rev: z.string(),
  title: z.object({
    _type: z.literal("localeString"),
    en: z.string(),
  }),
  description: z.object({
    _type: z.literal("localeString"),
    en: z.string(),
  }),
  caption: z.object({
    _type: z.literal("localeString"),
    en: z.string(),
  }),
  order: z.number(),
  poster: z.string(),
  sourceType: z.literal("cdn"),
  cdnSdUrl: z.string(),
  cdn1kUrl: z.string(),
  cdn2kUrl: z.string(),
  cdn4kUrl: z.string(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Validate parameters
    const validatedParams = VideoAssetParamsSchema.safeParse({ id });
    if (!validatedParams.success) {
      return NextResponse.json(
        { error: "Invalid video asset ID" },
        { status: 400 },
      );
    }

    const query = `*[_type == "assetVideo" && _id == $id][0]`;

    const asset = await sanityClient.fetch<VideoAsset>(query, {
      id: validatedParams.data.id,
    });

    if (!asset) {
      return NextResponse.json(
        { error: "Video asset not found" },
        { status: 404 },
      );
    }

    // Validate response data
    const validatedAsset = VideoAssetSchema.safeParse(asset);
    if (!validatedAsset.success) {
      return NextResponse.json(
        { error: "Invalid video asset data format" },
        { status: 500 },
      );
    }

    return NextResponse.json(validatedAsset.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch video asset" },
      { status: 500 },
    );
  }
}
