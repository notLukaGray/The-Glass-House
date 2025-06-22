import { NextResponse } from "next/server";
import { getLatestCommit } from "@/lib/github";

/**
 * GET handler for the GitHub API route.
 *
 * This endpoint fetches the latest commit information from the GitHub repository
 * using the GitHub API. It returns the commit timestamp and message, which can
 * be used for:
 * - Displaying "last updated" information on the site
 * - Version tracking and deployment status
 * - Debugging and development workflow integration
 *
 * The endpoint relies on the getLatestCommit utility function which handles
 * the actual GitHub API communication and authentication.
 *
 * @returns {Promise<NextResponse>} JSON response with commit information or error.
 */
export async function GET() {
  const { commitTime, commitMessage } = await getLatestCommit();

  if (!commitTime) {
    return NextResponse.json(
      { error: "Failed to retrieve commit information." },
      { status: 500 },
    );
  }

  return NextResponse.json({ commitTime, commitMessage });
}
