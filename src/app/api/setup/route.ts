import { NextRequest, NextResponse } from "next/server";
import { ensureDefaultAdmin } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Check if this is a setup request
    const { action } = await request.json();

    if (action !== "setup-admin") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

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
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create admin user" },
      { status: 500 },
    );
  }
}

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
  } catch {
    return NextResponse.json(
      {
        error: "Setup check failed",
        hasAdmin: false,
      },
      { status: 500 },
    );
  }
}
