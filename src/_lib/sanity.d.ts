declare module '../../../lib/sanity' {
  import { SanityClient } from '@sanity/client';
  const client: SanityClient;
  export default client;
}

declare module '../../../lib/sanityImage' {
  import { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
  import { SanityImageSource } from '@sanity/image-url/lib/types/types';

  export function urlFor(source: SanityImageSource): ImageUrlBuilder;
}

declare module 'next-sanity' {
  export function createClient(config: {
    projectId: string;
    dataset: string;
    apiVersion: string;
    token?: string;
    useCdn?: boolean;
  }): {
    fetch: <T>(query: string, params?: Record<string, any>) => Promise<T>;
  };
} 