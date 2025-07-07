# Element API Documentation

## The RESTful Reality

The Element API gives you full CRUD operations with GROQ-powered queries. Read operations are public, write operations require admin authentication. It's RESTful, it's fast, it works. No magic, just solid engineering.

## Base URL

```
/api/elements
```

## Authentication

- **Read operations**: No auth required
- **Write operations**: Admin auth via NextAuth session
- **Headers**: All responses include security headers (CORS, CSP, etc.)

## Element Types

The API supports these types. Know them:

```typescript
type ElementType =
  | "elementTextSingleLine"
  | "elementTextBlock"
  | "elementRichText"
  | "elementImage"
  | "elementVideo"
  | "elementButton"
  | "elementSVG"
  | "elementAudio"
  | "element3D"
  | "elementCanvas"
  | "elementDivider"
  | "elementWidget";
```

## Endpoints

### 1. List All Elements

**GET** `/api/elements`

Returns all elements with pagination and filtering.

#### Query Parameters

```typescript
{
  limit?: number;      // Items per page (1-100, default: 10)
  page?: number;       // Page number (default: 1)
  sort?: string;       // Sort field (default: "_createdAt")
  order?: "asc" | "desc"; // Sort order (default: "desc")
  filter?: string;     // Element type filter
  include?: string;    // Comma-separated fields to include
  exclude?: string;    // Comma-separated fields to exclude
}
```

#### Response

```typescript
{
  success: true,
  data: ElementWithCasting[],
  message: string,
  meta: {
    count: number,
    total: number,
    page: number,
    limit: number,
    hasMore: boolean,
    type: string
  }
}
```

#### Example

```bash
GET /api/elements?limit=20&page=1&filter=elementImage
```

### 2. Get Elements by Type

**GET** `/api/elements/[type]`

Returns elements of a specific type with enhanced data.

#### Path Parameters

- `type`: Element type (e.g., "image", "button", "text")

#### Response

```typescript
{
  success: true,
  data: EnhancedElement[],
  message: string,
  meta: {
    count: number,
    total: number,
    page: number,
    limit: number,
    hasMore: boolean,
    type: string
  }
}
```

#### Example

```bash
GET /api/elements/image?limit=10&sort=title&order=asc
```

### 3. Get Specific Element

**GET** `/api/elements/[type]/[id]`

Returns a single element by ID.

#### Path Parameters

- `type`: Element type
- `id`: Element ID

#### Example

```bash
GET /api/elements/image/abc123
```

### 4. Create Element

**POST** `/api/elements`

Creates a new element (admin required).

#### Request Body

```typescript
{
  _type: ElementType;
  data: {
    title: Record<string, string>;
    description: Record<string, string>;
    // ... element-specific fields
  }
}
```

#### Example

```bash
POST /api/elements
Content-Type: application/json

{
  "_type": "elementImage",
  "data": {
    "title": { "en": "My Image", "es": "Mi Imagen" },
    "description": { "en": "A beautiful image", "es": "Una imagen hermosa" },
    "imageSource": "upload",
    "imageUpload": { "asset": { "_ref": "image-abc123" } }
  }
}
```

### 5. Create Element by Type

**POST** `/api/elements/[type]`

Creates a new element of specific type (admin required).

#### Example

```bash
POST /api/elements/image
Content-Type: application/json

{
  "title": { "en": "Hero Image", "es": "Imagen Hero" },
  "description": { "en": "Main hero image", "es": "Imagen hero principal" },
  "imageSource": "external",
  "imageUrl": "https://example.com/image.jpg"
}
```

### 6. Update Element

**PUT** `/api/elements`

Updates an existing element (admin required).

### 7. Update Element by Type

**PUT** `/api/elements/[type]/[id]`

Updates a specific element (admin required).

### 8. Delete Element

**DELETE** `/api/elements?id=[id]`

Deletes an element (admin required).

### 9. Delete Element by Type

**DELETE** `/api/elements/[type]/[id]`

Deletes a specific element (admin required).

## Data Structures

### ElementWithCasting

```typescript
interface ElementWithCasting {
  _id: string;
  _type: ElementType;
  _createdAt: string;
  _updatedAt: string;

  // Base fields
  title: Record<string, string>;
  description: Record<string, string>;
  alternativeTitle?: Record<string, string>;
  caption?: Record<string, string>;
  customId?: string;
  debug?: boolean;

  // Auto-generated fields
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
  };

  // Casting fields
  casting?: {
    sizeAndPosition?: {
      width?: string;
      height?: string;
      x?: string;
      y?: string;
      rotation?: number;
      scale?: number;
      alignment?: string;
    };
    displayAndTransform?: {
      opacity?: number;
      zIndex?: number;
      flipHorizontal?: boolean;
      flipVertical?: boolean;
    };
  };

  // Element-specific fields
  [key: string]: any;
}
```

### Enhanced Element

Elements returned from type-specific endpoints include enhanced data:

```typescript
interface EnhancedElement extends ElementWithCasting {
  // Enhanced image data
  imageUrl?: string;
  imageAsset?: {
    url: string;
    metadata: {
      dimensions: { width: number; height: number };
      palette: { dominant: { background: string } };
    };
  };

  // Enhanced video data
  videoUrl?: string;
  videoThumbnail?: string;

  // Element info
  elementInfo: {
    type: string;
    hasTitle: boolean;
    hasDescription: boolean;
    hasCasting: boolean;
    hasComputedFields: boolean;
    isTyped: boolean;
    hasCustomId: boolean;
    isDebugMode: boolean;
  };
}
```

## GROQ vs CRUD

### GROQ Queries (Read-Only)

The API uses GROQ for efficient data fetching:

```groq
// Basic element query
*[_type == "elementImage"] {
  _id,
  _type,
  title,
  description,
  imageSource,
  imageUpload.asset->,
  casting
}

// Search with localization
*[_type == "elementImage" && (
  title.en match "*search*" ||
  title.es match "*search*"
)] {
  _id,
  title,
  description
}

// Pagination
*[_type == "elementImage"] | order(_createdAt desc) [0...10]
```

### CRUD Operations (Full Management)

CRUD operations use Sanity's document API:

```typescript
// Create
const result = await client.create({
  _type: "elementImage",
  title: { en: "My Image" },
  description: { en: "Description" },
});

// Update
const result = await client
  .patch(id)
  .set({ title: { en: "Updated Title" } })
  .commit();

// Delete
const result = await client.delete(id);
```

## Error Handling

### Error Response Format

```typescript
{
  success: false,
  error: string,
  details?: any,
  timestamp: string
}
```

### Common Error Codes

- `400`: Bad Request (invalid data, missing parameters)
- `401`: Unauthorized (admin authentication required)
- `404`: Not Found (element doesn't exist)
- `500`: Internal Server Error

### Example Error Response

```json
{
  "success": false,
  "error": "Invalid element type: invalidType",
  "details": {
    "validTypes": ["elementImage", "elementButton", ...]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Rate Limiting

- **Read operations**: 100 requests per minute per IP
- **Write operations**: 20 requests per minute per authenticated user
- **Bulk operations**: 10 requests per minute per authenticated user

## Caching

- **Read operations**: Cached for 5 minutes in production
- **Write operations**: No caching (always fresh data)
- **Headers**: Include cache control headers

## Bulk Operations

### Bulk Create

```bash
POST /api/elements/bulk
Content-Type: application/json

{
  "elements": [
    {
      "_type": "elementImage",
      "data": { ... }
    },
    {
      "_type": "elementButton",
      "data": { ... }
    }
  ]
}
```

### Bulk Update

```bash
PUT /api/elements/bulk
Content-Type: application/json

{
  "updates": [
    { "id": "abc123", "data": { ... } },
    { "id": "def456", "data": { ... } }
  ]
}
```

### Bulk Delete

```bash
DELETE /api/elements/bulk
Content-Type: application/json

{
  "ids": ["abc123", "def456", "ghi789"]
}
```

## Search and Filtering

### Text Search

```bash
GET /api/elements/search?q=hero&type=elementImage
```

Searches across:

- `title.en`, `title.es`
- `description.en`, `description.es`
- `alternativeTitle.en`, `alternativeTitle.es`

### Advanced Filtering

```bash
GET /api/elements?filter=elementImage&include=title,description,imageUrl
```

## Element-Specific Endpoints

Each element type has specialized endpoints with enhanced data:

### Image Elements

```bash
GET /api/elements/image
```

Returns enhanced image data including:

- Optimized URLs
- Metadata (dimensions, palette)
- Thumbnail URLs
- Asset information

### Video Elements

```bash
GET /api/elements/video
```

Returns enhanced video data including:

- Streaming URLs
- Thumbnail images
- Duration information
- Format details

### Button Elements

```bash
GET /api/elements/button
```

Returns enhanced button data including:

- Computed accessibility labels
- Style information
- Media asset URLs

## Best Practices

1. **Use type-specific endpoints** for enhanced data
2. **Implement proper error handling** for all API calls
3. **Cache read operations** when possible
4. **Validate data** before sending to API
5. **Use pagination** for large datasets
6. **Handle authentication** for write operations
7. **Use bulk operations** for multiple elements

## SDK Usage

The API includes a client SDK for easier integration:

```typescript
import { ElementApiClient } from "@/lib/api/client";

const client = new ElementApiClient();

// Get elements
const elements = await client.getElementsByType("elementImage", {
  limit: 10,
  page: 1,
});

// Search elements
const results = await client.searchElements("hero", "elementImage");

// Create element
const newElement = await client.createElement("elementImage", {
  title: { en: "New Image" },
  description: { en: "Description" },
});
```

---

**The Element API provides comprehensive CRUD operations with GROQ-powered queries, admin authentication, and enhanced data for each element type. It's RESTful, it's fast, it works.**
