import { createSanityClient, envConfig } from '@/_lib/config/sanity';

// Server-side data fetching (direct Sanity client)
export async function getPagesServer() {
  try {
    const client = createSanityClient();
    
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
    console.error('Error fetching pages (server):', error);
    return [];
  }
}

// Client-side data fetching (via API route)
export async function getPagesClient() {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/content/pages`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching pages (client):', error);
    return [];
  }
}

// Universal function that chooses the right method
export async function getPages(isServer: boolean = false) {
  if (isServer) {
    return getPagesServer();
  } else {
    return getPagesClient();
  }
} 