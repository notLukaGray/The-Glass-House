import { NextRequest, NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

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

const QuerySchema = z.object({
  type: z
    .string()
    .min(1)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/),
  ids: z.array(z.string().min(1)).optional(),
});

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

    const parsed = QuerySchema.safeParse({
      type,
      ids: ids.length > 0 ? ids : undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    let groqQuery = `*[_type == $type`;
    if (parsed.data.ids && parsed.data.ids.length > 0) {
      const idList = parsed.data.ids.map((id) => `"${id}"`).join(", ");
      groqQuery += ` && _id in [${idList}]`;
    }
    groqQuery += `] | order(_createdAt asc)`;

    const assets = await sanityClient.fetch<SocialAsset[]>(groqQuery, {
      type: parsed.data.type,
    });
    return NextResponse.json(assets || []);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch social assets" },
      { status: 500 },
    );
  }
}
