import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/content/about/route";

// Mock the Sanity client
vi.mock("@/lib/handlers/sanity", () => ({
  client: {
    fetch: vi.fn(),
  },
}));

describe("Content API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("/api/content/about", () => {
    it("returns about data when found", async () => {
      const mockAboutData = {
        user: {
          _id: "user-1",
          _type: "user",
        },
        sections: [
          {
            _id: "section-1",
            _type: "textSection",
            title: "About Me",
            order: 1,
            content: [
              {
                _key: "content-1",
                _type: "block",
                children: [{ _type: "span", text: "Test content" }],
              },
            ],
          },
        ],
      };

      const { client } = await import("@/lib/handlers/sanity");
      vi.mocked(client.fetch).mockResolvedValue(mockAboutData);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockAboutData);
    });

    it("returns 404 when about data not found", async () => {
      const { client } = await import("@/lib/handlers/sanity");
      vi.mocked(client.fetch).mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("About data not found");
    });

    it("returns 500 when validation fails", async () => {
      const invalidData = {
        user: {
          _id: "user-1",
          // Missing required _type field
        },
      };

      const { client } = await import("@/lib/handlers/sanity");
      vi.mocked(client.fetch).mockResolvedValue(invalidData);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Invalid about data format");
    });

    it("returns 500 when fetch throws error", async () => {
      const { client } = await import("@/lib/handlers/sanity");
      vi.mocked(client.fetch).mockRejectedValue(new Error("Network error"));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch about data");
    });
  });
});
