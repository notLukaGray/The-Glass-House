import { NextRequest, NextResponse } from "next/server";
import { elementApiClient } from "@/lib/api/client";
import {
  createSuccessResponse,
  createErrorResponse,
  getCacheHeaders,
} from "@/lib/api/utils";
import { QueryParamsSchema } from "@/lib/api/types";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { TextSingleLineElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// Typography type
export interface Typography {
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  lineHeight?: string;
  altColor?: string;
}

// Text Single Element type for API
export interface TextSingleElement extends ElementWithCasting {
  text?: Record<string, string>;
  usage?: string;
  typography?: Typography;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

const crud = createElementCrudHandler({
  elementType: "elementTextSingleLine",
  schema: TextSingleLineElementSchema,
});

export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;

// GET /api/elements/text-single - Get elementTextSingleLine elements with text-specific functionality
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

    // Get elementTextSingleLine elements with all text-specific fields
    const elements = await elementApiClient.query<TextSingleElement[]>(`
      *[_type == "elementTextSingleLine"] {
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
        casting,
        // Text-specific fields based on actual schema
        text,
        usage,
        typography {
          fontSize,
          fontWeight,
          textAlign,
          lineHeight,
          altColor
        }
      } | order(_createdAt desc) [${(validatedParams.page || 1) - 1}...${(validatedParams.page || 1) * (validatedParams.limit || 10)}]
    `);

    // Get total count for pagination
    const totalResult = await elementApiClient.query(
      `count(*[_type == "elementTextSingleLine"])`,
    );
    const total = Array.isArray(totalResult) ? totalResult[0] : totalResult;

    // Enhance response with text-specific metadata
    const enhancedData = elements.map((element: TextSingleElement) => {
      // Get the best available text content
      const textContent =
        element.text?.en ||
        Object.values(element.text || {}).find((val: string) => val?.trim()) ||
        element.title?.en ||
        "No text content";

      return {
        ...element,
        textInfo: {
          content: textContent,
          localizedText: element.text,
          usage: element.usage,
          typography: element.typography,
          // Computed properties
          characterCount: textContent.length,
          wordCount: textContent.split(/\s+/).length,
          hasTypography: !!element.typography,
          hasStyling: !!(
            element.typography?.fontSize ||
            element.typography?.fontWeight ||
            element.typography?.textAlign
          ),
          // Casting properties
          casting: element.casting,
        },
      };
    });

    return NextResponse.json(
      createSuccessResponse(
        enhancedData,
        `Retrieved ${enhancedData.length} single line text elements`,
        {
          count: enhancedData.length,
          total,
          page: validatedParams.page || 1,
          limit: validatedParams.limit || 10,
          hasMore:
            (validatedParams.page || 1) * (validatedParams.limit || 10) < total,
          type: "elementTextSingleLine",
          timestamp: new Date().toISOString(),
        },
      ),
      { headers: getCacheHeaders() },
    );
  } catch (error) {
    console.error("Text Single Line Elements API Error:", error);

    return NextResponse.json(
      createErrorResponse(
        error instanceof Error
          ? error.message
          : "Failed to fetch single line text elements",
      ),
      { status: 400 },
    );
  }
}
