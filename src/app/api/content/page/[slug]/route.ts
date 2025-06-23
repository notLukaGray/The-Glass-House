import { NextRequest, NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

const SlugSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9-_]+$/),
});

const PageDataSchema = z.object({
  _id: z.string(),
  title: z.string(),
  subhead: z.string().optional(),
  sections: z
    .array(
      z.object({
        _id: z.string(),
        order: z.number().optional(),
        content: z.array(z.unknown()).optional(),
      }),
    )
    .optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Validate slug parameter
    const validatedSlug = SlugSchema.safeParse({ slug });
    if (!validatedSlug.success) {
      return NextResponse.json(
        { error: "Invalid slug format" },
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
    }>(query, { slug: validatedSlug.data.slug });

    if (!pageData) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Validate response data
    const validatedPageData = PageDataSchema.safeParse(pageData);
    if (!validatedPageData.success) {
      return NextResponse.json(
        { error: "Invalid page data format" },
        { status: 500 },
      );
    }

    return NextResponse.json(validatedPageData.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 },
    );
  }
}
