import { NextRequest, NextResponse } from "next/server";
import { elementApiClient } from "@/lib/api/client";
import {
  createSuccessResponse,
  createErrorResponse,
  getCacheHeaders,
} from "@/lib/api/utils";
import { QueryParamsSchema, ELEMENT_TYPES, ElementType } from "@/lib/api/types";
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

function extractType(pathname: string): string | null {
  // Matches /api/elements/[type] or /app/api/elements/[type]
  const match = pathname.match(/elements\/(\w+)/);
  return match?.[1] || null;
}

// Schema for creating elements of specific type
const CreateElementByTypeSchema = z.record(z.any());

// GET /api/elements/[type] - Get elements of specific type
export async function GET(request: NextRequest) {
  const type = extractType(request.nextUrl.pathname);
  try {
    if (!type) {
      return NextResponse.json(createErrorResponse(`Missing type in URL`), {
        status: 400,
        headers: getSecurityHeaders(),
      });
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
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const rawParams = {
      limit: searchParams.get("limit"),
      page: searchParams.get("page"),
      sort: searchParams.get("sort"),
      order: searchParams.get("order"),
      filter: searchParams.get("filter"),
      include: searchParams.get("include"),
      exclude: searchParams.get("exclude"),
    };
    const validatedParams = QueryParamsSchema.parse(rawParams);
    // Get elements of specific type
    const elements = await elementApiClient.getElementsByType(
      type,
      validatedParams,
    );
    return NextResponse.json(
      createSuccessResponse(
        elements.data,
        `Retrieved ${elements.data.length} ${type} elements`,
        elements.meta,
      ),
      { headers: { ...getCacheHeaders(), ...getSecurityHeaders() } },
    );
  } catch (error) {
    console.error(`${type} Elements API Error:`, error);
    return NextResponse.json(
      createErrorResponse(`Failed to retrieve ${type} elements`),
      {
        status: 500,
        headers: getSecurityHeaders(),
      },
    );
  }
}

// POST /api/elements/[type] - Create new element of specific type
export async function POST(request: NextRequest) {
  const type = extractType(request.nextUrl.pathname);

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
    if (!type) {
      return NextResponse.json(createErrorResponse(`Missing type in URL`), {
        status: 400,
        headers: getSecurityHeaders(),
      });
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
    const parsed = CreateElementByTypeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(createErrorResponse("Invalid request data"), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    const result = await elementApiClient.createElement(type, parsed.data);

    return NextResponse.json(
      createSuccessResponse(result, `${type} created successfully`, {
        type,
        timestamp: new Date().toISOString(),
      }),
      { headers: getSecurityHeaders() },
    );
  } catch (error) {
    console.error(`${type} creation error:`, error);
    return NextResponse.json(
      createErrorResponse(`Failed to create ${type} element`),
      {
        status: 500,
        headers: getSecurityHeaders(),
      },
    );
  }
}

// PUT /api/elements/[type] - Update elements of specific type
export async function PUT(request: NextRequest) {
  const type = extractType(request.nextUrl.pathname);

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
    if (!type) {
      return NextResponse.json(createErrorResponse(`Missing type in URL`), {
        status: 400,
        headers: getSecurityHeaders(),
      });
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
    const parsed = CreateElementByTypeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(createErrorResponse("Invalid request data"), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    if (!parsed.data._id) {
      return NextResponse.json(createErrorResponse("Element ID is required"), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    const { _id, ...updateData } = parsed.data;
    const result = await elementApiClient.updateElement(_id, updateData);

    return NextResponse.json(
      createSuccessResponse(result, `${type} updated successfully`, {
        type,
        timestamp: new Date().toISOString(),
      }),
      { headers: getSecurityHeaders() },
    );
  } catch (error) {
    console.error(`${type} update error:`, error);
    return NextResponse.json(
      createErrorResponse(`Failed to update ${type} element`),
      {
        status: 500,
        headers: getSecurityHeaders(),
      },
    );
  }
}

// DELETE /api/elements/[type] - Delete elements of specific type
export async function DELETE(request: NextRequest) {
  const type = extractType(request.nextUrl.pathname);

  // Check admin authentication
  const auth = await requireAdmin(request);
  if (auth) return auth;

  try {
    if (!type) {
      return NextResponse.json(createErrorResponse(`Missing type in URL`), {
        status: 400,
        headers: getSecurityHeaders(),
      });
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

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(createErrorResponse("Element ID is required"), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    const result = await elementApiClient.deleteElement(id);

    return NextResponse.json(
      createSuccessResponse(result, `${type} deleted successfully`, {
        type,
        timestamp: new Date().toISOString(),
      }),
      { headers: getSecurityHeaders() },
    );
  } catch (error) {
    console.error(`${type} deletion error:`, error);
    return NextResponse.json(
      createErrorResponse(`Failed to delete ${type} element`),
      {
        status: 500,
        headers: getSecurityHeaders(),
      },
    );
  }
}
