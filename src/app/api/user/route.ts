import { NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";

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

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
