import { NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

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

const PortfolioPreviewSchema = z.object({
  _id: z.string(),
  title: z.object({
    en: z.string(),
  }),
  subhead: z.object({
    en: z.string(),
  }),
  slug: z.object({
    current: z.string(),
  }),
  coverAsset: z.object({
    _ref: z.string(),
  }),
  featured: z.boolean(),
  locked: z.boolean(),
  categories: z.array(
    z.object({
      _id: z.string(),
      title: z.object({
        en: z.string(),
      }),
    }),
  ),
  tags: z.array(
    z.object({
      _id: z.string(),
      title: z.object({
        en: z.string(),
      }),
    }),
  ),
});

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

    // Validate response data
    const validatedPortfolios = z
      .array(PortfolioPreviewSchema)
      .safeParse(portfolios);
    if (!validatedPortfolios.success) {
      return NextResponse.json(
        { error: "Invalid portfolios data format" },
        { status: 500 },
      );
    }

    return NextResponse.json(validatedPortfolios.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 },
    );
  }
}
