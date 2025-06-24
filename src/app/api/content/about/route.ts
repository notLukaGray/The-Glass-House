import { NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

interface AboutData {
  user?: {
    _id: string;
    _type: string;
    [key: string]: unknown;
  };
  sections?: Array<{
    _id: string;
    _type: string;
    title?: string;
    order?: number;
    content?: Array<{
      _key: string;
      _type: string;
      [key: string]: unknown;
    }>;
  }>;
}

const AboutDataSchema = z.object({
  user: z
    .object({
      _id: z.string(),
      _type: z.string(),
    })
    .optional(),
  sections: z
    .array(
      z.object({
        _id: z.string(),
        _type: z.string(),
        title: z.string().optional(),
        order: z.number().optional(),
        content: z
          .array(
            z
              .object({
                _key: z.string(),
                _type: z.string(),
              })
              .passthrough(),
          )
          .optional(),
      }),
    )
    .optional(),
});

export async function GET(): Promise<NextResponse> {
  try {
    // Fetch about page data with resolved references
    const query = `*[_type == "about"][0]{
      user->{
        _id,
        _type,
        name,
        email,
        avatarUrl
      },
      sections[]->{
            _id,
        _type,
        title,
        order,
        content[]{
          _key,
          _type,
          ...
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
      console.error("Validation error:", validatedAboutData.error);
      return NextResponse.json(
        { error: "Invalid about data format" },
        { status: 500 },
      );
    }

    return NextResponse.json(validatedAboutData.data);
  } catch (error) {
    console.error("About API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch about data" },
      { status: 500 },
    );
  }
}
