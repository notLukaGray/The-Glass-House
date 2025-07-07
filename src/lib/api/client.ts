import { createClient } from "@sanity/client";
import { QueryParams, ElementType, ElementWithCasting } from "./types";

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
});

// Element API Client
export class ElementApiClient {
  private client = sanityClient;

  // Query Sanity with proper typing
  async query<T = unknown>(query: string): Promise<T> {
    return this.client.fetch(query);
  }

  // Get elements by type with proper typing
  async getElementsByType(
    elementType: ElementType,
    params: QueryParams,
  ): Promise<{
    data: ElementWithCasting[];
    meta: {
      count: number;
      total: number;
      page: number;
      limit: number;
      hasMore: boolean;
      type: string;
      timestamp: string;
    };
  }> {
    const limit = Math.min(Math.max(params.limit || 10, 1), 100);
    const page = Math.max(params.page || 1, 1);
    const start = (page - 1) * limit;

    const query = `
      *[_type == "${elementType}"] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        description,
        alternativeTitle,
        caption,
        customId,
        debug,
        computedFields,
        casting
      } | order(_createdAt desc) [${start}...${start + limit}]
    `;

    const countQuery = `count(*[_type == "${elementType}"])`;

    const [elements, totalResult] = await Promise.all([
      this.query<ElementWithCasting[]>(query),
      this.query<number>(countQuery),
    ]);

    const total = Array.isArray(totalResult) ? totalResult[0] : totalResult;

    return {
      data: elements,
      meta: {
        count: elements.length,
        total,
        page,
        limit,
        hasMore: page * limit < total,
        type: elementType,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Search elements with proper typing
  async searchElements(
    searchTerm: string,
    elementType?: ElementType,
    params: QueryParams = {},
  ): Promise<{
    data: ElementWithCasting[];
    meta: {
      count: number;
      total: number;
      page: number;
      limit: number;
      hasMore: boolean;
      type: string;
      timestamp: string;
    };
  }> {
    const limit = Math.min(Math.max(params.limit || 10, 1), 100);
    const page = Math.max(params.page || 1, 1);
    const start = (page - 1) * limit;

    const typeFilter = elementType ? `&& _type == "${elementType}"` : "";
    const query = `
      *[_type in ["elementTextSingleLine", "elementTextBlock", "elementRichText", "elementImage", "elementVideo", "elementButton", "elementSVG", "elementAudio", "element3D", "elementCanvas", "elementDivider", "elementWidget"] ${typeFilter} && (
        title.en match "*${searchTerm}*" ||
        title.es match "*${searchTerm}*" ||
        description.en match "*${searchTerm}*" ||
        description.es match "*${searchTerm}*" ||
        alternativeTitle.en match "*${searchTerm}*" ||
        alternativeTitle.es match "*${searchTerm}*"
      )] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        description,
        alternativeTitle,
        caption,
        customId,
        debug,
        computedFields,
        casting
      } | order(_createdAt desc) [${start}...${start + limit}]
    `;

    const countQuery = `
      count(*[_type in ["elementTextSingleLine", "elementTextBlock", "elementRichText", "elementImage", "elementVideo", "elementButton", "elementSVG", "elementAudio", "element3D", "elementCanvas", "elementDivider", "elementWidget"] ${typeFilter} && (
        title.en match "*${searchTerm}*" ||
        title.es match "*${searchTerm}*" ||
        description.en match "*${searchTerm}*" ||
        description.es match "*${searchTerm}*" ||
        alternativeTitle.en match "*${searchTerm}*" ||
        alternativeTitle.es match "*${searchTerm}*"
      )])
    `;

    const [elements, totalResult] = await Promise.all([
      this.query<ElementWithCasting[]>(query),
      this.query<number>(countQuery),
    ]);

    const total = Array.isArray(totalResult) ? totalResult[0] : totalResult;

    return {
      data: elements,
      meta: {
        count: elements.length,
        total,
        page,
        limit,
        hasMore: page * limit < total,
        type: elementType || "search",
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Get element types
  async getElementTypes(): Promise<string[]> {
    const query = `array::distinct(*[_type in ["elementImage", "elementVideo", "elementAudio", "element3D", "elementCanvas", "elementTextSingleLine", "elementTextBlock", "elementRichText", "elementButton", "elementSVG", "elementDivider", "elementWidget"]]._type)`;
    return this.query<string[]>(query);
  }

  // Get element statistics
  async getElementStats(): Promise<Record<string, number>> {
    const query = `{
      "elementImage": count(*[_type == "elementImage"]),
      "elementVideo": count(*[_type == "elementVideo"]),
      "elementAudio": count(*[_type == "elementAudio"]),
      "element3D": count(*[_type == "element3D"]),
      "elementCanvas": count(*[_type == "elementCanvas"]),
      "elementTextSingleLine": count(*[_type == "elementTextSingleLine"]),
      "elementTextBlock": count(*[_type == "elementTextBlock"]),
      "elementRichText": count(*[_type == "elementRichText"]),
      "elementButton": count(*[_type == "elementButton"]),
      "elementSVG": count(*[_type == "elementSVG"]),
      "elementDivider": count(*[_type == "elementDivider"]),
      "elementWidget": count(*[_type == "elementWidget"])
    }`;

    return this.query<Record<string, number>>(query);
  }

  // Get single element by ID
  async getElementById(
    id: string,
    type: string,
  ): Promise<ElementWithCasting | null> {
    const query = `*[_type == "${type}" && _id == "${id}"][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      description,
      alternativeTitle,
      caption,
      customId,
      debug,
      computedFields,
      casting
    }`;
    const result = await this.client.fetch(query);
    return result || null;
  }

  // Write operations
  async createElement(
    elementType: ElementType,
    elementData: Record<string, unknown>,
  ) {
    return this.client.create({
      _type: elementType,
      ...elementData,
    });
  }

  async updateElement(elementId: string, elementData: Record<string, unknown>) {
    return this.client.patch(elementId).set(elementData).commit();
  }

  async deleteElement(elementId: string) {
    return this.client.delete(elementId);
  }

  // Bulk operations
  async bulkCreateElements(
    elementType: ElementType,
    elementsData: Record<string, unknown>[],
  ) {
    const transactions = elementsData.map((data) =>
      this.client.create({
        _type: elementType,
        ...data,
      }),
    );
    return Promise.all(transactions);
  }

  async bulkUpdateElements(
    updates: Array<{ id: string; data: Record<string, unknown> }>,
  ) {
    const transactions = updates.map(({ id, data }) =>
      this.client.patch(id).set(data).commit(),
    );
    return Promise.all(transactions);
  }

  async bulkDeleteElements(elementIds: string[]) {
    const transactions = elementIds.map((id) => this.client.delete(id));
    await Promise.all(transactions);
    return { success: true, deletedCount: elementIds.length };
  }
}

// Export singleton instance
export const elementApiClient = new ElementApiClient();
