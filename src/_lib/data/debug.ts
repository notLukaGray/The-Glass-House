import { createSanityClient, envConfig } from '@/_lib/config/sanity';

// Server-side debug data fetching
export async function getDebugDataServer() {
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
    
    const pages = await client.fetch(query);
    return pages || [];
  } catch (error) {
    console.error('Error fetching debug data (server):', error);
    return [];
  }
}

// Client-side debug data fetching
export async function getDebugDataClient() {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/pages`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching debug data (client):', error);
    return [];
  }
}

// Universal function
export async function getDebugData(isServer: boolean = false) {
  if (isServer) {
    return getDebugDataServer();
  } else {
    return getDebugDataClient();
  }
} 