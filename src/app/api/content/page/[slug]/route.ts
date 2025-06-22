import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";

/**
 * GET handler for individual page API route.
 *
 * This endpoint fetches complete page data by slug, including:
 * - Page metadata (title, subtitle)
 * - Resolved section references with their content
 * - Media content (images, videos, icons, avatars)
 *
 * The query filters by the exact slug to ensure the correct page is returned.
 * All section content is resolved in a single query to optimize performance.
 *
 * @param {NextRequest} _request - The incoming request (unused but required by Next.js).
 * @param {Promise<{ slug: string }>} params - Dynamic route parameters containing the page slug.
 * @returns {Promise<NextResponse>} JSON response with page data or error.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Page slug is required" },
        { status: 400 },
      );
    }

    // Regular page lookup by slug
    const query = `*[_type == "pageMeta" && slug.current == $slug][0]{
      _id,
      title,
      subhead,
      sections[]->{
        _id,
        order,
        content[] {
          ...,
          image,
          video,
          icon,
          avatar
        }
      }
    }`;

    const pageData = await sanityClient.fetch<{
      _id: string;
      slug: string;
      title: string;
      content?: unknown;
      [key: string]: unknown;
    }>(query, { slug });

    if (!pageData) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(pageData);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 },
    );
  }
}
