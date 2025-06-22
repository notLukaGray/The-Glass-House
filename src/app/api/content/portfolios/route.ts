import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";

/**
 * TypeScript interface for portfolio preview data.
 * Defines the structure of portfolio metadata returned for listings,
 * including basic info, categorization, and access control.
 */
interface PortfolioPreview {
  _id: string;
  title: { en: string };
  subhead: { en: string };
  slug: { current: string };
  coverAsset: { _ref: string };
  featured: boolean;
  locked: boolean;
  categories: Array<{ _id: string; title: { en: string } }>;
  tags: Array<{ _id: string; title: { en: string } }>;
}

/**
 * GET handler for the portfolios API route.
 *
 * This endpoint fetches portfolio preview data for listing pages, including:
 * - Basic project information (title, subtitle, slug)
 * - Cover asset reference for thumbnails
 * - Featured status and access control (locked)
 * - Categorization (categories and tags)
 *
 * The query orders results by featured status first (featured projects appear
 * at the top), then by creation date (newest first). This provides a logical
 * hierarchy for portfolio displays while ensuring fresh content is visible.
 *
 * Only metadata is fetched here - full project content is handled by
 * individual project endpoints to optimize performance.
 *
 * @returns {Promise<NextResponse>} JSON response with portfolio previews or error.
 */
export async function GET() {
  try {
    // Fetch portfolio metadata with resolved category and tag references
    // Ordered by featured status, then by creation date (newest first)
    const query = `*[_type == "projectMeta"] | order(featured desc, _createdAt desc) {
      _id,
      title,
      subhead,
      slug,
      coverAsset,
      featured,
      locked,
      categories[]-> {
        _id,
        title
      },
      tags[]-> {
        _id,
        title
      }
    }`;

    const portfolios = await sanityClient.fetch<PortfolioPreview[]>(query);

    return NextResponse.json(portfolios || []);
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 },
    );
  }
}
