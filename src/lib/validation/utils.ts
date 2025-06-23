import { z } from "zod";
import { schemas } from "./schemas";
import { MissingModule } from "@/components/validation/MissingModule";

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
      return {
        success: false,
        errors: error,
        fallback,
      };
    }
    return {
      success: false,
      fallback,
    };
  }
}

export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): T | null {
  try {
    return schema.parse(data);
  } catch {
    return null;
  }
}

export function validateWithFallback<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  fallback: T,
): T {
  try {
    return schema.parse(data);
  } catch {
    return fallback;
  }
}

export function validateSettings(data: unknown) {
  return safeValidate(schemas.settings.Settings, data);
}

export function validateUserData(data: unknown) {
  return safeValidate(schemas.data.User, data);
}

export function validatePortfolioData(data: unknown) {
  return safeValidate(schemas.data.Portfolio, data);
}

export function validatePageData(data: unknown) {
  return safeValidate(schemas.data.Page, data);
}

export function validateAboutData(data: unknown) {
  return safeValidate(schemas.data.AboutPage, data);
}

export function validateAssetData(data: unknown) {
  // Only Asset schema exists, no specific svg/image/video/social asset schemas
  return safeValidate(schemas.asset.Asset, data);
}

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

export function logValidationErrors() {
  return;
}

// Re-export the MissingModule component for convenience
export { MissingModule };
