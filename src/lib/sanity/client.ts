import { createClient } from "next-sanity";

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
 * Creates a Sanity client with validated configuration.
 * This function ensures all required environment variables are present
 * before creating the client, preventing runtime errors.
 */
function createSanityClient(useCdn: boolean = false) {
  const config = validateSanityConfig();

  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn,
    perspective: "published",
  });
}

/**
 * Shared Sanity client configuration for API routes.
 *
 * This centralized client ensures consistent configuration across all
 * API routes and provides a single place to manage Sanity connection
 * settings. The client is configured with:
 * - CDN enabled in production for better performance
 * - "published" perspective to ensure only published content is fetched
 * - Proper environment variable handling with validation
 */
export const sanityClient = createSanityClient(
  process.env.NODE_ENV === "production",
);

/**
 * Sanity client for build-time operations.
 *
 * This client is specifically configured for build-time data fetching
 * where we want to ensure we get the latest data and don't rely on CDN.
 */
export const sanityClientBuild = createSanityClient(false);
