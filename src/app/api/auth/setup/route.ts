import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  createUser,
  updateUserPassword,
} from "@/lib/auth/db";
import { authRateLimiter } from "@/lib/rateLimit";
import { z } from "zod";

const CreateUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  name: z.string().min(1),
  password: z.string().min(8),
  role: z.enum(["admin", "user"]).optional(),
});

const ChangePasswordSchema = z.object({
  userId: z.string().min(1),
  newPassword: z.string().min(8),
});

const UpdateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "user"]),
});

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = authRateLimiter(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const session = await getServerSession(authOptions);

    // Only allow setup if no users exist or if user is admin
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { action, userData } = body;

    switch (action) {
      case "create-user": {
        const parsed = CreateUserSchema.safeParse(userData);
        if (!parsed.success) {
          return NextResponse.json(
            { error: "Invalid user data", details: parsed.error.flatten() },
            { status: 400 },
          );
        }
        const newUser = await createUser(parsed.data);
        return NextResponse.json({
          success: true,
          message: "User created successfully",
          user: newUser,
        });
      }
      case "change-password": {
        const parsed = ChangePasswordSchema.safeParse(userData);
        if (!parsed.success) {
          return NextResponse.json(
            {
              error: "Invalid password change data",
              details: parsed.error.flatten(),
            },
            { status: 400 },
          );
        }
        await updateUserPassword(parsed.data.userId, parsed.data.newPassword);
        return NextResponse.json({
          success: true,
          message: "Password updated successfully",
        });
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = authRateLimiter(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = authRateLimiter(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const parsed = UpdateRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid role update data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const user = await updateUserRole(parsed.data.userId, parsed.data.role);
    return NextResponse.json({
      success: true,
      message: "User role updated",
      user,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = authRateLimiter(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || typeof userId !== "string" || userId.length < 1) {
      return NextResponse.json(
        { error: "User ID is required and must be a string" },
        { status: 400 },
      );
    }

    // Prevent admin from deleting themselves
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    await deleteUser(userId);
    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
