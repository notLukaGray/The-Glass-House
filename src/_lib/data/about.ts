import { createSanityClient, envConfig } from "@/_lib/config/sanity";

/**
 * Fetches about page data from Sanity on the server-side.
 * This function retrieves the single about document which contains user information
 * and various sections with items that can include icons and logos.
 *
 * The GROQ query uses the spread operator (...) to include all fields from sections
 * and items, while specifically resolving icon and logo references to get their
 * SVG data and colors.
 *
 * @returns {Promise<any>} The about page data or null if not found or fetch fails.
 */
export async function getAboutDataServer() {
  try {
    const client = createSanityClient();

    // This GROQ query fetches the single about document and includes all its sections.
    // For each item in the sections, it resolves icon and logo references to get
    // their SVG data and colors for rendering.
    const query = `*[_type == "about"][0]{
      user,
      sections[]{
        ...,
        items[]{
          ...,
          icon->{
            _id,
            svgData,
            color
          },
          logo->{
            _id,
            svgData,
            color
          }
        }
      }
    }`;

    const aboutData = await client.fetch(query);

    if (!aboutData) {
      console.warn("About data not found");
      return null;
    }

    return aboutData;
  } catch (error) {
    console.error("Error fetching about data (server):", error);
    return null;
  }
}

/**
 * Fetches about page data via the API route on the client-side.
 * Uses 'no-store' cache option to ensure fresh data on each request,
 * which is important for about page content that might be updated frequently.
 *
 * @returns {Promise<any>} The about page data or null if fetch fails.
 */
export async function getAboutDataClient() {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/content/about`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching about data (client):", error);
    return null;
  }
}

/**
 * Universal function that chooses the appropriate fetching method based on context.
 * This allows components to use the same function regardless of whether they're
 * running on the server or client side.
 *
 * @param {boolean} isServer - Whether to use server-side fetching (default: false).
 * @returns {Promise<any>} The about page data or null if not found.
 */
export async function getAboutData(isServer: boolean = false) {
  if (isServer) {
    return getAboutDataServer();
  } else {
    return getAboutDataClient();
  }
}
