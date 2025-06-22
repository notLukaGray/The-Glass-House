import { createSanityClient, envConfig } from "@/_lib/config/sanity";

/**
 * Interface for portfolio preview data used in lists and grids.
 * This contains only the essential information needed to display
 * a portfolio item in a collection view.
 */
interface PortfolioPreview {
  _id: string;
  title: { en: string };
  subhead: { en: string };
  slug: { current: string };
  coverAsset: { _ref: string };
  featured: boolean;
  locked: boolean;
  categories: Array<{ _id: string; title: { en: string } }>;
  tags: Array<{ _id: string; title: { en: string } }>;
}

/**
 * Interface for complete portfolio data including all sections and content.
 * This is used when displaying a full portfolio page and includes
 * all the dynamic content sections that make up the portfolio.
 */
interface ProjectMeta {
  _id: string;
  title: { en: string };
  subhead?: { en: string };
  colorTheme?: string;
  locked?: boolean;
  coverAsset?: { _ref: string };
  externalLink?: string;
  featured?: boolean;
  categories?: Array<{ _id: string; title: { en: string } }>;
  tags?: Array<{ _id: string; title: { en: string } }>;
  sections?: Array<{
    _key: string;
    _type: string;
    content?: unknown[];
    leftContent?: unknown[];
    rightContent?: unknown[];
    leftAsset?: { _ref: string };
    rightAsset?: { _ref: string };
    quote?: string;
    attribution?: string;
    faqs?: Array<{ _key: string; question: string; answer: string }>;
    title?: { en: string };
    items?: unknown[];
    icon?: { _ref: string };
    label?: string;
    style?: string;
    image?: { _ref: string };
    fullBleed?: boolean;
    showCaption?: boolean;
    images?: Array<{ _ref: string }>;
    layout?: string;
    video?: { _ref: string };
    autoplay?: boolean;
    loop?: boolean;
    asset?: { _ref: string };
    heading?: { en: string };
    description?: { en: string };
    steps?: Array<{ _key: string; date: string; description: string }>;
    color?: string;
    size?: string;
    backgroundColor?: string;
    buttons?: Array<{
      _key: string;
      label: string;
      icon?: string;
      style: string;
      url: string;
    }>;
    avatar?: { _ref: string };
    [key: string]: unknown;
  }>;
}

/**
 * Fetches a list of portfolio previews from Sanity on the server-side.
 * The query orders portfolios by featured status first, then by creation date,
 * and resolves category and tag references to get their titles.
 *
 * @returns {Promise<PortfolioPreview[]>} Array of portfolio previews or empty array if fetch fails.
 */
export async function getPortfoliosServer(): Promise<PortfolioPreview[]> {
  try {
    const client = createSanityClient();

    // This GROQ query fetches all portfolios, orders them by featured status and creation date,
    // and resolves the category and tag references to get their titles.
    const query = `*[_type == "portfolio"] | order(featured desc, _createdAt desc) {
      _id,
      title,
      subhead,
      slug,
      coverAsset,
      featured,
      locked,
      categories[]->{
        _id,
        title
      },
      tags[]->{
        _id,
        title
      }
    }`;

    const portfolios = await client.fetch<PortfolioPreview[]>(query);
    return portfolios || [];
  } catch (error) {
    console.error("Error fetching portfolios (server):", error);
    return [];
  }
}

/**
 * Fetches a complete portfolio by its slug from Sanity on the server-side.
 * This includes all the dynamic content sections that make up the portfolio page.
 * The sections array contains various content types like text, images, videos, etc.
 *
 * @param {string} slug - The portfolio's slug identifier.
 * @returns {Promise<ProjectMeta | null>} The complete portfolio data or null if not found.
 */
export async function getPortfolioServer(
  slug: string,
): Promise<ProjectMeta | null> {
  try {
    const client = createSanityClient();

    // This GROQ query fetches a single portfolio by slug and includes all its sections.
    // Each section can have different content types (text, images, videos, etc.)
    // which is why the sections array has many optional fields.
    const query = `*[_type == "portfolio" && slug.current == $slug][0] {
      _id,
      title,
      subhead,
      colorTheme,
      locked,
      coverAsset,
      externalLink,
      featured,
      categories[]->{
        _id,
        title
      },
      tags[]->{
        _id,
        title
      },
      sections[] {
        _key,
        _type,
        content,
        leftContent,
        rightContent,
        leftAsset,
        rightAsset,
        quote,
        attribution,
        faqs,
        title,
        items,
        icon,
        label,
        style,
        image,
        fullBleed,
        showCaption,
        images,
        layout,
        video,
        autoplay,
        loop,
        asset,
        heading,
        description,
        steps,
        color,
        size,
        backgroundColor,
        buttons,
        avatar
      }
    }`;

    const portfolio = await client.fetch<ProjectMeta>(query, { slug });

    if (!portfolio) {
      console.warn(`Portfolio not found for slug: ${slug}`);
      return null;
    }

    return portfolio;
  } catch (error) {
    console.error("Error fetching portfolio (server):", error);
    return null;
  }
}

/**
 * Fetches a list of portfolio previews via the API route on the client-side.
 * This is used in Client Components where we need to fetch data after the component mounts.
 *
 * @returns {Promise<PortfolioPreview[]>} Array of portfolio previews or empty array if fetch fails.
 */
export async function getPortfoliosClient(): Promise<PortfolioPreview[]> {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/content/portfolios`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching portfolios (client):", error);
    return [];
  }
}

/**
 * Fetches a complete portfolio by its slug via the API route on the client-side.
 * Uses 'no-store' cache option to ensure fresh data on each request.
 *
 * @param {string} slug - The portfolio's slug identifier.
 * @returns {Promise<ProjectMeta | null>} The complete portfolio data or null if not found.
 */
export async function getPortfolioClient(
  slug: string,
): Promise<ProjectMeta | null> {
  try {
    const response = await fetch(
      `${envConfig.baseUrl}/api/content/portfolio/${slug}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching portfolio (client):", error);
    return null;
  }
}

/**
 * Universal function to fetch portfolio list data.
 * Chooses between server-side and client-side fetching based on the context.
 *
 * @param {boolean} isServer - Whether to use server-side fetching (default: false).
 * @returns {Promise<PortfolioPreview[]>} Array of portfolio previews.
 */
export async function getPortfolios(
  isServer: boolean = false,
): Promise<PortfolioPreview[]> {
  if (isServer) {
    return getPortfoliosServer();
  } else {
    return getPortfoliosClient();
  }
}

/**
 * Universal function to fetch individual portfolio data.
 * Chooses between server-side and client-side fetching based on the context.
 *
 * @param {string} slug - The portfolio's slug identifier.
 * @param {boolean} isServer - Whether to use server-side fetching (default: false).
 * @returns {Promise<ProjectMeta | null>} The complete portfolio data or null if not found.
 */
export async function getPortfolio(
  slug: string,
  isServer: boolean = false,
): Promise<ProjectMeta | null> {
  if (isServer) {
    return getPortfolioServer(slug);
  } else {
    return getPortfolioClient(slug);
  }
}
