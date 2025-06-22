import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";

/**
 * TypeScript interface for social asset data structure.
 * Defines the expected shape of social media and external link data
 * returned from Sanity, including metadata and optional icon references.
 */
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

/**
 * GET handler for the social API route.
 *
 * This endpoint fetches social media and external link assets from Sanity,
 * providing flexible querying capabilities for different types of social
 * content. It supports filtering by asset type and specific IDs.
 *
 * Query Parameters:
 * - type: The asset type to fetch (defaults to "website")
 * - ids: Array of specific asset IDs to fetch (optional)
 *
 * The endpoint is designed to handle various types of social content:
 * - Social media profiles (Twitter, LinkedIn, GitHub, etc.)
 * - Personal websites and blogs
 * - Portfolio links and external projects
 * - Contact information and professional networks
 *
 * Results are ordered by creation date (oldest first) to maintain
 * consistent ordering across requests.
 *
 * @param {NextRequest} request - The incoming request with query parameters.
 * @returns {Promise<NextResponse>} JSON response with social assets or error.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "website";
    const ids = searchParams.getAll("ids");

    let groqQuery = `*[_type == $type`;

    if (ids && ids.length > 0) {
      const idList = ids.map((id) => `"${id}"`).join(", ");
      groqQuery += ` && _id in [${idList}]`;
    }

    groqQuery += `] | order(_createdAt asc)`;

    const assets = await sanityClient.fetch<SocialAsset[]>(groqQuery, { type });

    return NextResponse.json(assets || []);
  } catch (error) {
    console.error("Error fetching social assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch social assets" },
      { status: 500 },
    );
  }
}
