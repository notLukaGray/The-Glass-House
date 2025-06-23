import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";
import { normalizeSvg } from "@/lib/utils/svg";
import { sanitizeSanityResponse } from "@/lib/handlers/sanity";

/**
 * TypeScript interface for SVG asset data structure.
 * Defines the expected shape of SVG asset data returned from Sanity,
 * including localized content, styling properties, and the raw SVG data.
 */
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

/**
 * TypeScript interface for image asset data structure.
 * Defines the expected shape of image asset data returned from Sanity,
 * including localized content, accessibility information, and the image URL.
 */
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

/**
 * GET handler for consolidated assets API route.
 *
 * This endpoint fetches individual assets by type and ID, providing
 * enhanced security and data sanitization. It consolidates the previous
 * separate routes for SVG and image assets into a single, flexible endpoint.
 *
 * Supported asset types:
 * - svg: SVG assets with normalization and sanitization
 * - image: Image assets with full metadata
 *
 * The endpoint performs several important operations:
 * - Fetches the asset by type and ID with full metadata
 * - Normalizes and sanitizes SVG data for security (for SVG assets)
 * - Removes zero-width spaces and other problematic characters
 * - Returns clean, safe asset data ready for web use
 *
 * @param {NextRequest} _request - The incoming request (unused but required by Next.js).
 * @param {Promise<{ type: string; id: string }>} params - Dynamic route parameters containing the asset type and ID.
 * @returns {Promise<NextResponse>} JSON response with sanitized asset or error.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  try {
    const { type, id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Asset ID is required" },
        { status: 400 },
      );
    }

    if (!type || !["svg", "image"].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid asset type. Must be "svg" or "image"' },
        { status: 400 },
      );
    }

    let query: string;
    let asset: SvgAsset | ImageAsset | null;

    if (type === "svg") {
      // Fetch SVG asset by ID
      query = `*[_type == "assetSVG" && _id == $id][0]`;
      asset = await sanityClient.fetch<SvgAsset>(query, { id });

      if (asset && asset.svgData) {
        // Normalize SVG data for security
        asset.svgData = normalizeSvg(asset.svgData);
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
      asset = await sanityClient.fetch<ImageAsset>(query, { id });
    }

    if (!asset) {
      return NextResponse.json(
        { error: `${type} asset not found` },
        { status: 404 },
      );
    }

    // Sanitize the response to remove zero-width spaces
    const sanitizedAsset = sanitizeSanityResponse(asset);

    return NextResponse.json(sanitizedAsset);
  } catch (error) {
    console.error("Error fetching asset:", error);
    return NextResponse.json(
      { error: "Failed to fetch asset" },
      { status: 500 },
    );
  }
}
