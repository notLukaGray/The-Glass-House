import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

// In-memory rate limiter with LRU cache for development
// In production, consider using Redis for distributed rate limiting
class RateLimiter {
  private cache = new Map<string, { count: number; resetTime: number }>();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 120) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  private getKey(request: NextRequest): string {
    // Use IP address as the key
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0] : realIp || "unknown";
    return `rate_limit:${ip}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.resetTime) {
        this.cache.delete(key);
      }
    }
  }

  isRateLimited(request: NextRequest): boolean {
    this.cleanup();

    const key = this.getKey(request);
    const now = Date.now();

    const current = this.cache.get(key);

    if (!current || now > current.resetTime) {
      // First request or window expired
      this.cache.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return false;
    }

    if (current.count >= this.maxRequests) {
      return true;
    }

    // Increment count
    current.count++;
    this.cache.set(key, current);
    return false;
  }

  getRemainingRequests(request: NextRequest): number {
    const key = this.getKey(request);
    const current = this.cache.get(key);

    if (!current) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - current.count);
  }

  getResetTime(request: NextRequest): number {
    const key = this.getKey(request);
    const current = this.cache.get(key);

    return current?.resetTime || Date.now() + this.windowMs;
  }
}

// Liberal rate limiter: 120 requests per minute (2 per second average)
const publicRateLimiter = new RateLimiter(60000, 120);

export async function checkRateLimit(request: NextRequest): Promise<{
  isLimited: boolean;
  remaining: number;
  resetTime: number;
}> {
  // Skip rate limiting for admin users
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token?.role === "admin") {
    return {
      isLimited: false,
      remaining: Infinity,
      resetTime: Date.now(),
    };
  }

  const isLimited = publicRateLimiter.isRateLimited(request);
  const remaining = publicRateLimiter.getRemainingRequests(request);
  const resetTime = publicRateLimiter.getResetTime(request);

  return { isLimited, remaining, resetTime };
}

export function createRateLimitHeaders(remaining: number, resetTime: number) {
  return {
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": new Date(resetTime).toISOString(),
    "X-RateLimit-Limit": "120",
  };
}
