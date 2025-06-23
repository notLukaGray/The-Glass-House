import { createClient, type SanityClient } from "next-sanity";

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

export const sanitizeSanityResponse = <T>(data: T): T => {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    return data.replace(/[\u200B-\u200D\uFEFF]/g, "") as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeSanityResponse(item)) as T;
  }

  if (typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      sanitized[key] = sanitizeSanityResponse(value);
    }
    return sanitized as T;
  }

  return data;
};

const baseClient = createClient({
  ...validateSanityConfig(),
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  stega: {
    enabled: process.env.NODE_ENV === "development",
    studioUrl: "/studio",
  },
});

const baseClientBuild = createClient({
  ...validateSanityConfig(),
  useCdn: false,
  perspective: "published",
  stega: {
    enabled: process.env.NODE_ENV === "development",
    studioUrl: "/studio",
  },
});

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
