import { NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";

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
