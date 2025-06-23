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

/**
 * POST /api/auth/setup
 * Sets up the initial admin user and migrates hardcoded users
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only allow setup if no users exist or if user is admin
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const { action, userData } = await request.json();

    switch (action) {
      case "create-user":
        if (!userData) {
          return NextResponse.json(
            { error: "User data required" },
            { status: 400 },
          );
        }
        const newUser = await createUser(userData);
        return NextResponse.json({
          success: true,
          message: "User created successfully",
          user: newUser,
        });

      case "change-password":
        if (!userData?.userId || !userData?.newPassword) {
          return NextResponse.json(
            { error: "User ID and new password required" },
            { status: 400 },
          );
        }
        await updateUserPassword(userData.userId, userData.newPassword);
        return NextResponse.json({
          success: true,
          message: "Password updated successfully",
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  }
}

/**
 * GET /api/auth/setup
 * Gets all users (admin only)
 */
export async function GET() {
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
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/auth/setup
 * Updates user role (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 },
      );
    }

    const user = await updateUserRole(userId, role);
    return NextResponse.json({
      success: true,
      message: "User role updated",
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/auth/setup
 * Deletes a user (admin only)
 */
export async function DELETE(request: NextRequest) {
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

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
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
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
