import { NextRequest, NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";

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

    const asset = await sanityClient.fetch<VideoAsset>(query, { id });

    if (!asset) {
      return NextResponse.json(
        { error: "Video asset not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Error fetching video asset:", error);
    return NextResponse.json(
      { error: "Failed to fetch video asset" },
      { status: 500 },
    );
  }
}
