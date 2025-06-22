import { z } from "zod";

/**
 * Zod validation schemas for Sanity data structures
 *
 * This file defines comprehensive validation schemas for all data
 * fetched from Sanity CMS. These schemas ensure data integrity
 * and provide runtime type safety beyond TypeScript's compile-time checks.
 *
 * Each schema includes:
 * - Required field validation
 * - Type checking for all fields
 * - Optional field handling
 * - Nested object validation
 * - Array validation where applicable
 */

// Base schemas for common patterns
export const SanityReferenceSchema = z.object({
  _ref: z.string(),
  _type: z.literal("reference"),
});

export const SanityImageReferenceSchema = SanityReferenceSchema.extend({
  url: z.string().url().optional(),
});

export const SanitySvgReferenceSchema = SanityReferenceSchema.extend({
  svgData: z.string().optional(),
});

// Localized text schema (for multi-language support)
export const LocalizedTextSchema = z.object({
  en: z.string().min(1, "English text is required"),
});

// Block content schemas for rich text
export const BlockContentChildSchema = z.object({
  _type: z.string(),
  _key: z.string(),
  text: z.string().optional(),
  marks: z.array(z.string()).optional(),
});

export const BlockContentSchema = z.object({
  _type: z.string(),
  _key: z.string(),
  style: z.string().optional(),
  textAlign: z.enum(["left", "center", "right", "justify"]).optional(),
  children: z.array(BlockContentChildSchema),
});

// Icon asset schemas
export const ResolvedIconSchema = z.object({
  _id: z.string(),
  svgData: z.string(),
  color: z.string().optional(),
});

export const IconAssetSchema = z.union([
  SanityReferenceSchema,
  ResolvedIconSchema,
]);

// Content item schemas
export const WorkExperienceItemSchema = z.object({
  _key: z.string(),
  company: LocalizedTextSchema,
  role: LocalizedTextSchema,
  startYear: z.string(),
  endYear: z.string().optional(),
  description: z.array(BlockContentSchema),
  icon: IconAssetSchema.optional(),
});

export const EducationItemSchema = z.object({
  _key: z.string(),
  institution: LocalizedTextSchema,
  degree: LocalizedTextSchema,
  field: LocalizedTextSchema,
  startYear: z.string(),
  endYear: z.string().optional(),
  description: z.array(BlockContentSchema),
  icon: IconAssetSchema.optional(),
});

export const SoftwareItemSchema = z.object({
  _key: z.string(),
  name: LocalizedTextSchema,
  description: z.array(BlockContentSchema),
  icon: IconAssetSchema.optional(),
});

export const SkillItemSchema = z.object({
  _key: z.string(),
  name: LocalizedTextSchema,
  description: z.string(),
  icon: IconAssetSchema.optional(),
});

export const ProcessStepSchema = z.object({
  _key: z.string(),
  title: LocalizedTextSchema,
  description: z.array(BlockContentSchema),
  icon: IconAssetSchema.optional(),
});

export const FaqItemSchema = z.object({
  _key: z.string(),
  question: z.string(),
  answer: z.array(BlockContentSchema),
});

export const QuoteItemSchema = z.object({
  _key: z.string(),
  quote: z.array(BlockContentSchema),
  attribution: z.string().optional(),
});

export const ButtonSchema = z.object({
  _key: z.string(),
  label: z.string(),
  icon: z.string().optional(),
  style: z.string(),
  url: z.string().url(),
});

// Positioning and effects schemas
export const PositioningSchema = z.object({
  fullBleed: z.boolean().optional(),
  size: z.string().optional(),
  width: z.string().optional(),
  maxWidth: z.string().optional(),
  blockAlignment: z.string().optional(),
});

export const EffectsSchema = z.object({
  backgroundColor: z.string().optional(),
  borderRadius: z.string().optional(),
  boxShadow: z.string().optional(),
  textColor: z.string().optional(),
  fontFamily: z.string().optional(),
});

export const PositioningAdvancedSchema = z.object({
  margin: z.string().optional(),
  padding: z.string().optional(),
  hideOnMobile: z.boolean().optional(),
  hideOnDesktop: z.boolean().optional(),
});

// Settings schemas
export const ThemeColorsSchema = z.object({
  primary: z.string(),
  secondary: z.string().optional(),
  background: z.string(),
  surface: z.string().optional(),
  text: z.string(),
  textSecondary: z.string().optional(),
  accent: z.string().optional(),
  error: z.string().optional(),
  success: z.string().optional(),
  warning: z.string().optional(),
});

export const ThemeOverlaysSchema = z.object({
  color: z.string().optional(),
  opacity: z.number().optional(),
});

export const ThemeModeSchema = z.object({
  colors: ThemeColorsSchema,
  overlays: ThemeOverlaysSchema.optional(),
});

export const TypographySchema = z.object({
  headingFont: z.string().optional(),
  bodyFont: z.string().optional(),
  customFonts: z.union([z.string(), z.array(z.string())]).optional(),
});

export const SpacingSchema = z.object({
  baseUnit: z.string().optional(),
  spacingScale: z
    .object({
      xs: z.string().optional(),
      sm: z.string().optional(),
      md: z.string().optional(),
      lg: z.string().optional(),
      xl: z.string().optional(),
      xxl: z.string().optional(),
    })
    .optional(),
});

export const ThemeSchema = z.object({
  defaultMode: z.enum(["light", "dark", "system"]).optional(),
  lightMode: ThemeModeSchema,
  darkMode: ThemeModeSchema.optional(),
  typography: TypographySchema.optional(),
  spacing: SpacingSchema.optional(),
});

export const BasicInfoSchema = z.object({
  title: LocalizedTextSchema,
  description: LocalizedTextSchema.optional(),
  favicon: SanityImageReferenceSchema.optional(),
  logo: SanitySvgReferenceSchema.optional(),
});

export const SeoSchema = z.object({
  metaTitle: LocalizedTextSchema.optional(),
  metaDescription: LocalizedTextSchema.optional(),
  ogImage: SanityImageReferenceSchema.optional(),
});

export const SiteSettingsSchema = z.object({
  basicInfo: BasicInfoSchema,
  theme: ThemeSchema,
  seo: SeoSchema.optional(),
});

// User data schemas
export const UserDataSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  bio: z.array(BlockContentSchema).optional(),
  avatar: SanityImageReferenceSchema.optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().url(),
      }),
    )
    .optional(),
});

// Portfolio schemas
export const PortfolioPreviewSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  coverImage: SanityImageReferenceSchema.optional(),
  tags: z.array(z.string()).optional(),
  publishedAt: z.string().optional(),
});

export const PortfolioDetailSchema = PortfolioPreviewSchema.extend({
  content: z.array(z.any()), // Will be validated by individual section schemas
  seo: SeoSchema.optional(),
});

// Page schemas
export const PageMetaSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  seo: SeoSchema.optional(),
});

export const PageDetailSchema = PageMetaSchema.extend({
  content: z.array(z.any()), // Will be validated by individual section schemas
});

// About page schemas
export const AboutDataSchema = z.object({
  _id: z.string(),
  title: z.string(),
  content: z.array(z.any()), // Will be validated by individual section schemas
  workExperience: z.array(WorkExperienceItemSchema).optional(),
  education: z.array(EducationItemSchema).optional(),
  skills: z.array(SkillItemSchema).optional(),
  software: z.array(SoftwareItemSchema).optional(),
  process: z.array(ProcessStepSchema).optional(),
  faqs: z.array(FaqItemSchema).optional(),
  quotes: z.array(QuoteItemSchema).optional(),
});

// Asset schemas
export const SvgAssetSchema = z.object({
  _id: z.string(),
  _type: z.literal("svgAsset"),
  name: z.string(),
  svgData: z.string(),
  color: z.string().optional(),
});

export const ImageAssetSchema = z.object({
  _id: z.string(),
  _type: z.literal("imageAsset"),
  name: z.string(),
  url: z.string().url(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const VideoAssetSchema = z.object({
  _id: z.string(),
  _type: z.literal("videoAsset"),
  name: z.string(),
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  duration: z.number().optional(),
});

export const SocialAssetSchema = z.object({
  _id: z.string(),
  _type: z.literal("socialAsset"),
  name: z.string(),
  platform: z.string(),
  url: z.string().url(),
  icon: IconAssetSchema.optional(),
});

// API response schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema.optional(),
    error: z.string().optional(),
  });

// Export all schemas for use throughout the application
export const schemas = {
  // Base schemas
  SanityReference: SanityReferenceSchema,
  SanityImageReference: SanityImageReferenceSchema,
  SanitySvgReference: SanitySvgReferenceSchema,
  LocalizedText: LocalizedTextSchema,

  // Content schemas
  BlockContent: BlockContentSchema,
  BlockContentChild: BlockContentChildSchema,
  IconAsset: IconAssetSchema,
  ResolvedIcon: ResolvedIconSchema,

  // Item schemas
  WorkExperienceItem: WorkExperienceItemSchema,
  EducationItem: EducationItemSchema,
  SoftwareItem: SoftwareItemSchema,
  SkillItem: SkillItemSchema,
  ProcessStep: ProcessStepSchema,
  FaqItem: FaqItemSchema,
  QuoteItem: QuoteItemSchema,
  Button: ButtonSchema,

  // Layout schemas
  Positioning: PositioningSchema,
  Effects: EffectsSchema,
  PositioningAdvanced: PositioningAdvancedSchema,

  // Settings schemas
  ThemeColors: ThemeColorsSchema,
  ThemeOverlays: ThemeOverlaysSchema,
  ThemeMode: ThemeModeSchema,
  Typography: TypographySchema,
  Spacing: SpacingSchema,
  Theme: ThemeSchema,
  BasicInfo: BasicInfoSchema,
  Seo: SeoSchema,
  SiteSettings: SiteSettingsSchema,

  // Data schemas
  UserData: UserDataSchema,
  PortfolioPreview: PortfolioPreviewSchema,
  PortfolioDetail: PortfolioDetailSchema,
  PageMeta: PageMetaSchema,
  PageDetail: PageDetailSchema,
  AboutData: AboutDataSchema,

  // Asset schemas
  SvgAsset: SvgAssetSchema,
  ImageAsset: ImageAssetSchema,
  VideoAsset: VideoAssetSchema,
  SocialAsset: SocialAssetSchema,
} as const;
