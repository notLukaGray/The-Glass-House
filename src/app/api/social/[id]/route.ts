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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "website";

    if (!id) {
      return NextResponse.json(
        { error: "Social asset ID is required" },
        { status: 400 },
      );
    }

    const query = `*[_type == $type && _id == $id][0]`;

    const asset = await client.fetch<SocialAsset>(query, { id, type });

    if (!asset) {
      return NextResponse.json(
        { error: "Social asset not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Error fetching social asset:", error);
    return NextResponse.json(
      { error: "Failed to fetch social asset" },
      { status: 500 },
    );
  }
}
