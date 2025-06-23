import { NextRequest, NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Portfolio slug is required" },
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
    }>(query, { slug });

    if (!portfolioData) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 },
    );
  }
}
