import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";

/**
 * GET handler for the user API route.
 *
 * This endpoint fetches the main user profile data from Sanity, including:
 * - Basic profile information (name, job title, bio)
 * - Avatar image with alt text
 * - Social media links with their associated icons
 *
 * The query uses Sanity's reference resolution to fetch related social media
 * data and icon SVGs in a single request for optimal performance.
 *
 * @returns {Promise<NextResponse>} JSON response with user data or error.
 */
export async function GET() {
  try {
    // Fetch user data with resolved references for social links and icons
    const query = `*[_type == "user"][0]{
      _id,
      name,
      jobTitle,
      avatar,
      bio,
      social[]->{
        _id,
        name,
        url,
        icon->{
          _id,
          svgData
        }
      }
    }`;

    const userData = await sanityClient.fetch<{
      _id: string;
      name: string;
      email: string;
      bio?: string;
      avatar?: {
        url: string;
        alt?: string;
      };
      [key: string]: unknown;
    }>(query);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
