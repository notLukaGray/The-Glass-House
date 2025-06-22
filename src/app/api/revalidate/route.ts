import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler for the revalidate API route.
 *
 * This endpoint is designed to be called by Sanity webhooks to invalidate
 * Next.js ISR (Incremental Static Regeneration) cache when content changes.
 * It receives a document type from the webhook payload and revalidates
 * the appropriate paths based on the content that was updated.
 *
 * The revalidation logic maps document types to their corresponding pages:
 * - projectMeta: Portfolio listing and individual project pages
 * - pageMeta: Component test pages (development/testing)
 * - about: About page
 *
 * This ensures that when content is updated in Sanity, the cached pages
 * are regenerated with the latest content, providing a seamless content
 * management experience without manual cache clearing.
 *
 * The endpoint is typically called automatically by Sanity webhooks
 * configured to trigger on document changes.
 *
 * @param {NextRequest} request - The incoming request containing the webhook payload.
 * @returns {Promise<NextResponse>} JSON response confirming revalidation or error.
 */
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
