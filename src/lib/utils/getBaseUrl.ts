/**
 * Utility function to determine the application's base URL.
 *
 * This function provides a centralized way to get the correct base URL
 * for the application across different environments. It follows a specific
 * priority order to ensure the most appropriate URL is returned:
 *
 * 1. VERCEL_URL (automatically set by Vercel deployment)
 * 2. NEXT_PUBLIC_BASE_URL (manually configured environment variable)
 * 3. Localhost fallback (for development)
 *
 * This is particularly useful for:
 * - Generating absolute URLs for API endpoints
 * - Creating canonical links for SEO
 * - Building redirect URLs for authentication flows
 * - Ensuring consistent URL generation across the application
 *
 * @returns {string} The base URL for the current environment.
 */
export function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  return "http://localhost:3000";
}
