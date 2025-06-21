import { createSanityClient, envConfig } from '@/_lib/config/sanity';

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
    buttons?: Array<{ _key: string; label: string; icon?: string; style: string; url: string }>;
    avatar?: { _ref: string };
    [key: string]: unknown;
  }>;
}

// Server-side portfolio list fetching
export async function getPortfoliosServer(): Promise<PortfolioPreview[]> {
  try {
    const client = createSanityClient();
    
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
    console.error('Error fetching portfolios (server):', error);
    return [];
  }
}

// Server-side individual portfolio fetching
export async function getPortfolioServer(slug: string): Promise<ProjectMeta | null> {
  try {
    const client = createSanityClient();
    
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
    console.error('Error fetching portfolio (server):', error);
    return null;
  }
}

// Client-side portfolio list fetching
export async function getPortfoliosClient(): Promise<PortfolioPreview[]> {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/content/portfolios`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolios (client):', error);
    return [];
  }
}

// Client-side individual portfolio fetching
export async function getPortfolioClient(slug: string): Promise<ProjectMeta | null> {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/content/portfolio/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio (client):', error);
    return null;
  }
}

// Universal functions
export async function getPortfolios(isServer: boolean = false): Promise<PortfolioPreview[]> {
  if (isServer) {
    return getPortfoliosServer();
  } else {
    return getPortfoliosClient();
  }
}

export async function getPortfolio(slug: string, isServer: boolean = false): Promise<ProjectMeta | null> {
  if (isServer) {
    return getPortfolioServer(slug);
  } else {
    return getPortfolioClient(slug);
  }
} 