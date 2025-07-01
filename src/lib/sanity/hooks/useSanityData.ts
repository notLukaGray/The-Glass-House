import { useState, useEffect, useCallback } from "react";
import { createClient } from "@sanity/client";

// Create a singleton client instance for client-side requests
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false, // Set to true for production
});

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface UseSanityDataOptions {
  query: string;
  params?: Record<string, unknown>;
  cacheKey?: string;
  cacheDuration?: number;
  enabled?: boolean;
}

export interface UseSanityDataResult<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSanityData<T = unknown>({
  query,
  params = {},
  cacheKey,
  cacheDuration = CACHE_DURATION,
  enabled = true,
}: UseSanityDataOptions): UseSanityDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKeyFinal = cacheKey || `${query}-${JSON.stringify(params)}`;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    // Check cache first
    const cached = cache.get(cacheKeyFinal);
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      setData(cached.data as T);
      setLoading(false);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await client.fetch<T>(query, params);
      // Cache the result
      cache.set(cacheKeyFinal, {
        data: result,
        timestamp: Date.now(),
      });
      setData(result);
    } catch (err) {
      console.error("Error fetching Sanity data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [query, params, cacheKeyFinal, cacheDuration, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Specialized hooks for common queries

export function useModule(moduleId: string) {
  return useSanityData<Record<string, unknown>>({
    query: `*[_type == "moduleHeroImage" && _id == $moduleId][0] {
      _id,
      _type,
      title,
      description,
      layout,
      behavior,
      theme,
      headline {
        _ref,
        _type,
        title,
        content,
        usage
      },
      backgroundImage {
        _ref,
        _type,
        title,
        altText,
        image,
        usage
      },
      ctaButton {
        _ref,
        _type,
        title,
        text,
        variant,
        size,
        url,
        usage
      }
    }`,
    params: { moduleId },
    cacheKey: `module-${moduleId}`,
  });
}

export function useElement(elementId: string) {
  return useSanityData<Record<string, unknown>>({
    query: `*[_id == $elementId][0]`,
    params: { elementId },
    cacheKey: `element-${elementId}`,
  });
}

export function useFoundationSettings() {
  return useSanityData<{
    localization: Record<string, unknown>;
    behavior: Record<string, unknown>;
  }>({
    query: `{
      "localization": *[_type == "foundationLocalization"][0] {
        additionalLanguages,
        defaultLanguage,
        fallbackLanguage
      },
      "behavior": *[_type == "foundationBehavior"][0] {
        scrollBehaviors[] {
          name,
          title,
          enabled
        }
      }
    }`,
    cacheKey: "foundation-settings",
    cacheDuration: 10 * 60 * 1000, // 10 minutes for foundation settings
  });
}

export function usePageModules(pageId: string) {
  return useSanityData<Record<string, unknown>>({
    query: `*[_type == "page" && _id == $pageId][0] {
      _id,
      title,
      modules[] {
        _key,
        _ref,
        _type
      }
    }`,
    params: { pageId },
    cacheKey: `page-modules-${pageId}`,
  });
}

export function clearSanityCache(pattern?: string) {
  if (pattern) {
    // Clear specific cache entries
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    // Clear all cache
    cache.clear();
  }
}
