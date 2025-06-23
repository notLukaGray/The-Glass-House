import { NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";

/**
 * TypeScript interface for the about page data structure.
 * Defines the expected shape of data returned from Sanity,
 * including user information and structured sections with items.
 */
interface AboutData {
  user?: unknown;
  sections?: Array<{
    _key: string;
    _type: string;
    items?: Array<{
      _key: string;
      _type: string;
      icon?: {
        _id: string;
        svgData: string;
        color: string;
      };
      logo?: {
        _id: string;
        svgData: string;
        color: string;
      };
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  }>;
}

/**
 * GET handler for the about API route.
 *
 * This endpoint fetches the complete about page content from Sanity, including:
 * - User information and profile data
 * - Structured sections (e.g., skills, experience, education)
 * - Section items with their associated icons and logos
 *
 * The query uses Sanity's reference resolution to fetch icon and logo SVGs
 * along with their color information in a single request. This structure
 * allows for flexible content management where different sections can have
 * different types of items (skills, work experience, education, etc.).
 *
 * @returns {Promise<NextResponse>} JSON response with about page data or error.
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Fetch about page data with resolved icon and logo references
    const query = `*[_type == "about"][0]{
      user,
      sections[]{
        ...,
        items[]{
          ...,
          icon->{
            _id,
            svgData,
            color
          },
          logo->{
            _id,
            svgData,
            color
          }
        }
      }
    }`;

    const aboutData = await sanityClient.fetch<AboutData>(query);

    if (!aboutData) {
      return NextResponse.json(
        { error: "About data not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(aboutData);
  } catch (error) {
    console.error("Error fetching about data:", error);
    return NextResponse.json(
      { error: "Failed to fetch about data" },
      { status: 500 },
    );
  }
}
