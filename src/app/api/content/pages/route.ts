import { NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";

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
