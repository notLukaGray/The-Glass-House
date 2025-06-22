import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";

/**
 * GET handler for the pages API route.
 *
 * This endpoint fetches all page metadata from Sanity, including:
 * - Basic page information (title, slug, publish date)
 * - Lock status for protected pages
 * - Associated sections with their order and content structure
 *
 * The query resolves section references to provide a complete view
 * of each page's structure without fetching the full content.
 * This is useful for building navigation, sitemaps, and page listings.
 *
 * @returns {Promise<NextResponse>} JSON response with page metadata or error.
 */
export async function GET() {
  try {
    // Fetch page metadata with resolved section references
    const query = `*[_type == "pageMeta"]{
      _id,
      title,
      slug,
      publishedAt,
      locked,
      sections[]->{
        _id,
        title,
        order,
        content[] {
          _key,
          _type
        }
      }
    }`;

    const pages = await sanityClient.fetch(query);

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}
