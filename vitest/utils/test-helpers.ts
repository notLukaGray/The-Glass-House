import { NextRequest } from "next/server";
import type { RequestInit as NextRequestInit } from "next/dist/server/web/spec-extension/request";
import { expect } from "vitest";

export interface TestRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path?: string;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: unknown;
}

export function createTestRequest(
  options: TestRequestOptions = {},
): NextRequest {
  const {
    method = "GET",
    path = "/api/test",
    query = {},
    headers = {},
    body,
  } = options;

  // Build URL with query parameters
  const url = new URL(path, "http://localhost:3000");
  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  // Set default headers
  const defaultHeaders: Record<string, string> = {
    "content-type": "application/json",
    ...headers,
  };

  // Create request options
  const init: NextRequestInit = {
    method,
    headers: defaultHeaders,
    body:
      body !== undefined
        ? typeof body === "string"
          ? body
          : JSON.stringify(body)
        : undefined,
  };

  return new NextRequest(url.toString(), init);
}

interface HeaderAssertionOptions {
  rateLimit?: boolean;
  security?: boolean;
}

export function assertHeaders(
  response: Response,
  options: HeaderAssertionOptions = {},
): void {
  const headers = response.headers;

  if (options.rateLimit) {
    expect(headers.get("X-RateLimit-Limit")).toBeTruthy();
    expect(headers.get("X-RateLimit-Remaining")).toBeTruthy();
    expect(headers.get("X-RateLimit-Reset")).toBeTruthy();

    const limit = parseInt(headers.get("X-RateLimit-Limit") || "0");
    const remaining = parseInt(headers.get("X-RateLimit-Remaining") || "0");
    const reset = parseInt(headers.get("X-RateLimit-Reset") || "0");

    expect(limit).toBeGreaterThan(0);
    expect(remaining).toBeGreaterThanOrEqual(0);
    expect(remaining).toBeLessThanOrEqual(limit);
    expect(reset).toBeGreaterThan(Date.now());
  }

  if (options.security) {
    // CORS headers
    expect(headers.get("Access-Control-Allow-Origin")).toBeTruthy();
    expect(headers.get("Access-Control-Allow-Methods")).toBeTruthy();
    expect(headers.get("Access-Control-Allow-Headers")).toBeTruthy();

    // Security headers
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("X-XSS-Protection")).toBe("1; mode=block");
  }
}

export function assertRateLimitHeaders(response: Response): void {
  assertHeaders(response, { rateLimit: true });
}

export function assertSecurityHeaders(response: Response): void {
  assertHeaders(response, { security: true });
}

export function createMockAdminSession() {
  return {
    user: {
      id: "admin-1",
      email: "admin@example.com",
      role: "admin",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function createMockUserSession() {
  return {
    user: {
      id: "user-1",
      email: "user@example.com",
      role: "user",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function assertApiResponseStructure(
  response: Response,
  data?: unknown,
): void {
  expect(response.status).toBeGreaterThanOrEqual(200);
  expect(response.status).toBeLessThan(600);

  if (data !== undefined) {
    const responseData = data as {
      success?: boolean;
      data?: unknown;
      meta?: unknown;
      error?: string;
    };
    expect(responseData).toHaveProperty("success");
    expect(typeof responseData.success).toBe("boolean");

    if (responseData.success) {
      expect(responseData).toHaveProperty("data");
      if (responseData.meta && typeof responseData.meta === "object") {
        const meta = responseData.meta as { timestamp?: string };
        expect(meta).toHaveProperty("timestamp");
        expect(typeof meta.timestamp).toBe("string");
      }
    } else {
      expect(responseData).toHaveProperty("error");
      expect(typeof responseData.error).toBe("string");
    }
  }
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Sample documents for testing
export const sampleElements = {
  image: {
    _id: "test-image-1",
    _type: "elementImage",
    _createdAt: "2024-01-01T00:00:00Z",
    _updatedAt: "2024-01-01T00:00:00Z",
    title: { en: "Test Image", es: "Imagen de Prueba" },
    description: { en: "Test description", es: "Descripción de prueba" },
    imageSource: "upload",
    imageUpload: { asset: { _ref: "image-abc123" } },
  },

  video: {
    _id: "test-video-1",
    _type: "elementVideo",
    _createdAt: "2024-01-01T00:00:00Z",
    _updatedAt: "2024-01-01T00:00:00Z",
    title: { en: "Test Video", es: "Video de Prueba" },
    description: {
      en: "Test video description",
      es: "Descripción de video de prueba",
    },
    videoSource: "upload",
    videoUpload: { asset: { _ref: "video-xyz789" } },
  },

  text: {
    _id: "test-text-1",
    _type: "elementTextBlock",
    _createdAt: "2024-01-01T00:00:00Z",
    _updatedAt: "2024-01-01T00:00:00Z",
    title: { en: "Test Text", es: "Texto de Prueba" },
    description: {
      en: "Test text description",
      es: "Descripción de texto de prueba",
    },
    content: { en: "This is test content", es: "Este es contenido de prueba" },
  },
} as const;
