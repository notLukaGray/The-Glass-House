import { NextRequest, NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

const PortfolioSlugSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9-_]+$/),
});

const PortfolioDataSchema = z.object({
  _id: z.string(),
  title: z.string(),
  subhead: z.string().optional(),
  colorTheme: z.string().optional(),
  locked: z.boolean().optional(),
  coverAsset: z.unknown().optional(),
  externalLink: z.string().optional(),
  featured: z.boolean().optional(),
  categories: z.array(z.unknown()).optional(),
  tags: z.array(z.unknown()).optional(),
  sections: z.array(z.unknown()).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Validate slug parameter
    const validatedSlug = PortfolioSlugSchema.safeParse({ slug });
    if (!validatedSlug.success) {
      return NextResponse.json(
        { error: "Invalid portfolio slug format" },
        { status: 400 },
      );
    }

    // Fetch complete portfolio data with all possible section field variations
    // This single query handles multiple content types to avoid multiple API calls
    const query = `*[_type == "projectMeta" && slug.current == $slug][0]{
      _id,
      title,
      subhead,
      colorTheme,
      locked,
      coverAsset,
      externalLink,
      featured,
      categories[]->,
      tags[]->,
      sections[]{
        _key,
        _type,
        content,
        leftContent,
        rightContent,
        leftAsset,
        rightAsset,
        quote,
        attribution,
        faqs[]{ _key, question, answer },
        title,
        items,
        icon,
        label,
        style,
        image,
        fullBleed,
        showCaption,
        images,
        layout,
        video,
        autoplay,
        loop,
        asset,
        heading,
        description,
        steps[]{ _key, date, description },
        color,
        size,
        backgroundColor,
        buttons[]{ _key, label, icon, style, url },
        avatar
      }
    }`;

    const portfolioData = await sanityClient.fetch<{
      _id: string;
      slug: string;
      title: string;
      description?: string;
      content?: unknown;
      [key: string]: unknown;
    }>(query, { slug: validatedSlug.data.slug });

    if (!portfolioData) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 },
      );
    }

    // Validate response data
    const validatedPortfolioData = PortfolioDataSchema.safeParse(portfolioData);
    if (!validatedPortfolioData.success) {
      return NextResponse.json(
        { error: "Invalid portfolio data format" },
        { status: 500 },
      );
    }

    return NextResponse.json(validatedPortfolioData.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 },
    );
  }
}
