import { NextRequest, NextResponse } from "next/server";
import { ensureDefaultAdmin } from "@/lib/db";

/**
 * POST /api/setup
 * Sets up the default admin user automatically
 * This can be called after deployment to ensure admin access
 */
export async function POST(request: NextRequest) {
  try {
    // Check if this is a setup request
    const { action } = await request.json();

    if (action !== "setup-admin") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    console.log("🔐 Auto-setting up admin user...");

    const result = await ensureDefaultAdmin();

    return NextResponse.json({
      success: true,
      message: result.message,
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
      },
      credentials: {
        username: result.user.username,
        password:
          result.user.username === "admin"
            ? "admin123"
            : "Use your existing password",
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      {
        error: "Setup failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/setup
 * Checks if admin user exists
 */
export async function GET() {
  try {
    const { PrismaClient } = await import("@/generated/prisma");
    const prisma = new PrismaClient();

    const adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      hasAdmin: !!adminUser,
      adminUser: adminUser
        ? {
            id: adminUser.id,
            email: adminUser.email,
            username: adminUser.username,
            role: adminUser.role,
          }
        : null,
    });
  } catch (error) {
    console.error("Setup check error:", error);
    return NextResponse.json(
      {
        error: "Setup check failed",
        hasAdmin: false,
      },
      { status: 500 },
    );
  }
}
