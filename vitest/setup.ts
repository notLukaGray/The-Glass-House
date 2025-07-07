import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";
import { beforeAll, afterEach, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => "/"),
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
  }) => {
    return React.createElement("img", { src, alt, width, height });
  },
}));

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => {
    return React.createElement("a", { href, className }, children);
  },
}));

// Shared API mocks
vi.mock("@/lib/api/client", () => ({
  elementApiClient: {
    getElementsByType: vi.fn(),
    getElementById: vi.fn(),
    createElement: vi.fn(),
    updateElement: vi.fn(),
    deleteElement: vi.fn(),
    searchElements: vi.fn(),
    getElementTypes: vi.fn(),
    getElementStats: vi.fn(),
    bulkCreateElements: vi.fn(),
    bulkUpdateElements: vi.fn(),
    bulkDeleteElements: vi.fn(),
  },
}));

// Mock NextAuth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

// Mock rate limiting
vi.mock("@/lib/rateLimit", () => ({
  checkRateLimit: vi.fn(() => ({
    isLimited: false,
    remaining: 100,
    resetTime: Date.now() + 60000,
  })),
  createRateLimitHeaders: vi.fn(() => ({
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Remaining": "99",
    "X-RateLimit-Reset": (Date.now() + 60000).toString(),
  })),
}));

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Global test setup
beforeAll(() => {
  // Add any global setup here
});

// Global test teardown
afterAll(() => {
  // Add any global cleanup here
});
