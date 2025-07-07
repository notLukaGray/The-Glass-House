import { NextRequest, NextResponse } from "next/server";
import {
  bulkCreateElements,
  bulkUpdateElements,
  bulkDeleteElements,
} from "@/lib/api/utils/elementUtils";
import { createSuccessResponse, createErrorResponse } from "@/lib/api/utils";
import { ElementType } from "@/lib/api/types";
import { getToken } from "next-auth/jwt";
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

// POST /api/elements/bulk - Bulk create elements
export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { type, elements } = body;

    if (!type || !elements || !Array.isArray(elements)) {
      return NextResponse.json(
        createErrorResponse("Type and elements array are required"),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    if (
      ![
        "elementTextSingleLine",
        "elementTextBlock",
        "elementRichText",
        "elementImage",
        "elementVideo",
        "elementButton",
        "elementSVG",
        "elementAudio",
        "element3D",
        "elementCanvas",
        "elementDivider",
        "elementWidget",
      ].includes(type)
    ) {
      return NextResponse.json(createErrorResponse("Invalid element type"), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    if (elements.length === 0) {
      return NextResponse.json(
        createErrorResponse("Elements array cannot be empty"),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    if (elements.length > 50) {
      // Reduced from 100 for security
      return NextResponse.json(
        createErrorResponse("Cannot create more than 50 elements at once"),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    // Validate each element has required fields
    for (const element of elements) {
      if (!element._type || element._type !== type) {
        return NextResponse.json(
          createErrorResponse("Each element must have the correct _type"),
          {
            status: 400,
            headers: getSecurityHeaders(),
          },
        );
      }
    }

    // Bulk create elements
    const results = await bulkCreateElements(type as ElementType, elements);

    return NextResponse.json(
      createSuccessResponse(
        results,
        `Successfully created ${results.length} ${type} elements`,
        {
          type,
          count: results.length,
          timestamp: new Date().toISOString(),
        },
      ),
      {
        status: 201,
        headers: getSecurityHeaders(),
      },
    );
  } catch (error) {
    console.error("Bulk creation error:", error);
    return NextResponse.json(
      createErrorResponse("Failed to bulk create elements"),
      {
        status: 500,
        headers: getSecurityHeaders(),
      },
    );
  }
}

// PUT /api/elements/bulk - Bulk update elements
export async function PUT(request: NextRequest) {
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
    const body = await request.json();
    const { type, updates } = body;

    if (!type || !updates || !Array.isArray(updates)) {
      return NextResponse.json(
        createErrorResponse("Type and updates array are required"),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    if (
      ![
        "elementTextSingleLine",
        "elementTextBlock",
        "elementRichText",
        "elementImage",
        "elementVideo",
        "elementButton",
        "elementSVG",
        "elementAudio",
        "element3D",
        "elementCanvas",
        "elementDivider",
        "elementWidget",
      ].includes(type)
    ) {
      return NextResponse.json(createErrorResponse("Invalid element type"), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    if (updates.length === 0) {
      return NextResponse.json(
        createErrorResponse("Updates array cannot be empty"),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    if (updates.length > 50) {
      // Reduced from 100 for security
      return NextResponse.json(
        createErrorResponse("Cannot update more than 50 elements at once"),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    // Validate each update has required fields
    for (const update of updates) {
      if (!update.id || !update.data) {
        return NextResponse.json(
          createErrorResponse("Each update must have id and data fields"),
          {
            status: 400,
            headers: getSecurityHeaders(),
          },
        );
      }
    }

    // Bulk update elements
    const results = await bulkUpdateElements(updates);

    return NextResponse.json(
      createSuccessResponse(
        results,
        `Successfully updated ${results.length} ${type} elements`,
        {
          type,
          count: results.length,
          timestamp: new Date().toISOString(),
        },
      ),
      { headers: getSecurityHeaders() },
    );
  } catch (error) {
    console.error("Bulk update error:", error);
    return NextResponse.json(
      createErrorResponse("Failed to bulk update elements"),
      {
        status: 500,
        headers: getSecurityHeaders(),
      },
    );
  }
}

// DELETE /api/elements/bulk - Bulk delete elements
export async function DELETE(request: NextRequest) {
  // Check admin authentication
  const auth = await requireAdmin(request);
  if (auth) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const ids = searchParams.get("ids");

    if (!type || !ids) {
      return NextResponse.json(
        createErrorResponse("Type and ids are required"),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    if (
      ![
        "elementTextSingleLine",
        "elementTextBlock",
        "elementRichText",
        "elementImage",
        "elementVideo",
        "elementButton",
        "elementSVG",
        "elementAudio",
        "element3D",
        "elementCanvas",
        "elementDivider",
        "elementWidget",
      ].includes(type)
    ) {
      return NextResponse.json(createErrorResponse("Invalid element type"), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    const elementIds = ids.split(",").filter((id) => id.trim());

    if (elementIds.length === 0) {
      return NextResponse.json(
        createErrorResponse("No valid element IDs provided"),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    if (elementIds.length > 50) {
      // Reduced from 100 for security
      return NextResponse.json(
        createErrorResponse("Cannot delete more than 50 elements at once"),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    // Bulk delete elements
    const result = await bulkDeleteElements(elementIds);

    return NextResponse.json(
      createSuccessResponse(
        result,
        `Successfully deleted ${result.deletedCount} ${type} elements`,
        {
          type,
          deletedCount: result.deletedCount,
          timestamp: new Date().toISOString(),
        },
      ),
      { headers: getSecurityHeaders() },
    );
  } catch (error) {
    console.error("Bulk deletion error:", error);
    return NextResponse.json(
      createErrorResponse("Failed to bulk delete elements"),
      {
        status: 500,
        headers: getSecurityHeaders(),
      },
    );
  }
}
