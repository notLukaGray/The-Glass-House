import { NextRequest, NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

export interface SocialAsset {
  _id: string;
  _type: string; // e.g., 'website', 'assetSocial', etc.
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  url: string;
  icon?: { _ref: string; _type: "reference" };
}

const QuerySchema = z.object({
  type: z
    .string()
    .min(1)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/),
  ids: z.array(z.string().min(1)).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "website";
    const ids = searchParams.getAll("ids");

    const parsed = QuerySchema.safeParse({
      type,
      ids: ids.length > 0 ? ids : undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    let groqQuery = `*[_type == $type`;
    if (parsed.data.ids && parsed.data.ids.length > 0) {
      const idList = parsed.data.ids.map((id) => `"${id}"`).join(", ");
      groqQuery += ` && _id in [${idList}]`;
    }
    groqQuery += `] | order(_createdAt asc)`;

    const assets = await sanityClient.fetch<SocialAsset[]>(groqQuery, {
      type: parsed.data.type,
    });
    return NextResponse.json(assets || []);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch social assets" },
      { status: 500 },
    );
  }
}
