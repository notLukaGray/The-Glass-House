import { NextRequest, NextResponse } from "next/server";
import { elementApiClient } from "@/lib/api/client";
import {
  createSuccessResponse,
  createErrorResponse,
  getCacheHeaders,
} from "@/lib/api/utils";
import { ELEMENT_TYPES, ElementType } from "@/lib/api/types";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import { getSecurityHeaders } from "@/lib/api/utils/elementUtils";

// Admin authentication helper with validated environment
async function requireAdmin(request: NextRequest) {
  try {
    const env = getServerEnv();
    const token = await getToken({ req: request, secret: env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(createErrorResponse("Not authenticated"), {
        status: 401,
        headers: getSecurityHeaders(),
      });
    }

    if (token.role !== "admin") {
      return NextResponse.json(createErrorResponse("Not authorized"), {
        status: 403,
        headers: getSecurityHeaders(),
      });
    }

    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      createErrorResponse("Authentication service unavailable"),
      {
        status: 503,
        headers: getSecurityHeaders(),
      },
    );
  }
}

function isElementType(type: string): type is ElementType {
  return (ELEMENT_TYPES as readonly string[]).includes(type);
}

function extractTypeAndId(pathname: string): {
  type: string | null;
  id: string | null;
} {
  // Matches /api/elements/[type]/[id] or /app/api/elements/[type]/[id]
  const match = pathname.match(/elements\/(\w+)\/(\w+)/);
  return {
    type: match?.[1] || null,
    id: match?.[2] || null,
  };
}

// Schema for updating elements
const UpdateElementSchema = z.record(z.any());

// GET /api/elements/[type]/[id] - Get specific element by ID
export async function GET(request: NextRequest) {
  const { type, id } = extractTypeAndId(request.nextUrl.pathname);
  try {
    if (!type || !id) {
      return NextResponse.json(
        createErrorResponse(`Missing type or id in URL`),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }
    // Validate element type
    if (!isElementType(type)) {
      return NextResponse.json(
        createErrorResponse(`Invalid element type: ${type}`),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }
    // Get element by ID
    const element = await elementApiClient.getElementById(id, type);
    if (!element) {
      return NextResponse.json(
        createErrorResponse(`Element not found: ${id}`),
        {
          status: 404,
          headers: getSecurityHeaders(),
        },
      );
    }
    return NextResponse.json(
      createSuccessResponse(element, `Retrieved ${type} element`, { type }),
      { headers: { ...getCacheHeaders(), ...getSecurityHeaders() } },
    );
  } catch (error) {
    console.error(`Element API Error for ${type}/${id}:`, error);
    return NextResponse.json(
      createErrorResponse(`Failed to retrieve element`),
      {
        status: 500,
        headers: getSecurityHeaders(),
      },
    );
  }
}

// PUT /api/elements/[type]/[id] - Update specific element
export async function PUT(request: NextRequest) {
  const { type, id } = extractTypeAndId(request.nextUrl.pathname);

  // Validate content type
  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json(
      createErrorResponse("Invalid content type. Expected application/json"),
      {
        status: 400,
        headers: getSecurityHeaders(),
      },
    );
  }

  // Check admin authentication
  const auth = await requireAdmin(request);
  if (auth) return auth;

  try {
    if (!type || !id) {
      return NextResponse.json(
        createErrorResponse(`Missing type or id in URL`),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    // Validate element type
    if (!isElementType(type)) {
      return NextResponse.json(
        createErrorResponse(`Invalid element type: ${type}`),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    const body = await request.json();
    const parsed = UpdateElementSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(createErrorResponse("Invalid request data"), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    const result = await elementApiClient.updateElement(id, parsed.data);

    return NextResponse.json(
      createSuccessResponse(result, `${type} element updated successfully`, {
        type,
        timestamp: new Date().toISOString(),
      }),
      { headers: getSecurityHeaders() },
    );
  } catch (error) {
    console.error(`Element update error for ${type}/${id}:`, error);
    return NextResponse.json(createErrorResponse(`Failed to update element`), {
      status: 500,
      headers: getSecurityHeaders(),
    });
  }
}

// DELETE /api/elements/[type]/[id] - Delete specific element
export async function DELETE(request: NextRequest) {
  const { type, id } = extractTypeAndId(request.nextUrl.pathname);

  // Check admin authentication
  const auth = await requireAdmin(request);
  if (auth) return auth;

  try {
    if (!type || !id) {
      return NextResponse.json(
        createErrorResponse(`Missing type or id in URL`),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    // Validate element type
    if (!isElementType(type)) {
      return NextResponse.json(
        createErrorResponse(`Invalid element type: ${type}`),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    const result = await elementApiClient.deleteElement(id);

    return NextResponse.json(
      createSuccessResponse(result, `${type} element deleted successfully`, {
        type,
        timestamp: new Date().toISOString(),
      }),
      { headers: getSecurityHeaders() },
    );
  } catch (error) {
    console.error(`Element deletion error for ${type}/${id}:`, error);
    return NextResponse.json(createErrorResponse(`Failed to delete element`), {
      status: 500,
      headers: getSecurityHeaders(),
    });
  }
}
