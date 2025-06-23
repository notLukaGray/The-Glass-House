import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RevalidateSchema = z.object({
  _type: z.enum(["projectMeta", "pageMeta", "about"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedBody = RevalidateSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json(
        {
          error: "Invalid document type",
          details: validatedBody.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { _type } = validatedBody.data;

    // Revalidate based on the document type
    if (_type === "projectMeta") {
      // Portfolio content changed - revalidate portfolio pages
      revalidatePath("/portfolio");
      revalidatePath("/portfolio/[slug]");
    } else if (_type === "pageMeta") {
      // Page content changed - revalidate component test pages
      revalidatePath("/component-test");
      revalidatePath("/component-test/[slug]");
    } else if (_type === "about") {
      // About content changed - revalidate about page
      revalidatePath("/about");
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 },
    );
  }
}
