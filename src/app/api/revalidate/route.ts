import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { _type } = body;

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
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: err },
      { status: 500 },
    );
  }
}
