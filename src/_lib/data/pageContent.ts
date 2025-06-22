import { createSanityClient, envConfig } from "@/_lib/config/sanity";

/**
 * Interface for page content data including metadata and dynamic sections.
 * This represents a complete page with its title, subtitle, and an array of
 * content sections that can contain various media types (images, videos, icons, etc.).
 */
interface PageMeta {
  _id: string;
  title?: { en: string };
  subhead?: { en: string };
  sections?: Array<{
    _id: string;
    order: number;
    content: Array<{
      _key: string;
      _type: string;
      image?: { _ref: string };
      video?: { _ref: string };
      icon?: { _ref: string };
      avatar?: { _ref: string };
      [key: string]: unknown;
    }>;
  }>;
}

/**
 * Fetches complete page content from Sanity on the server-side.
 * This function handles both regular pages (fetched by slug) and a special
 * "test" page that always fetches the first pageMeta document.
 *
 * The GROQ query resolves section references to get their content arrays,
 * which can contain various media types and content blocks.
 *
 * @param {string} slug - The page's slug identifier, or "test" for the test page.
 * @returns {Promise<PageMeta | null>} The complete page content or null if not found.
 */
export async function getPageContentServer(
  slug: string,
): Promise<PageMeta | null> {
  try {
    const client = createSanityClient();

    let query: string;

    if (slug === "test") {
      // Special case for the test page: always fetch the first pageMeta document
      // This is useful for development and testing purposes.
      query = `*[_type == "pageMeta"][0]{
        _id,
        title,
        subhead,
        sections[]->{
          _id,
          order,
          content[] {
            ...,
            image,
            video,
            icon,
            avatar
          }
        }
      }`;
    } else {
      // Regular pages: fetch by slug and resolve section references
      query = `*[_type == "pageMeta" && slug.current == $slug][0]{
        _id,
        title,
        subhead,
        sections[]->{
          _id,
          order,
          content[] {
            ...,
            image,
            video,
            icon,
            avatar
          }
        }
      }`;
    }

    const pageData = await client.fetch<PageMeta>(query, { slug });

    if (!pageData) {
      console.warn(`Page not found for slug: ${slug}`);
      return null;
    }

    return pageData;
  } catch (error) {
    console.error("Error fetching page content (server):", error);
    return null;
  }
}

/**
 * Fetches page content via the API route on the client-side.
 * Uses 'no-store' cache option to ensure fresh content on each request.
 * Handles 404 responses gracefully by returning null instead of throwing an error.
 *
 * @param {string} slug - The page's slug identifier.
 * @returns {Promise<PageMeta | null>} The complete page content or null if not found.
 */
export async function getPageContentClient(
  slug: string,
): Promise<PageMeta | null> {
  try {
    const response = await fetch(
      `${envConfig.baseUrl}/api/content/page/${slug}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching page content (client):", error);
    return null;
  }
}

/**
 * Universal function that chooses the appropriate fetching method based on context.
 * This allows components to use the same function regardless of whether they're
 * running on the server or client side.
 *
 * @param {string} slug - The page's slug identifier.
 * @param {boolean} isServer - Whether to use server-side fetching (default: false).
 * @returns {Promise<PageMeta | null>} The complete page content or null if not found.
 */
export async function getPageContent(
  slug: string,
  isServer: boolean = false,
): Promise<PageMeta | null> {
  if (isServer) {
    return getPageContentServer(slug);
  } else {
    return getPageContentClient(slug);
  }
}
