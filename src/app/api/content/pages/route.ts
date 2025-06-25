import { NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

const PageSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  publishedAt: z.string().optional(),
  locked: z.boolean().optional(),
  sections: z
    .array(
      z.object({
        _id: z.string(),
        title: z.string().optional(),
        order: z.number().optional(),
        content: z
          .array(
            z.object({
              _key: z.string(),
              _type: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

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

    const pages = await sanityClient.fetch(
      query,
      {},
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      },
    );

    // Validate response data
    const validatedPages = z.array(PageSchema).safeParse(pages);
    if (!validatedPages.success) {
      return NextResponse.json(
        { error: "Invalid page data format" },
        { status: 500 },
      );
    }

    return NextResponse.json(validatedPages.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}
