import { NextRequest, NextResponse } from "next/server";
import { elementApiClient } from "@/lib/api/client";
import {
  createSuccessResponse,
  createErrorResponse,
  getCacheHeaders,
} from "@/lib/api/utils";
import {
  QueryParamsSchema,
  ElementType,
  ElementWithCasting,
} from "@/lib/api/types";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import { getSecurityHeaders } from "@/lib/api/utils/elementUtils";

// Schema for creating elements via the main route
const CreateElementSchema = z.object({
  _type: z.enum([
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
  ]),
  data: z.record(z.any()),
});

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

// GET /api/elements - Get all elements with type filtering
export async function GET(request: NextRequest) {
  try {
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
    const elementType = searchParams.get("type") as ElementType | null;

    // Get elements with type filtering
    const elements = elementType
      ? await elementApiClient.getElementsByType(elementType, validatedParams)
      : await elementApiClient.query<ElementWithCasting[]>(`
          *[_type in ["elementTextSingleLine", "elementTextBlock", "elementRichText", "elementImage", "elementVideo", "elementButton", "elementSVG", "elementAudio", "element3D", "elementCanvas", "elementDivider", "elementWidget"]] {
            _id,
            _type,
            _createdAt,
            _updatedAt,
            title,
            description,
            alternativeTitle,
            caption,
            customId,
            debug,
            computedFields,
            casting
          } | order(_createdAt desc) [${(validatedParams.page || 1) - 1}...${(validatedParams.page || 1) * (validatedParams.limit || 10)}]
        `);

    // Enhance response with element-specific metadata
    const enhancedData = (
      Array.isArray(elements) ? elements : elements.data
    ).map((element: ElementWithCasting) => ({
      ...element,
      elementInfo: {
        type: element._type,
        hasTitle: !!element.title,
        hasDescription: !!element.description,
        hasCasting: !!element.casting,
        hasComputedFields: !!element.computedFields,
        // Add computed element properties
        isTyped: !!elementType,
        hasCustomId: !!element.customId,
        isDebugMode: !!element.debug,
      },
    }));

    return NextResponse.json(
      createSuccessResponse(
        enhancedData,
        `Retrieved ${enhancedData.length} elements`,
        {
          count: enhancedData.length,
          type: elementType || "all",
        },
      ),
      { headers: { ...getCacheHeaders(), ...getSecurityHeaders() } },
    );
  } catch (error) {
    console.error("Elements API Error:", error);

    return NextResponse.json(
      createErrorResponse("Failed to retrieve elements"),
      {
        status: 500,
        headers: getSecurityHeaders(),
      },
    );
  }
}

// POST /api/elements - Create new element with admin authentication
export const POST = async (request: NextRequest) => {
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

  const auth = await requireAdmin(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const parsed = CreateElementSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(createErrorResponse("Invalid request data"), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    const { _type, data } = parsed.data;

    // Use the appropriate element creation function based on type
    const result = await elementApiClient.createElement(
      _type as ElementType,
      data,
    );

    return NextResponse.json(
      createSuccessResponse(result, `${_type} created successfully`, {
        type: _type,
        timestamp: new Date().toISOString(),
      }),
      { headers: getSecurityHeaders() },
    );
  } catch (error) {
    console.error("Element creation error:", error);
    return NextResponse.json(createErrorResponse("Failed to create element"), {
      status: 500,
      headers: getSecurityHeaders(),
    });
  }
};

// PUT /api/elements - Update element with admin authentication
export const PUT = async (request: NextRequest) => {
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

  const auth = await requireAdmin(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const parsed = CreateElementSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(createErrorResponse("Invalid request data"), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    const { _type, data } = parsed.data;

    if (!data._id) {
      return NextResponse.json(createErrorResponse("Element ID is required"), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    const { _id, ...updateData } = data;

    // Use the appropriate element update function based on type
    const result = await elementApiClient.updateElement(_id, updateData);

    return NextResponse.json(
      createSuccessResponse(result, `${_type} updated successfully`, {
        type: _type,
        timestamp: new Date().toISOString(),
      }),
      { headers: getSecurityHeaders() },
    );
  } catch (error) {
    console.error("Element update error:", error);
    return NextResponse.json(createErrorResponse("Failed to update element"), {
      status: 500,
      headers: getSecurityHeaders(),
    });
  }
};

// DELETE /api/elements - Delete element with admin authentication
export const DELETE = async (request: NextRequest) => {
  const auth = await requireAdmin(request);
  if (auth) return auth;

  try {
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
      createSuccessResponse(result, "Element deleted successfully", {
        timestamp: new Date().toISOString(),
      }),
      { headers: getSecurityHeaders() },
    );
  } catch (error) {
    console.error("Element deletion error:", error);
    return NextResponse.json(createErrorResponse("Failed to delete element"), {
      status: 500,
      headers: getSecurityHeaders(),
    });
  }
};
