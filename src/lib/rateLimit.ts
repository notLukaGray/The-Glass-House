import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for rate limiting
// In production, consider using a more persistent solution
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: NextRequest) => string;
}

const defaultKeyGenerator = (req: NextRequest): string => {
  // Use IP address for rate limiting
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip;
};

export function createRateLimiter(config: RateLimitConfig) {
  const { maxRequests, windowMs, keyGenerator = defaultKeyGenerator } = config;

  return function rateLimit(req: NextRequest): NextResponse | null {
    const key = keyGenerator(req);
    const now = Date.now();

    // Get current rate limit data
    const current = rateLimitStore.get(key);

    if (!current || current.resetTime < now) {
      // First request or window expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null; // Allow request
    }

    if (current.count >= maxRequests) {
      // Rate limit exceeded
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil((current.resetTime - now) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil(
              (current.resetTime - now) / 1000,
            ).toString(),
            "X-RateLimit-Limit": maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(current.resetTime).toISOString(),
          },
        },
      );
    }

    // Increment count
    current.count++;
    rateLimitStore.set(key, current);

    // Add rate limit headers
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", maxRequests.toString());
    response.headers.set(
      "X-RateLimit-Remaining",
      (maxRequests - current.count).toString(),
    );
    response.headers.set(
      "X-RateLimit-Reset",
      new Date(current.resetTime).toISOString(),
    );

    return null; // Allow request
  };
}

// Pre-configured rate limiters for different use cases
export const apiRateLimiter = createRateLimiter({
  maxRequests: 100, // 100 requests
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export const authRateLimiter = createRateLimiter({
  maxRequests: 5, // 5 requests
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export const setupRateLimiter = createRateLimiter({
  maxRequests: 3, // 3 requests
  windowMs: 60 * 60 * 1000, // 1 hour
});

// Cleanup function to prevent memory leaks
export function cleanupRateLimitStore(maxAgeMs: number = 60 * 60 * 1000): void {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > maxAgeMs) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every hour
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 60 * 60 * 1000);
}
