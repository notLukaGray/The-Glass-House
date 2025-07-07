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
  QueryParams,
} from "@/lib/api/types";
import { checkRateLimit, createRateLimitHeaders } from "@/lib/rateLimit";

// Enhanced query parameters with search and filtering
export interface EnhancedQueryParams extends QueryParams {
  search?: string;
  searchFields?: string[];
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Security: Allowed search fields to prevent injection
const ALLOWED_SEARCH_FIELDS = [
  "title.en",
  "title.es",
  "description.en",
  "description.es",
  "alternativeTitle.en",
  "alternativeTitle.es",
  "text.en",
  "text.es",
  "caption.en",
  "caption.es",
];

// Security: Allowed sort fields to prevent injection
const ALLOWED_SORT_FIELDS = [
  "_createdAt",
  "_updatedAt",
  "title.en",
  "description.en",
  "customId",
];

// Security: Sanitize GROQ strings to prevent injection
export function sanitizeGroqString(input: string): string {
  if (!input || typeof input !== "string") return "";

  // Remove GROQ operators and special characters that could be used for injection
  return input
    .replace(/[\[\]{}|&!<>()]/g, "") // Remove GROQ operators
    .replace(/['"]/g, "") // Remove quotes
    .replace(/\\/g, "") // Remove backslashes
    .trim()
    .substring(0, 1000); // Limit length to prevent DoS
}

// Security: Validate search fields against allowed list
export function validateSearchFields(fields: string[]): string[] {
  if (!Array.isArray(fields)) return ALLOWED_SEARCH_FIELDS.slice(0, 3);

  return fields
    .filter((field) => ALLOWED_SEARCH_FIELDS.includes(field))
    .slice(0, 10); // Limit number of search fields
}

// Security: Validate sort field
export function validateSortField(field: string): string {
  return ALLOWED_SORT_FIELDS.includes(field) ? field : "_createdAt";
}

// Security: Validate and sanitize filters
export function validateFilters(
  filters: Record<string, unknown>,
): Record<string, unknown> {
  if (!filters || typeof filters !== "object") return {};

  const sanitized: Record<string, unknown> = {};
  const allowedFilterKeys = [
    "customId",
    "debug",
    "hasCasting",
    "hasComputedFields",
  ];

  for (const [key, value] of Object.entries(filters)) {
    if (allowedFilterKeys.includes(key)) {
      if (typeof value === "string") {
        sanitized[key] = sanitizeGroqString(value);
      } else if (typeof value === "boolean" || typeof value === "number") {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}

// Shared base fields that all elements have
export const BASE_ELEMENT_FIELDS = [
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

// Enhanced parameter parsing with search and filtering
export function parseElementParams(request: NextRequest): EnhancedQueryParams {
  const searchParams = request.nextUrl.searchParams;

  // Security: Validate and sanitize all inputs
  const rawParams = {
    limit: searchParams.get("limit"),
    page: searchParams.get("page"),
    sort: searchParams.get("sort"),
    order: searchParams.get("order"),
    filter: searchParams.get("filter"),
    include: searchParams.get("include"),
    exclude: searchParams.get("exclude"),
    search: searchParams.get("search")
      ? sanitizeGroqString(searchParams.get("search")!)
      : undefined,
    searchFields: searchParams.get("searchFields")
      ? validateSearchFields(searchParams.get("searchFields")!.split(","))
      : undefined,
    filters: searchParams.get("filters")
      ? validateFilters(JSON.parse(searchParams.get("filters")!))
      : undefined,
    sortBy: searchParams.get("sortBy")
      ? validateSortField(searchParams.get("sortBy")!)
      : undefined,
    sortOrder: searchParams.get("sortOrder") === "asc" ? "asc" : "desc",
  };

  return QueryParamsSchema.parse(rawParams) as EnhancedQueryParams;
}

// Build search query for text-based search
export function buildSearchQuery(
  elementType: ElementType,
  searchTerm: string,
  searchFields: string[] = ["title.en", "description.en", "text.en"],
): string {
  // Security: Validate and sanitize inputs
  const sanitizedSearchTerm = sanitizeGroqString(searchTerm);
  const validatedSearchFields = validateSearchFields(searchFields);

  if (!sanitizedSearchTerm || validatedSearchFields.length === 0) {
    return `*[_type == "${elementType}"]`;
  }

  const searchConditions = validatedSearchFields
    .map((field) => `${field} match "*${sanitizedSearchTerm}*"`)
    .join(" || ");

  return `*[_type == "${elementType}" && (${searchConditions})]`;
}

// Build filter query for structured filtering
export function buildFilterQuery(
  elementType: ElementType,
  filters: Record<string, unknown>,
): string {
  // Security: Validate filters
  const validatedFilters = validateFilters(filters);

  if (Object.keys(validatedFilters).length === 0) {
    return `*[_type == "${elementType}"]`;
  }

  const filterConditions = Object.entries(validatedFilters)
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `${key} == "${sanitizeGroqString(value)}"`;
      } else if (typeof value === "boolean") {
        return `${key} == ${value}`;
      } else if (typeof value === "number") {
        return `${key} == ${value}`;
      } else if (Array.isArray(value)) {
        const sanitizedArray = value
          .filter((v) => typeof v === "string")
          .map((v) => sanitizeGroqString(v as string))
          .filter((v) => v.length > 0);
        return `${key} in [${sanitizedArray.map((v) => `"${v}"`).join(", ")}]`;
      }
      return null;
    })
    .filter(Boolean)
    .join(" && ");

  return filterConditions
    ? `*[_type == "${elementType}" && ${filterConditions}]`
    : `*[_type == "${elementType}"]`;
}

// Enhanced query building with search and filtering
export function buildElementQuery(
  elementType: ElementType,
  specificFields: string[],
  params: EnhancedQueryParams,
): string {
  const allFields = [...BASE_ELEMENT_FIELDS, ...specificFields];
  const fieldList = allFields.join(",\n        ");

  let baseQuery: string;

  // Build base query based on search/filter parameters
  if (params.search) {
    baseQuery = buildSearchQuery(
      elementType,
      params.search,
      params.searchFields,
    );
  } else if (params.filters && Object.keys(params.filters).length > 0) {
    baseQuery = buildFilterQuery(elementType, params.filters);
  } else {
    baseQuery = `*[_type == "${elementType}"]`;
  }

  // Add sorting with validation
  const sortField = validateSortField(params.sortBy || "_createdAt");
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";
  const sortClause = `order(${sortField} ${sortOrder})`;

  // Add pagination with limits
  const start = Math.max(0, ((params.page || 1) - 1) * (params.limit || 10));
  const end = Math.min(start + (params.limit || 10), start + 100); // Max 100 items
  const paginationClause = `[${start}...${end}]`;

  return `
    ${baseQuery} {
      ${fieldList}
    } | ${sortClause} ${paginationClause}
  `;
}

// Enhanced count query with search and filtering
export function buildCountQuery(
  elementType: ElementType,
  params: EnhancedQueryParams,
): string {
  let baseQuery: string;

  if (params.search) {
    baseQuery = buildSearchQuery(
      elementType,
      params.search,
      params.searchFields,
    );
  } else if (params.filters && Object.keys(params.filters).length > 0) {
    baseQuery = buildFilterQuery(elementType, params.filters);
  } else {
    baseQuery = `*[_type == "${elementType}"]`;
  }

  return `count(${baseQuery})`;
}

// Security: Add security headers
export function getSecurityHeaders() {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
}

// Shared response building
export async function buildElementResponse(
  data: ElementWithCasting[],
  elementType: ElementType,
  elementName: string,
  total: number,
  params: EnhancedQueryParams,
  request: NextRequest,
) {
  // Check rate limit for public GET requests
  const rateLimit = await checkRateLimit(request);

  if (rateLimit.isLimited) {
    return NextResponse.json(
      createErrorResponse("Rate limit exceeded. Please try again later."),
      {
        status: 429,
        headers: {
          ...getSecurityHeaders(),
          ...createRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
          "Retry-After": Math.ceil(
            (rateLimit.resetTime - Date.now()) / 1000,
          ).toString(),
        },
      },
    );
  }

  const headers = {
    ...getCacheHeaders(),
    ...getSecurityHeaders(),
    ...createRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
  };

  return NextResponse.json(
    createSuccessResponse(
      data,
      `Retrieved ${data.length} ${elementName} elements`,
      {
        count: data.length,
        total,
        page: params.page || 1,
        limit: params.limit || 10,
        hasMore: (params.page || 1) * (params.limit || 10) < total,
        type: elementType,
        search: params.search,
        filters: params.filters,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        timestamp: new Date().toISOString(),
      },
    ),
    { headers },
  );
}

// Shared error handling with security
export function handleElementError(error: unknown, elementName: string) {
  // Security: Log error internally but don't expose details
  console.error(`${elementName} Elements API Error:`, error);

  return NextResponse.json(
    createErrorResponse(`Failed to process ${elementName} elements`),
    {
      status: 400,
      headers: getSecurityHeaders(),
    },
  );
}

// Shared element fetching with enhanced capabilities
export async function fetchElements(
  elementType: ElementType,
  specificFields: string[],
  params: EnhancedQueryParams,
) {
  const query = buildElementQuery(elementType, specificFields, params);
  const countQuery = buildCountQuery(elementType, params);

  const [elements, totalResult] = await Promise.all([
    elementApiClient.query(query),
    elementApiClient.query(countQuery),
  ]);

  const total = Array.isArray(totalResult) ? totalResult[0] : totalResult;

  return { elements, total };
}

// Write operation utilities with validation
export async function createElement(
  elementType: ElementType,
  elementData: Record<string, unknown>,
) {
  try {
    // Security: Validate element type
    if (!elementType || typeof elementType !== "string") {
      throw new Error("Invalid element type");
    }

    const result = await elementApiClient.createElement(
      elementType,
      elementData,
    );
    return result;
  } catch (error) {
    throw new Error(`Failed to create ${elementType}: ${error}`);
  }
}

export async function updateElement(
  elementId: string,
  elementData: Record<string, unknown>,
) {
  try {
    // Security: Validate element ID
    if (!elementId || typeof elementId !== "string") {
      throw new Error("Invalid element ID");
    }

    const result = await elementApiClient.updateElement(elementId, elementData);
    return result;
  } catch (error) {
    throw new Error(`Failed to update element ${elementId}: ${error}`);
  }
}

export async function deleteElement(elementId: string) {
  try {
    // Security: Validate element ID
    if (!elementId || typeof elementId !== "string") {
      throw new Error("Invalid element ID");
    }

    await elementApiClient.deleteElement(elementId);
    return { success: true, id: elementId };
  } catch (error) {
    throw new Error(`Failed to delete element ${elementId}: ${error}`);
  }
}

// Bulk operation utilities with limits
export async function bulkCreateElements(
  elementType: ElementType,
  elementsData: Record<string, unknown>[],
) {
  try {
    // Security: Limit bulk operations
    if (!Array.isArray(elementsData) || elementsData.length === 0) {
      throw new Error("No elements provided for bulk creation");
    }

    if (elementsData.length > 50) {
      // Reduced from 100 for security
      throw new Error("Cannot create more than 50 elements at once");
    }

    const results = await elementApiClient.bulkCreateElements(
      elementType,
      elementsData,
    );
    return results;
  } catch (error) {
    throw new Error(`Failed to bulk create ${elementType}s: ${error}`);
  }
}

export async function bulkUpdateElements(
  updates: Array<{ id: string; data: Record<string, unknown> }>,
) {
  try {
    // Security: Validate and limit bulk updates
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error("No updates provided for bulk operation");
    }

    if (updates.length > 50) {
      // Reduced from 100 for security
      throw new Error("Cannot update more than 50 elements at once");
    }

    // Validate each update
    for (const update of updates) {
      if (!update.id || typeof update.id !== "string") {
        throw new Error("Invalid element ID in bulk update");
      }
    }

    const results = await elementApiClient.bulkUpdateElements(updates);
    return results;
  } catch (error) {
    throw new Error(`Failed to bulk update elements: ${error}`);
  }
}

export async function bulkDeleteElements(elementIds: string[]) {
  try {
    // Security: Validate and limit bulk deletes
    if (!Array.isArray(elementIds) || elementIds.length === 0) {
      throw new Error("No element IDs provided for bulk deletion");
    }

    if (elementIds.length > 50) {
      // Reduced from 100 for security
      throw new Error("Cannot delete more than 50 elements at once");
    }

    // Validate each ID
    for (const id of elementIds) {
      if (!id || typeof id !== "string") {
        throw new Error("Invalid element ID in bulk deletion");
      }
    }

    const result = await elementApiClient.bulkDeleteElements(elementIds);
    return result;
  } catch (error) {
    throw new Error(`Failed to bulk delete elements: ${error}`);
  }
}

// Shared enhancement function type
export type ElementEnhancer<T extends ElementWithCasting = ElementWithCasting> =
  (element: T) => Record<string, unknown>;

// Shared element processing
export function processElements<
  T extends ElementWithCasting = ElementWithCasting,
>(elements: T[], enhancer?: ElementEnhancer<T>): T[] {
  if (!enhancer) return elements;

  return elements.map((element: T) => ({
    ...element,
    ...enhancer(element),
  }));
}
