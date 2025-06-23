import { NextResponse } from "next/server";
import { getLatestCommit } from "@/lib/github";
import { z } from "zod";

const CommitResponseSchema = z.object({
  commitTime: z.string().optional(),
  commitMessage: z.string().optional(),
});

export async function GET() {
  try {
    const { commitTime, commitMessage } = await getLatestCommit();

    // Validate response data
    const validatedResponse = CommitResponseSchema.safeParse({
      commitTime,
      commitMessage,
    });

    if (!validatedResponse.success) {
      return NextResponse.json(
        { error: "Invalid commit data format" },
        { status: 500 },
      );
    }

    if (!commitTime) {
      return NextResponse.json(
        { error: "Failed to retrieve commit information" },
        { status: 500 },
      );
    }

    return NextResponse.json({ commitTime, commitMessage });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch commit information" },
      { status: 500 },
    );
  }
}
