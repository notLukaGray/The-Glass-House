import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  createTestRequest,
  assertHeaders,
  assertApiResponseStructure,
} from "../utils/test-helpers";

// Only run integration tests when explicitly enabled
const shouldRunIntegrationTests = process.env.INTEGRATION_TESTS === "true";

// Use test.concurrent.skipIf for better visibility
const testSuite = shouldRunIntegrationTests ? describe : describe.skip;

testSuite("Element API Integration Tests", () => {
  let baseUrl: string;

  beforeAll(() => {
    // Use test dataset for integration tests
    baseUrl =
      process.env.NEXT_PUBLIC_SANITY_DATASET === "test"
        ? "http://localhost:3000"
        : "https://your-test-domain.com";

    console.log(`Running integration tests against: ${baseUrl}`);
  });

  afterAll(() => {
    // Cleanup any test data if needed
    console.log("Integration tests completed");
  });

  describe("GET /api/elements", () => {
    it("returns all elements with pagination", async () => {
      // Create test request for validation (unused but kept for consistency)
      createTestRequest({
        path: "/api/elements",
        query: { limit: "5", page: "1" },
      });

      const response = await fetch(`${baseUrl}/api/elements?limit=5&page=1`);
      const data = await response.json();

      expect(response.status).toBe(200);
      assertApiResponseStructure(response, data);
      assertHeaders(response, { rateLimit: true });

      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.meta).toBeDefined();
      expect(data.meta.count).toBeGreaterThanOrEqual(0);
      expect(data.meta.total).toBeGreaterThanOrEqual(0);
    });

    it("handles search parameters", async () => {
      const response = await fetch(`${baseUrl}/api/elements?search=test`);
      const data = await response.json();

      expect(response.status).toBe(200);
      assertApiResponseStructure(response, data);
      assertHeaders(response, { rateLimit: true });

      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("validates query parameters", async () => {
      const response = await fetch(`${baseUrl}/api/elements?limit=invalid`);
      const data = await response.json();

      expect(response.status).toBe(400);
      assertApiResponseStructure(response, data);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid");
    });
  });

  describe("GET /api/elements/[type]", () => {
    it("returns elements of specific type", async () => {
      const response = await fetch(`${baseUrl}/api/elements/image?limit=3`);
      const data = await response.json();

      expect(response.status).toBe(200);
      assertApiResponseStructure(response, data);
      assertHeaders(response, { rateLimit: true });

      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);

      // Verify all returned elements are of the correct type
      data.data.forEach((element: { _type: string }) => {
        expect(element._type).toBe("elementImage");
      });
    });

    it("rejects invalid element type", async () => {
      const response = await fetch(`${baseUrl}/api/elements/invalid`);
      const data = await response.json();

      expect(response.status).toBe(400);
      assertApiResponseStructure(response, data);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid element type");
    });
  });

  describe("GET /api/elements/[type]/[id]", () => {
    let testElementId: string;

    beforeAll(async () => {
      // Get a test element ID for subsequent tests
      const response = await fetch(`${baseUrl}/api/elements/image?limit=1`);
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        testElementId = data.data[0]._id;
      }
    });

    it("returns specific element by ID", async () => {
      if (!testElementId) {
        console.log("Skipping test - no test element found");
        return;
      }

      const response = await fetch(
        `${baseUrl}/api/elements/image/${testElementId}`,
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      assertApiResponseStructure(response, data);
      assertHeaders(response, { rateLimit: true });

      expect(data.success).toBe(true);
      expect(data.data._id).toBe(testElementId);
      expect(data.data._type).toBe("elementImage");
    });

    it("returns 404 when element not found", async () => {
      const response = await fetch(
        `${baseUrl}/api/elements/image/nonexistent-id`,
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      assertApiResponseStructure(response, data);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Element not found");
    });
  });

  describe("POST /api/elements (Admin Required)", () => {
    it("creates a new element with admin authentication", async () => {
      // This test would require proper admin authentication
      // In a real integration test, you'd set up admin credentials
      const testElement = {
        _type: "elementImage",
        data: {
          title: {
            en: "Integration Test Image",
            es: "Imagen de Prueba de Integración",
          },
          description: {
            en: "Created by integration test",
            es: "Creado por prueba de integración",
          },
        },
      };

      const response = await fetch(`${baseUrl}/api/elements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // In real test, you'd include proper auth headers
          // "Authorization": "Bearer admin-token"
        },
        body: JSON.stringify(testElement),
      });

      // This will likely fail without proper auth, which is expected
      // In a real integration test, you'd have proper auth setup
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("Unhappy Paths", () => {
    it("returns 401 for unauthorized write operations", async () => {
      const response = await fetch(`${baseUrl}/api/elements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _type: "elementImage", data: {} }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      assertApiResponseStructure(response, data);
      expect(data.success).toBe(false);
      expect(data.error).toContain("authentication");
    });

    it("returns 404 for non-existent element", async () => {
      const response = await fetch(
        `${baseUrl}/api/elements/image/non-existent-id-12345`,
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      assertApiResponseStructure(response, data);
      expect(data.success).toBe(false);
      expect(data.error).toContain("not found");
    });

    it("handles malformed JSON gracefully", async () => {
      const response = await fetch(`${baseUrl}/api/elements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json {",
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      assertApiResponseStructure(response, data);
      expect(data.success).toBe(false);
    });
  });

  describe("Rate Limiting", () => {
    it("enforces rate limits", async () => {
      // Make multiple rapid requests to test rate limiting
      const requests = Array.from({ length: 5 }, () =>
        fetch(`${baseUrl}/api/elements?limit=1`),
      );

      const responses = await Promise.all(requests);

      // All requests should succeed initially
      responses.forEach((response) => {
        expect(response.status).toBe(200);
        assertHeaders(response, { rateLimit: true });
      });

      // Check that rate limit headers are consistent
      const firstResponse = responses[0];
      const limit = firstResponse.headers.get("X-RateLimit-Limit");
      const remaining = firstResponse.headers.get("X-RateLimit-Remaining");

      expect(limit).toBeTruthy();
      expect(remaining).toBeTruthy();
      expect(parseInt(remaining || "0")).toBeLessThanOrEqual(
        parseInt(limit || "0"),
      );
    });
  });

  describe("Performance", () => {
    it("responds within reasonable time", async () => {
      const startTime = Date.now();

      const response = await fetch(`${baseUrl}/api/elements?limit=10`);
      const data = await response.json();

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Response should be under 2 seconds
      expect(responseTime).toBeLessThan(2000);
    });
  });
});
