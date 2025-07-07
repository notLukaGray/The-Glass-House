import { NextRequest, NextResponse } from "next/server";
import { elementApiClient } from "@/lib/api/client";
import {
  createSuccessResponse,
  createErrorResponse,
  getCacheHeaders,
} from "@/lib/api/utils";
import { ElementType, ElementWithCasting } from "@/lib/api/types";
import { getSecurityHeaders } from "@/lib/api/utils/elementUtils";

// GET /api/elements/search - Advanced search across all element types
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("q");
    const elementType = searchParams.get("type") as ElementType | null;
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10"), 1),
      100,
    );
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const sortBy = searchParams.get("sortBy") || "_createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const searchFields = searchParams.get("searchFields")?.split(",") || [
      "title.en",
      "description.en",
      "text.en",
    ];

    if (!searchTerm) {
      return NextResponse.json(
        createErrorResponse("Search term (q) is required"),
        {
          status: 400,
          headers: getSecurityHeaders(),
        },
      );
    }

    // Build search query
    const typeFilter = elementType ? `&& _type == "${elementType}"` : "";
    const searchConditions = searchFields
      .map((field) => `${field} match "*${searchTerm}*"`)
      .join(" || ");

    const query = `
      *[_type in ["elementTextSingleLine", "elementTextBlock", "elementRichText", "elementImage", "elementVideo", "elementButton", "elementSVG", "elementAudio", "element3D", "elementCanvas", "elementDivider", "elementWidget"] ${typeFilter} && (${searchConditions})] {
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
      } | order(${sortBy} ${sortOrder}) [${(page - 1) * limit}...${page * limit}]
    `;

    const countQuery = `
      count(*[_type in ["elementTextSingleLine", "elementTextBlock", "elementRichText", "elementImage", "elementVideo", "elementButton", "elementSVG", "elementAudio", "element3D", "elementCanvas", "elementDivider", "elementWidget"] ${typeFilter} && (${searchConditions})])
    `;

    const [elements, totalResult] = await Promise.all([
      elementApiClient.query<ElementWithCasting[]>(query),
      elementApiClient.query<number>(countQuery),
    ]);

    const total = Array.isArray(totalResult) ? totalResult[0] : totalResult;

    // Group results by element type
    const groupedResults = elements.reduce(
      (acc, element) => {
        const type = element._type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(element);
        return acc;
      },
      {} as Record<string, ElementWithCasting[]>,
    );

    // Calculate type statistics
    const typeStats = Object.entries(groupedResults).map(
      ([type, elements]) => ({
        type,
        count: elements.length,
      }),
    );

    return NextResponse.json(
      createSuccessResponse(
        {
          results: elements,
          grouped: groupedResults,
          stats: typeStats,
        },
        `Found ${elements.length} elements matching "${searchTerm}"`,
        {
          count: elements.length,
          total,
          page,
          limit,
          hasMore: page * limit < total,
          search: searchTerm,
          type: elementType || "all",
          searchFields,
          sortBy,
          sortOrder,
          timestamp: new Date().toISOString(),
        },
      ),
      { headers: { ...getCacheHeaders(), ...getSecurityHeaders() } },
    );
  } catch (error) {
    console.error("Element search error:", error);
    return NextResponse.json(createErrorResponse("Failed to search elements"), {
      status: 500,
      headers: getSecurityHeaders(),
    });
  }
}
