import { NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

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

const AboutDataSchema = z.object({
  user: z.unknown().optional(),
  sections: z
    .array(
      z.object({
        _key: z.string(),
        _type: z.string(),
        items: z
          .array(
            z.object({
              _key: z.string(),
              _type: z.string(),
              icon: z
                .object({
                  _id: z.string(),
                  svgData: z.string(),
                  color: z.string(),
                })
                .optional(),
              logo: z
                .object({
                  _id: z.string(),
                  svgData: z.string(),
                  color: z.string(),
                })
                .optional(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

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

    // Validate response data
    const validatedAboutData = AboutDataSchema.safeParse(aboutData);
    if (!validatedAboutData.success) {
      return NextResponse.json(
        { error: "Invalid about data format" },
        { status: 500 },
      );
    }

    return NextResponse.json(validatedAboutData.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch about data" },
      { status: 500 },
    );
  }
}
