import { z } from "zod";

// Base API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: ApiMeta;
}

export interface ApiMeta {
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
  type?: string;
  search?: string;
  searchFields?: string[];
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: string;
  deletedCount?: number;
  timestamp: string;
}

// Query Parameter Types
export interface QueryParams {
  limit?: number;
  page?: number;
  sort?: string;
  order?: "asc" | "desc";
  filter?: Record<string, unknown>;
  include?: string[];
  exclude?: string[];
}

// Element Base Types
export interface ElementBase {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  title?: Record<string, string>;
  description?: Record<string, string>;
  alternativeTitle?: Record<string, string>;
  caption?: Record<string, string>;
  customId?: string;
  debug?: boolean;
  computedFields?: {
    ariaLabel?: Record<string, string>;
    altText?: Record<string, string>;
    customId?: string;
  };
}

// Casting Types
export interface CastingFields {
  sizeAndPosition?: {
    width?: string;
    height?: string;
    x?: string;
    y?: string;
    aspectRatioLock?: boolean;
    rotation?: number;
    scale?: number;
    alignment?: string;
  };
  displayAndTransform?: {
    objectFit?: string;
    opacity?: number;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    zIndex?: number;
  };
  themeTokens?: {
    themeToken?: string;
    customThemeToken?: string;
  };
  responsive?: {
    mobile?: ResponsiveBreakpoint;
    tablet?: ResponsiveBreakpoint;
    desktop?: ResponsiveBreakpoint;
  };
}

export interface ResponsiveBreakpoint {
  display?: "show" | "hide" | "collapse";
  width?: string;
  customWidth?: string;
  opacity?: number;
}

// Element Types (will be extended for specific elements)
export interface ElementWithCasting extends ElementBase {
  casting?: CastingFields;
}

// API Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}

// Validation Schemas
export const QueryParamsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  sort: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  order: z
    .enum(["asc", "desc"])
    .nullable()
    .default("desc")
    .transform((val) => (val === null ? undefined : val)),
  filter: z
    .record(z.unknown())
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  include: z
    .array(z.string())
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  exclude: z
    .array(z.string())
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val)),
});

export const ElementBaseSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  title: z.record(z.string()).optional(),
  description: z.record(z.string()).optional(),
  alternativeTitle: z.record(z.string()).optional(),
  caption: z.record(z.string()).optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z
    .object({
      ariaLabel: z.record(z.string()).optional(),
      altText: z.record(z.string()).optional(),
      customId: z.string().optional(),
    })
    .optional(),
});

// Element Type Registry
export const ELEMENT_TYPES = [
  "elementImage",
  "elementVideo",
  "elementAudio",
  "element3D",
  "elementCanvas",
  "elementTextSingleLine",
  "elementTextBlock",
  "elementRichText",
  "elementButton",
  "elementSVG",
  "elementDivider",
  "elementWidget",
] as const;

export type ElementType = (typeof ELEMENT_TYPES)[number];

// API Configuration
export interface ApiConfig {
  defaultLimit: number;
  maxLimit: number;
  cacheTime: number;
  revalidateTime: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  defaultLimit: 10,
  maxLimit: 100,
  cacheTime: 60,
  revalidateTime: 60,
};
