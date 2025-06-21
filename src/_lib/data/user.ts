import { createSanityClient, envConfig } from '@/_lib/config/sanity';

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

// Server-side user data fetching
export async function getUserDataServer(): Promise<UserData | null> {
  try {
    const client = createSanityClient();
    
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
      console.warn('User data not found');
      return null;
    }
    
    return userData;
  } catch (error) {
    console.error('Error fetching user data (server):', error);
    return null;
  }
}

// Client-side user data fetching
export async function getUserDataClient(): Promise<UserData | null> {
  try {
    const response = await fetch(`${envConfig.baseUrl}/api/user`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data (client):', error);
    return null;
  }
}

// Universal function
export async function getUserData(isServer: boolean = false): Promise<UserData | null> {
  if (isServer) {
    return getUserDataServer();
  } else {
    return getUserDataClient();
  }
} 