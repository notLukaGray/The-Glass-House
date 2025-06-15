import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || '',
  apiVersion: process.env.SANITY_API_VERSION || '',
  useCdn: process.env.NODE_ENV === 'production', // Only use CDN in production
  perspective: 'published', // Always fetch published content
  stega: {
    enabled: process.env.NODE_ENV === 'development', // Enable real-time preview in development
    studioUrl: '/studio',
  },
}); 