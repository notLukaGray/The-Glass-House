import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

/**
 * Server-side Sanity client for debug asset fetching.
 * Configured with CDN enabled for consistent behavior with production.
 */
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "",
  apiVersion: process.env.SANITY_API_VERSION || "",
  useCdn: true,
});

/**
 * GET handler for the debug assets API route.
 *
 * This endpoint is designed for development and debugging purposes to help
 * troubleshoot asset-related issues. It performs a comprehensive search
 * for assets by ID across different asset types in Sanity.
 *
 * The endpoint checks for assets in the following order:
 * 1. Photo assets (assetPhoto type)
 * 2. SVG assets (assetSVG type)
 * 3. Any asset with the given ID (fallback)
 *
 * This is particularly useful when:
 * - Debugging broken image references
 * - Verifying asset existence and structure
 * - Understanding asset type mismatches
 * - Troubleshooting Sanity query issues
 *
 * The response includes the asset type, existence status, and full asset data
 * to provide complete debugging information.
 *
 * @param {NextRequest} _request - The incoming request (unused but required by Next.js).
 * @param {Promise<{ id: string }>} params - Dynamic route parameters containing the asset ID.
 * @returns {Promise<NextResponse>} JSON response with asset debugging information or error.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Asset ID is required" },
        { status: 400 },
      );
    }

    // Check for photo asset first (most common type)
    const photoAsset = await client.fetch(
      `*[_type == "assetPhoto" && _id == $id][0]`,
      { id },
    );

    if (photoAsset) {
      return NextResponse.json({
        type: "assetPhoto",
        found: true,
        asset: photoAsset,
      });
    }

    // Check for SVG asset (icon/logo type)
    const svgAsset = await client.fetch(
      `*[_type == "assetSVG" && _id == $id][0]`,
      { id },
    );

    if (svgAsset) {
      return NextResponse.json({
        type: "assetSVG",
        found: true,
        asset: svgAsset,
      });
    }

    // Fallback: check for any asset with this ID
    const anyAsset = await client.fetch(`*[_id == $id][0]`, { id });

    if (anyAsset) {
      return NextResponse.json({
        type: anyAsset._type,
        found: true,
        asset: anyAsset,
      });
    }

    return NextResponse.json({
      found: false,
      message: `No asset found with ID: ${id}`,
    });
  } catch (error) {
    console.error("Error checking asset:", error);
    return NextResponse.json(
      { error: "Failed to check asset" },
      { status: 500 },
    );
  }
}
