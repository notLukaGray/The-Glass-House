import { NextRequest } from "next/server";
import {
  ApiResponse,
  ApiMeta,
  QueryParams,
  ApiError,
  DEFAULT_API_CONFIG,
  ElementWithCasting,
} from "./types";

// Response Helpers
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: Partial<ApiMeta>,
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

export function createErrorResponse(error: string | ApiError): ApiResponse {
  const errorObj: ApiError =
    typeof error === "string"
      ? {
          code: "API_ERROR",
          message: error,
          timestamp: new Date().toISOString(),
        }
      : error;

  return {
    success: false,
    error: errorObj.message,
    meta: {
      timestamp: errorObj.timestamp,
    },
  };
}

// Query Parameter Parsing
export function parseQueryParams(request: NextRequest): QueryParams {
  const searchParams = request.nextUrl.searchParams;

  return {
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : DEFAULT_API_CONFIG.defaultLimit,
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
    sort: searchParams.get("sort") || undefined,
    order: (searchParams.get("order") as "asc" | "desc") || "desc",
    filter: searchParams.get("filter")
      ? JSON.parse(searchParams.get("filter")!)
      : undefined,
    include: searchParams.get("include")
      ? searchParams.get("include")!.split(",")
      : undefined,
    exclude: searchParams.get("exclude")
      ? searchParams.get("exclude")!.split(",")
      : undefined,
  };
}

// Validation Helpers
export function validateLimit(limit: number): number {
  return Math.min(Math.max(limit, 1), DEFAULT_API_CONFIG.maxLimit);
}

export function validatePage(page: number): number {
  return Math.max(page, 1);
}

// Sanity Query Building
export function buildSanityQuery(
  type: string,
  params: QueryParams,
  additionalFields: string[] = [],
): string {
  const baseFields = [
    "_id",
    "_type",
    "_createdAt",
    "_updatedAt",
    "title",
    "description",
    "alternativeTitle",
    "caption",
    "customId",
    "debug",
    "computedFields",
    "casting",
  ];

  const allFields = [...baseFields, ...additionalFields];

  let query = `*[_type == "${type}"] {
    ${allFields.join(",\n    ")}
  }`;

  // Add sorting
  if (params.sort) {
    const order = params.order === "asc" ? "asc" : "desc";
    query += ` | order(${params.sort} ${order})`;
  } else {
    query += ` | order(_createdAt desc)`;
  }

  // Add pagination
  const limit = validateLimit(params.limit || DEFAULT_API_CONFIG.defaultLimit);
  const page = validatePage(params.page || 1);
  const start = (page - 1) * limit;

  query += ` [${start}...${start + limit}]`;

  return query;
}

// Cache Control
export function getCacheHeaders(cacheTime = DEFAULT_API_CONFIG.cacheTime) {
  return {
    "Cache-Control": `public, s-maxage=${cacheTime}, stale-while-revalidate=${cacheTime * 2}`,
  };
}

// Error Handling
export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      code: "API_ERROR",
      message: error.message,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unknown error occurred",
    timestamp: new Date().toISOString(),
  };
}

// Type Guards
export function isValidElementType(type: string): type is string {
  return [
    "elementImage",
    "elementVideo",
    "elementAudio",
    "element3D",
    "elementCanvas",
    "elementTextSingleLine",
    "elementTextBlock",
    "elementRichText",
    "elementButton",
    "elementSVG",
    "elementDivider",
    "elementWidget",
  ].includes(type);
}

// Response Formatting
export function formatElementResponse(
  element: Partial<ElementWithCasting>,
): ElementWithCasting {
  // Ensure consistent structure
  return {
    _id: element._id || "",
    _type: element._type || "unknown",
    _createdAt: element._createdAt || new Date().toISOString(),
    _updatedAt: element._updatedAt || new Date().toISOString(),
    title: element.title,
    description: element.description,
    alternativeTitle: element.alternativeTitle,
    caption: element.caption,
    customId: element.customId,
    debug: element.debug,
    computedFields: element.computedFields,
    casting: element.casting,
  };
}

// Pagination Helpers
export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number,
): ApiMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    count: Math.min(limit, total - (page - 1) * limit),
    total,
    page,
    limit,
    hasMore: page < totalPages,
    timestamp: new Date().toISOString(),
  };
}
