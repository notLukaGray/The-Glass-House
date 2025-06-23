import { NextRequest, NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

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

const SocialAssetParamsSchema = z.object({
  id: z.string().min(1).max(100),
});

const SocialAssetSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _rev: z.string(),
  name: z.string(),
  url: z.string(),
  icon: z
    .object({
      _ref: z.string(),
      _type: z.literal("reference"),
    })
    .optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "website";

    // Validate parameters
    const validatedParams = SocialAssetParamsSchema.safeParse({ id });
    if (!validatedParams.success) {
      return NextResponse.json(
        { error: "Invalid social asset ID" },
        { status: 400 },
      );
    }

    const query = `*[_type == $type && _id == $id][0]`;

    const asset = await sanityClient.fetch<SocialAsset>(query, {
      id: validatedParams.data.id,
      type,
    });

    if (!asset) {
      return NextResponse.json(
        { error: "Social asset not found" },
        { status: 404 },
      );
    }

    // Validate response data
    const validatedAsset = SocialAssetSchema.safeParse(asset);
    if (!validatedAsset.success) {
      return NextResponse.json(
        { error: "Invalid social asset data format" },
        { status: 500 },
      );
    }

    return NextResponse.json(validatedAsset.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch social asset" },
      { status: 500 },
    );
  }
}
