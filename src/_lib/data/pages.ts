import { createSanityClient, envConfig } from "@/_lib/config/sanity";

/**
 * Fetches page metadata from Sanity on the server-side.
 * This function retrieves basic information about all pages including their
 * titles, slugs, publication dates, and section references. It's used for
 * building navigation menus and page listings.
 *
 * The GROQ query resolves section references to get their titles and order,
 * and includes a preview of the content structure for each section.
 *
 * @returns {Promise<any[]>} Array of page metadata or empty array if fetch fails.
 */
export async function getPagesServer() {
  try {
    const client = createSanityClient();

    // This GROQ query fetches all pageMeta documents and resolves their section references.
    // It includes basic page info and a preview of the content structure for each section.
    const query = `*[_type == "pageMeta"]{
      _id,
      title,
      slug,
      publishedAt,
      locked,
      sections[]->{
        _id,
        title,
        order,
        content[] {
          _key,
          _type
        }
      }
    }`;

    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching pages (server):", error);
    return [];
  }
}

/**
 * Fetches page metadata via the API route on the client-side.
 * This is used in Client Components where we need to fetch page data
 * after the component mounts, such as for dynamic navigation menus.
 *
 * @returns {Promise<any[]>} Array of page metadata or empty array if fetch fails.
 */
export async function getPagesClient() {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/content/pages`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching pages (client):", error);
    return [];
  }
}

/**
 * Universal function that chooses the appropriate fetching method based on context.
 * This allows components to use the same function regardless of whether they're
 * running on the server or client side.
 *
 * @param {boolean} isServer - Whether to use server-side fetching (default: false).
 * @returns {Promise<any[]>} Array of page metadata.
 */
export async function getPages(isServer: boolean = false) {
  if (isServer) {
    return getPagesServer();
  } else {
    return getPagesClient();
  }
}
