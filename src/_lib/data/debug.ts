import { createSanityClient, envConfig } from "@/_lib/config/sanity";

/**
 * Fetches debug data from Sanity on the server-side.
 * This function is used for development and debugging purposes to inspect
 * the structure of pageMeta documents and their associated sections.
 *
 * The GROQ query fetches all pageMeta documents with their basic information
 * and a preview of their section content structure.
 *
 * @returns {Promise<any[]>} Array of page metadata for debugging or empty array if fetch fails.
 */
export async function getDebugDataServer() {
  try {
    const client = createSanityClient();

    // This GROQ query fetches all pageMeta documents for debugging purposes.
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

    const pages = await client.fetch(query);
    return pages || [];
  } catch (error) {
    console.error("Error fetching debug data (server):", error);
    return [];
  }
}

/**
 * Fetches debug data via the API route on the client-side.
 * This is used for development and debugging purposes to inspect
 * page structure from the client side.
 *
 * @returns {Promise<any[]>} Array of page metadata for debugging or empty array if fetch fails.
 */
export async function getDebugDataClient() {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/pages`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching debug data (client):", error);
    return [];
  }
}

/**
 * Universal function that chooses the appropriate fetching method based on context.
 * This allows debug tools to use the same function regardless of whether they're
 * running on the server or client side.
 *
 * @param {boolean} isServer - Whether to use server-side fetching (default: false).
 * @returns {Promise<any[]>} Array of page metadata for debugging.
 */
export async function getDebugData(isServer: boolean = false) {
  if (isServer) {
    return getDebugDataServer();
  } else {
    return getDebugDataClient();
  }
}
