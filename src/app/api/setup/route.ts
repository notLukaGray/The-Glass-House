import { NextResponse } from "next/server";
import { isSetupComplete } from "@/lib/db";
import { setupRateLimiter } from "@/lib/rateLimit";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = setupRateLimiter(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const setupComplete = await isSetupComplete();

    if (setupComplete) {
      return NextResponse.json({
        setupComplete: true,
        message: "Setup already completed. Admin user exists.",
      });
    }

    return NextResponse.json({
      setupComplete: false,
      message: "Setup required. No admin user found.",
    });
  } catch {
    return NextResponse.json(
      {
        error: "Setup check failed",
        setupComplete: false,
      },
      { status: 500 },
    );
  }
}
