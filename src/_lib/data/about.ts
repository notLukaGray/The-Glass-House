import { createSanityClient, envConfig } from '@/_lib/config/sanity';

// Server-side about data fetching (direct Sanity client)
export async function getAboutDataServer() {
  try {
    const client = createSanityClient();
    
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
      console.warn('About data not found');
      return null;
    }
    
    return aboutData;
  } catch (error) {
    console.error('Error fetching about data (server):', error);
    return null;
  }
}

// Client-side about data fetching (via API route)
export async function getAboutDataClient() {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/content/about`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching about data (client):', error);
    return null;
  }
}

// Universal function that chooses the right method
export async function getAboutData(isServer: boolean = false) {
  if (isServer) {
    return getAboutDataServer();
  } else {
    return getAboutDataClient();
  }
} 