import { createClient, type SanityClient } from "next-sanity";

/**
 * Validates that required Sanity environment variables are present.
 * Throws an error if any required variables are missing.
 */
function validateSanityConfig() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const apiVersion = process.env.SANITY_API_VERSION;

  if (!projectId) {
    throw new Error("SANITY_PROJECT_ID environment variable is required");
  }
  if (!dataset) {
    throw new Error("SANITY_DATASET environment variable is required");
  }
  if (!apiVersion) {
    throw new Error("SANITY_API_VERSION environment variable is required");
  }

  return { projectId, dataset, apiVersion };
}

/**
 * A recursive utility function to sanitize data returned from Sanity.
 * It's designed to remove zero-width spaces (\u200B) and other non-printing characters
 * that can sometimes be present in CMS content and cause subtle rendering issues.
 *
 * @param data The data to sanitize (can be any type).
 * @returns The sanitized data.
 */
export const sanitizeSanityResponse = <T>(data: T): T => {
  if (data === null || data === undefined) return data;

  // If it's a string, remove the problematic characters.
  if (typeof data === "string") {
    return data.replace(/[\u200B-\u200D\uFEFF]/g, "") as T;
  }

  // If it's an array, sanitize each item recursively.
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeSanityResponse(item)) as T;
  }

  // If it's an object, sanitize each value recursively.
  if (typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      sanitized[key] = sanitizeSanityResponse(value);
    }
    return sanitized as T;
  }

  // Return primitives and other types as-is.
  return data;
};

/**
 * The base Sanity client instance.
 * It's configured using environment variables to connect to the correct project and dataset.
 * It also enables Stega for Visual Editing in development, which overlays Sanity Studio
 * content previews on the live site.
 */
const baseClient = createClient({
  ...validateSanityConfig(),
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  stega: {
    enabled: process.env.NODE_ENV === "development",
    studioUrl: "/studio",
  },
});

/**
 * A custom-wrapped Sanity client that automatically sanitizes fetched data.
 *
 * This wrapper overrides the `fetch` method of the base client to automatically
 * sanitize the data before it's returned to the application. This ensures that
 * all data fetched through this client is cleaned of unwanted characters without
 * needing to call `sanitizeSanityResponse` manually everywhere.
 *
 * Note: The `listen` method is left unchanged to avoid complex TypeScript issues
 * with Observable wrapping. Real-time updates will not be automatically sanitized.
 */
const client = {
  ...baseClient,
  fetch: async <T>(
    query: string,
    params?: Record<string, unknown>,
  ): Promise<T> => {
    // Call the original fetch from the base client.
    const result = await (
      baseClient.fetch as (
        query: string,
        params?: Record<string, unknown>,
      ) => Promise<T>
    )(query, params);
    // Sanitize the result before returning it.
    return sanitizeSanityResponse(result);
  },
} as SanityClient;

export { client };
