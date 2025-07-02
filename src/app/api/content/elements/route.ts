import { NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/handlers/sanity";
import { z } from "zod";

// Schema for validating element data
const ElementDataSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  title: z.record(z.string()).nullable().optional(),
  description: z.record(z.string()).nullable().optional(),
  alternativeTitle: z.record(z.string()).nullable().optional(),
  caption: z.record(z.string()).nullable().optional(),
  customId: z.string().nullable().optional(),
  debug: z.boolean().optional(),
  computedFields: z
    .object({
      ariaLabel: z.record(z.string()).optional(),
      altText: z.record(z.string()).optional(),
      customId: z.string().optional(),
    })
    .nullable()
    .optional(),
  // Element-specific fields
  text: z.record(z.string()).nullable().optional(),
  buttonText: z.record(z.string()).nullable().optional(),
  richTextContent: z.record(z.array(z.any())).nullable().optional(),
  imageUpload: z.any().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  svgString: z.string().nullable().optional(),
  svgFile: z.any().nullable().optional(),
});

// Helper function to clean localized content by removing _type fields
function cleanLocalizedContent(
  content: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null | undefined {
  if (!content || typeof content !== "object") {
    return content;
  }

  // If it's a localized content object (has _type and language keys)
  if ("_type" in content && (content.en || content.es)) {
    const cleaned: Record<string, unknown> = {};
    Object.keys(content).forEach((key) => {
      if (key !== "_type") {
        // Clean up any strange Unicode characters that might have been added
        const value = content[key];
        if (typeof value === "string") {
          // Remove zero-width characters and other invisible Unicode
          cleaned[key] = value.replace(/[\u200B-\u200D\uFEFF]/g, "");
        } else {
          cleaned[key] = value;
        }
      }
    });
    return cleaned;
  }

  return content;
}

// Helper function to clean element data
function cleanElementData(
  element: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null | undefined {
  if (!element || typeof element !== "object") {
    return element;
  }

  const cleaned: Record<string, unknown> = {
    ...(element as Record<string, unknown>),
  };

  // Clean localized fields
  [
    "title",
    "description",
    "text",
    "buttonText",
    "alternativeTitle",
    "caption",
  ].forEach((field) => {
    if (cleaned[field]) {
      cleaned[field] = cleanLocalizedContent(
        cleaned[field] as Record<string, unknown>,
      );
    }
  });

  // Clean computed fields
  if (cleaned.computedFields && typeof cleaned.computedFields === "object") {
    const computedFields = cleaned.computedFields as Record<string, unknown>;
    if (computedFields.ariaLabel) {
      computedFields.ariaLabel = cleanLocalizedContent(
        computedFields.ariaLabel as Record<string, unknown>,
      );
    }
    if (computedFields.altText) {
      computedFields.altText = cleanLocalizedContent(
        computedFields.altText as Record<string, unknown>,
      );
    }
  }

  // Only include debug field if it's true
  if (
    cleaned.debug === false ||
    cleaned.debug === null ||
    cleaned.debug === undefined
  ) {
    delete cleaned.debug;
  }

  return cleaned;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const elementType = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query based on element type
    let query = "";
    if (elementType) {
      query = `*[_type == "${elementType}"] | order(_createdAt desc)[0...${limit}]{
        _id,
        _type,
        title,
        description,
        alternativeTitle,
        caption,
        customId,
        debug,
        computedFields,
        // Element-specific fields
        text,
        buttonText,
        richTextContent,
        imageUpload,
        imageUrl,
        svgString,
        svgFile,
        // Casting fields
        sizeAndPosition,
        displayAndTransform
      }`;
    } else {
      // Get all element types
      query = `*[_type in ["elementImage", "elementButton", "elementTextSingleLine", "elementTextBlock", "elementRichText", "elementSVG"]] | order(_createdAt desc)[0...${limit}]{
        _id,
        _type,
        title,
        description,
        alternativeTitle,
        caption,
        customId,
        debug,
        computedFields,
        // Element-specific fields
        text,
        buttonText,
        richTextContent,
        imageUpload,
        imageUrl,
        svgString,
        svgFile,
        // Casting fields
        sizeAndPosition,
        displayAndTransform
      }`;
    }

    const elements = await sanityClient.fetch(
      query,
      {},
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      },
    );

    if (!elements || (Array.isArray(elements) && elements.length === 0)) {
      return NextResponse.json(
        { error: "No elements found", type: elementType },
        { status: 404 },
      );
    }

    // Clean and transform the data
    const cleanedElements = Array.isArray(elements)
      ? elements.map(cleanElementData)
      : [cleanElementData(elements)];

    // Validate response data
    const validatedElements = cleanedElements.map((el) =>
      ElementDataSchema.safeParse(el),
    );

    const validElements = validatedElements
      .filter((result) => result.success)
      .map((result) => result.data);

    const invalidElements = validatedElements
      .filter((result) => !result.success)
      .map((result) => result.error);

    if (invalidElements.length > 0) {
      console.warn("Some elements failed validation:", invalidElements);
    }

    return NextResponse.json({
      elements: validElements,
      count: validElements.length,
      type: elementType || "all",
      validationErrors:
        invalidElements.length > 0 ? invalidElements : undefined,
    });
  } catch (error) {
    console.error("Failed to fetch elements:", error);
    return NextResponse.json(
      { error: "Failed to fetch elements" },
      { status: 500 },
    );
  }
}
