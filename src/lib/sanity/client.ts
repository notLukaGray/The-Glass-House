import { createClient } from "next-sanity";

/**
 * Shared Sanity client configuration for API routes.
 *
 * This centralized client ensures consistent configuration across all
 * API routes and provides a single place to manage Sanity connection
 * settings. The client is configured with:
 * - CDN enabled in production for better performance
 * - "published" perspective to ensure only published content is fetched
 * - Proper environment variable handling with fallbacks
 */
export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "",
  apiVersion: process.env.SANITY_API_VERSION || "",
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

/**
 * Sanity client for build-time operations.
 *
 * This client is specifically configured for build-time data fetching
 * where we want to ensure we get the latest data and don't rely on CDN.
 */
export const sanityClientBuild = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "",
  apiVersion: process.env.SANITY_API_VERSION || "",
  useCdn: false, // Disable CDN for build-time to ensure fresh data
  perspective: "published",
});
