import { NextRequest, NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { normalizeSvg } from "@/lib/utils/svg";
import { z } from "zod";

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

const AssetParamsSchema = z.object({
  type: z.enum(["svg", "image"]),
  id: z.string().min(1).max(100),
});

const SvgAssetSchema = z.object({
  _id: z.string(),
  _type: z.literal("assetSVG"),
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
  color: z.string(),
  order: z.number(),
  svgData: z.string(),
});

const ImageAssetSchema = z.object({
  _id: z.string(),
  _type: z.literal("assetPhoto"),
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
  altText: z.object({
    _type: z.literal("localeString"),
    en: z.string(),
  }),
  order: z.number(),
  url: z.string(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  try {
    const { type, id } = await params;

    // Validate parameters
    const validatedParams = AssetParamsSchema.safeParse({ type, id });
    if (!validatedParams.success) {
      return NextResponse.json(
        {
          error: "Invalid asset parameters",
          details: validatedParams.error.flatten(),
        },
        { status: 400 },
      );
    }

    let query: string;
    let asset: SvgAsset | ImageAsset | null;

    if (validatedParams.data.type === "svg") {
      // Fetch SVG asset by ID
      query = `*[_type == "assetSVG" && _id == $id][0]`;
      asset = await sanityClient.fetch<SvgAsset>(query, {
        id: validatedParams.data.id,
      });

      if (asset && asset.svgData) {
        // Normalize SVG data for security
        asset.svgData = normalizeSvg(asset.svgData);
      }

      // Validate SVG asset response
      if (asset) {
        const validatedAsset = SvgAssetSchema.safeParse(asset);
        if (!validatedAsset.success) {
          return NextResponse.json(
            { error: "Invalid SVG asset data format" },
            { status: 500 },
          );
        }
        return NextResponse.json(validatedAsset.data);
      }
    } else {
      // Fetch image asset by ID with complete metadata
      query = `*[_type == "assetPhoto" && _id == $id][0]{
        _id,
        _type,
        _createdAt,
        _updatedAt,
        _rev,
        title,
        description,
        caption,
        altText,
        order,
        url
      }`;
      asset = await sanityClient.fetch<ImageAsset>(query, {
        id: validatedParams.data.id,
      });

      // Validate image asset response
      if (asset) {
        const validatedAsset = ImageAssetSchema.safeParse(asset);
        if (!validatedAsset.success) {
          return NextResponse.json(
            { error: "Invalid image asset data format" },
            { status: 500 },
          );
        }
        return NextResponse.json(validatedAsset.data);
      }
    }

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json(asset);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch asset" },
      { status: 500 },
    );
  }
}
