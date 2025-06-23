import { createClient, type SanityClient } from "next-sanity";
import { getSanityConfig } from "@/lib/env";

// Create Sanity clients with validated configuration
const baseClient = createClient({
  projectId: getSanityConfig().projectId,
  dataset: getSanityConfig().dataset,
  apiVersion: getSanityConfig().apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  stega: {
    enabled: process.env.NODE_ENV === "development",
    studioUrl: "/studio",
  },
});

const baseClientBuild = createClient({
  projectId: getSanityConfig().projectId,
  dataset: getSanityConfig().dataset,
  apiVersion: getSanityConfig().apiVersion,
  useCdn: false,
  perspective: "published",
  stega: {
    enabled: process.env.NODE_ENV === "development",
    studioUrl: "/studio",
  },
});

// Sanitize Sanity response to prevent XSS
function sanitizeSanityResponse<T>(data: T): T {
  if (typeof data === "string") {
    return data.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      "",
    ) as T;
  }

  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      return data.map(sanitizeSanityResponse) as T;
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeSanityResponse(value);
    }
    return sanitized as T;
  }

  return data;
}

const client = {
  ...baseClient,
  fetch: async <T>(
    query: string,
    params?: Record<string, unknown>,
  ): Promise<T> => {
    const result = await (
      baseClient.fetch as (
        query: string,
        params?: Record<string, unknown>,
      ) => Promise<T>
    )(query, params);
    return sanitizeSanityResponse(result);
  },
} as SanityClient;

const clientBuild = {
  ...baseClientBuild,
  fetch: async <T>(
    query: string,
    params?: Record<string, unknown>,
  ): Promise<T> => {
    const result = await (
      baseClientBuild.fetch as (
        query: string,
        params?: Record<string, unknown>,
      ) => Promise<T>
    )(query, params);
    return sanitizeSanityResponse(result);
  },
} as SanityClient;

export { client, clientBuild };
