import { z } from "zod";
import { schemas } from "./schemas";
import { MissingModule } from "@/components/validation/MissingModule";

/**
 * Validation utilities for Sanity data
 *
 * This file provides helper functions for validating data from Sanity CMS
 * and handling validation failures gracefully. It includes fallback components
 * and error reporting mechanisms.
 */

/**
 * Validation result interface
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
  fallback?: React.ComponentType<{
    moduleName: string;
    errors?: z.ZodError;
    showDebug?: boolean;
  }>;
}

/**
 * Validates data against a Zod schema and returns a structured result
 *
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @param fallback - Optional fallback component to use if validation fails
 * @returns ValidationResult with success status and data or errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  fallback?: React.ComponentType<{
    moduleName: string;
    errors?: z.ZodError;
    showDebug?: boolean;
  }>,
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Data validation failed:", {
        errors: error.errors,
        data: data,
      });

      return {
        success: false,
        errors: error,
        fallback,
      };
    }

    // Handle unexpected errors
    console.error("Unexpected validation error:", error);
    return {
      success: false,
      fallback,
    };
  }
}

/**
 * Safe validation that returns null on failure instead of throwing
 *
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns Validated data or null if validation fails
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Data validation failed:", {
        errors: error.errors,
        data: data,
      });
    }
    return null;
  }
}

/**
 * Validates data and provides a fallback value if validation fails
 *
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @param fallback - The fallback value to return if validation fails
 * @returns Validated data or fallback value
 */
export function validateWithFallback<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  fallback: T,
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Data validation failed, using fallback:", {
        errors: error.errors,
        data: data,
        fallback: fallback,
      });
    }
    return fallback;
  }
}

/**
 * Validates settings data with comprehensive error handling
 *
 * @param data - Raw settings data from Sanity
 * @returns Validated settings or null if validation fails
 */
export function validateSettings(data: unknown) {
  return safeValidate(schemas.SiteSettings, data);
}

/**
 * Validates user data with comprehensive error handling
 *
 * @param data - Raw user data from Sanity
 * @returns Validated user data or null if validation fails
 */
export function validateUserData(data: unknown) {
  return safeValidate(schemas.UserData, data);
}

/**
 * Validates portfolio data with comprehensive error handling
 *
 * @param data - Raw portfolio data from Sanity
 * @returns Validated portfolio data or null if validation fails
 */
export function validatePortfolioData(data: unknown) {
  return safeValidate(schemas.PortfolioDetail, data);
}

/**
 * Validates page data with comprehensive error handling
 *
 * @param data - Raw page data from Sanity
 * @returns Validated page data or null if validation fails
 */
export function validatePageData(data: unknown) {
  return safeValidate(schemas.PageDetail, data);
}

/**
 * Validates about data with comprehensive error handling
 *
 * @param data - Raw about data from Sanity
 * @returns Validated about data or null if validation fails
 */
export function validateAboutData(data: unknown) {
  return safeValidate(schemas.AboutData, data);
}

/**
 * Validates asset data with comprehensive error handling
 *
 * @param data - Raw asset data from Sanity
 * @param assetType - The type of asset to validate
 * @returns Validated asset data or null if validation fails
 */
export function validateAssetData(
  data: unknown,
  assetType: "svg" | "image" | "video" | "social",
) {
  switch (assetType) {
    case "svg":
      return safeValidate(schemas.SvgAsset, data);
    case "image":
      return safeValidate(schemas.ImageAsset, data);
    case "video":
      return safeValidate(schemas.VideoAsset, data);
    case "social":
      return safeValidate(schemas.SocialAsset, data);
    default:
      console.error(`Unknown asset type: ${assetType}`);
      return null;
  }
}

/**
 * Validates API response data with comprehensive error handling
 *
 * @param data - Raw API response data
 * @param dataSchema - Schema for the expected data structure
 * @returns Validated API response or null if validation fails
 */
export function validateApiResponse<T>(
  data: unknown,
  dataSchema: z.ZodSchema<T>,
) {
  const responseSchema = z.object({
    data: dataSchema.optional(),
    error: z.string().optional(),
  });

  const result = safeValidate(responseSchema, data);
  return result;
}

/**
 * Logs validation errors in a structured way for debugging
 *
 * @param context - Context where validation failed (e.g., "API Route", "Component")
 * @param errors - Zod validation errors
 * @param data - The data that failed validation
 */
export function logValidationErrors(
  context: string,
  errors: z.ZodError,
  data?: unknown,
) {
  console.group(`Validation Error in ${context}`);
  console.error("Validation Errors:", errors.errors);
  if (data) {
    console.error("Invalid Data:", data);
  }
  console.groupEnd();
}

// Re-export the MissingModule component for convenience
export { MissingModule };
