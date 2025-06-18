import { createClient, SanityClient } from 'next-sanity';

// Utility function to remove zero-width spaces and sanitize Sanity responses
const sanitizeSanityResponse = (data: any): any => {
  if (data === null || data === undefined) return data;
  
  if (typeof data === 'string') {
    return data.replace(/[\u200B-\u200D\uFEFF]/g, '');
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeSanityResponse(item));
  }
  
  if (typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeSanityResponse(value);
    }
    return sanitized;
  }
  
  return data;
};

// Create the base Sanity client
const getSanityEnv = (key: string) => {
  if (typeof window !== 'undefined') {
    // Client-side: use NEXT_PUBLIC_ variables
    return process.env[`NEXT_PUBLIC_${key}`] || '';
  }
  // Server-side: use regular variables
  return process.env[key] || '';
};

const baseClient = createClient({
  projectId: getSanityEnv('SANITY_PROJECT_ID'),
  dataset: getSanityEnv('SANITY_DATASET'),
  apiVersion: getSanityEnv('SANITY_API_VERSION'),
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
});

// Create a wrapper that automatically sanitizes responses
const client = Object.create(baseClient, {
  fetch: {
    value: async <T = any>(query: string, params?: Record<string, any>): Promise<T> => {
      const result = await baseClient.fetch(query, params);
      return sanitizeSanityResponse(result);
    },
    writable: true,
    configurable: true,
  },
  listen: {
    value: <T = any>(query: string, params?: Record<string, any>) => {
      const observable = baseClient.listen(query, params);
      return {
        ...observable,
        subscribe: (observer: any) => {
          return observable.subscribe({
            ...observer,
            next: (value: any) => {
              observer.next?.(sanitizeSanityResponse(value));
            },
          });
        },
      };
    },
    writable: true,
    configurable: true,
  },
});

export { client }; 