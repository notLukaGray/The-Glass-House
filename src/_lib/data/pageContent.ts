import { createSanityClient, envConfig } from '@/_lib/config/sanity';

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

// Server-side page content fetching (direct Sanity client)
export async function getPageContentServer(slug: string): Promise<PageMeta | null> {
  try {
    const client = createSanityClient();
    
    let query: string;
    
    if (slug === 'test') {
      // For test page, get the first pageMeta document with resolved sections
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
      // For regular pages, get by slug
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
    console.error('Error fetching page content (server):', error);
    return null;
  }
}

// Client-side page content fetching (via API route)
export async function getPageContentClient(slug: string): Promise<PageMeta | null> {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/content/page/${slug}`, {
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
    console.error('Error fetching page content (client):', error);
    return null;
  }
}

// Universal function that chooses the right method
export async function getPageContent(slug: string, isServer: boolean = false): Promise<PageMeta | null> {
  if (isServer) {
    return getPageContentServer(slug);
  } else {
    return getPageContentClient(slug);
  }
} 