import { createClient, SanityClient } from 'next-sanity';
import type { MutationEvent } from '@sanity/client';

// Utility function to remove zero-width spaces and sanitize Sanity responses
const sanitizeSanityResponse = <T>(data: T): T => {
  if (data === null || data === undefined) return data;
  
  if (typeof data === 'string') {
    return data.replace(/[\u200B-\u200D\uFEFF]/g, '') as T;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeSanityResponse(item)) as T;
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      sanitized[key] = sanitizeSanityResponse(value);
    }
    return sanitized as T;
  }
  
  return data;
};

// Create the base Sanity client
const baseClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || '',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
});

// Type for the observer in listen method
interface SanityObserver {
  next?: (value: MutationEvent<Record<string, unknown>>) => void;
  error?: (error: Error) => void;
  complete?: () => void;
}

// Create a properly typed client wrapper
const client: SanityClient = {
  ...baseClient,
  fetch: async <T = unknown>(query: string, params?: Record<string, unknown>): Promise<T> => {
    const result = await baseClient.fetch(query, params);
    return sanitizeSanityResponse(result);
  },
  listen: (query: string, params?: Record<string, unknown>) => {
    const observable = baseClient.listen(query, params);
    return {
      ...observable,
      subscribe: (observer: SanityObserver) => {
        return observable.subscribe({
          ...observer,
          next: (value: MutationEvent<Record<string, unknown>>) => {
            observer.next?.(sanitizeSanityResponse(value));
          },
        });
      },
    };
  },
} as SanityClient;

export { client }; 