import { createClient, type ClientPerspective } from 'next-sanity';

// Centralized Sanity configuration
export const sanityConfig = {
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || '',
  apiVersion: process.env.SANITY_API_VERSION || '',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published' as ClientPerspective,
};

// Create Sanity client with consistent configuration
export const createSanityClient = () => {
  return createClient(sanityConfig);
};

// Environment configuration
export const envConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}; 