import { NextRequest, NextResponse } from "next/server";
import { elementApiClient } from "@/lib/api/client";
import {
  createSuccessResponse,
  createErrorResponse,
  getCacheHeaders,
} from "@/lib/api/utils";
import { QueryParamsSchema, ElementType } from "@/lib/api/types";
import { createElementCrudHandler } from "@/lib/api/utils/elementCrudHandler";
import { TextBlockElementSchema } from "@/lib/validation/elementSchemas";
import type { ElementWithCasting } from "@/lib/api/types";

// Text Element type for API
export interface TextElement extends ElementWithCasting {
  text?: Record<string, string>;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  lineHeight?: string;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// GET /api/elements/text - Get text elements (both single line and block)
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
    const textType = searchParams.get("textType"); // 'single' or 'block'

    // Determine which text type to fetch
    let elementType: ElementType = "elementTextSingleLine";
    if (textType === "block") {
      elementType = "elementTextBlock";
    }

    // Get text elements
    const elements = await elementApiClient.getElementsByType(
      elementType,
      validatedParams,
    );

    // Enhance response with text-specific metadata
    const enhancedData = elements.data.map((element: TextElement) => ({
      ...element,
      textInfo: {
        content: element.text,
        fontSize: element.fontSize,
        fontWeight: element.fontWeight,
        textAlign: element.textAlign,
        lineHeight: element.lineHeight,
        // Add computed text properties
        characterCount: element.text?.en?.length || 0,
        wordCount: element.text?.en?.split(/\s+/).length || 0,
        hasStyling: !!(
          element.fontSize ||
          element.fontWeight ||
          element.textAlign
        ),
      },
    }));

    return NextResponse.json(
      createSuccessResponse(
        enhancedData,
        `Retrieved ${enhancedData.length} ${elementType} elements`,
        {
          ...elements.meta,
          type: elementType,
        },
      ),
      { headers: getCacheHeaders() },
    );
  } catch (error) {
    console.error("Text Elements API Error:", error);

    return NextResponse.json(
      createErrorResponse(
        error instanceof Error
          ? error.message
          : "Failed to fetch text elements",
      ),
      { status: 400 },
    );
  }
}

const crud = createElementCrudHandler({
  elementType: "elementTextBlock",
  schema: TextBlockElementSchema,
});

export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;
