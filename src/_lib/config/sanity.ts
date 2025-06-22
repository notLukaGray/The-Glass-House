import { createClient, type ClientPerspective } from "next-sanity";

/**
 * Centralized configuration for the Sanity client.
 *
 * This object holds all the necessary details to connect to the Sanity project.
 * Using a centralized config ensures that all parts of the application
 * use the same connection settings.
 */
export const sanityConfig = {
  // Your Sanity project's unique identifier.
  projectId: process.env.SANITY_PROJECT_ID || "",

  // The dataset to connect to (e.g., 'production', 'development').
  dataset: process.env.SANITY_DATASET || "",

  // The API version to use. A specific date ensures that your queries
  // won't break if Sanity updates their API.
  apiVersion: process.env.SANITY_API_VERSION || "",

  // `useCdn: true` is recommended in production for faster response times.
  // The CDN serves cached content, which is perfect for public-facing sites.
  // In development, we set this to `false` to always get the freshest data.
  useCdn: process.env.NODE_ENV === "production",

  // The 'perspective' determines how the data is viewed.
  // 'published' ensures that only documents that have been published are returned.
  // Other options include 'raw' (for drafts) and 'previewDrafts' (for previews).
  perspective: "published" as ClientPerspective,
};

/**
 * A factory function to create a new Sanity client instance.
 * While not strictly necessary to wrap `createClient`, this function can be
 * expanded in the future to create clients with different configurations,
 * such as a 'raw' perspective client for draft content.
 *
 * @returns A new Sanity client instance configured with `sanityConfig`.
 */
export const createSanityClient = () => {
  return createClient(sanityConfig);
};

/**
 * A centralized object for environment-specific variables.
 * This helps to avoid scattering `process.env` calls throughout the codebase.
 */
export const envConfig = {
  // The base URL of the application, used for constructing absolute URLs (e.g., for SEO).
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",

  // Simple boolean flags for checking the current environment.
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};
