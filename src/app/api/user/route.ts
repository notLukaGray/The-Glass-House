import { NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

const UserDataSchema = z.object({
  _id: z.string(),
  name: z.string(),
  jobTitle: z.string().optional(),
  avatar: z
    .object({
      url: z.string(),
      alt: z.string().optional(),
    })
    .optional(),
  bio: z.string().optional(),
  social: z
    .array(
      z.object({
        _id: z.string(),
        name: z.string(),
        url: z.string(),
        icon: z
          .object({
            _id: z.string(),
            svgData: z.string(),
          })
          .optional(),
      }),
    )
    .optional(),
});

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

    // Validate response data
    const validatedUserData = UserDataSchema.safeParse(userData);
    if (!validatedUserData.success) {
      return NextResponse.json(
        { error: "Invalid user data format" },
        { status: 500 },
      );
    }

    return NextResponse.json(validatedUserData.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
