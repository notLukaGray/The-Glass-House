import { createSanityClient, envConfig } from "@/_lib/config/sanity";

/**
 * Interface for user profile data including personal information and social links.
 * This represents the main user/author profile that appears throughout the site,
 * including their name, job title, avatar, bio, and social media links.
 */
interface UserData {
  _id: string;
  name: { en: string };
  jobTitle?: { en: string };
  avatar?: { _ref: string };
  bio?: unknown[];
  social?: Array<{
    _id: string;
    name: string;
    url: string;
    icon?: {
      _id: string;
      svgData: string;
    };
  }>;
}

/**
 * Fetches user profile data from Sanity on the server-side.
 * This function retrieves the single user document which contains personal
 * information, bio content, and social media links with their associated icons.
 *
 * The GROQ query resolves social media references to get their names, URLs,
 * and icon SVG data for rendering.
 *
 * @returns {Promise<UserData | null>} The user profile data or null if not found or fetch fails.
 */
export async function getUserDataServer(): Promise<UserData | null> {
  try {
    const client = createSanityClient();

    // This GROQ query fetches the single user document and resolves social media references.
    // For each social link, it gets the icon's SVG data for rendering the social media icons.
    const query = `*[_type == "user"][0]{
      _id,
      name,
      jobTitle,
      avatar,
      bio,
      social[]->{
        _id,
        name,
        url,
        icon->{
          _id,
          svgData
        }
      }
    }`;

    const userData = await client.fetch<UserData>(query);

    if (!userData) {
      console.warn("User data not found");
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Error fetching user data (server):", error);
    return null;
  }
}

/**
 * Fetches user profile data via the API route on the client-side.
 * Uses 'no-store' cache option to ensure fresh data on each request,
 * which is important for user profile information that might be updated.
 *
 * @returns {Promise<UserData | null>} The user profile data or null if fetch fails.
 */
export async function getUserDataClient(): Promise<UserData | null> {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/user`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user data (client):", error);
    return null;
  }
}

/**
 * Universal function that chooses the appropriate fetching method based on context.
 * This allows components to use the same function regardless of whether they're
 * running on the server or client side.
 *
 * @param {boolean} isServer - Whether to use server-side fetching (default: false).
 * @returns {Promise<UserData | null>} The user profile data or null if not found.
 */
export async function getUserData(
  isServer: boolean = false,
): Promise<UserData | null> {
  if (isServer) {
    return getUserDataServer();
  } else {
    return getUserDataClient();
  }
}
