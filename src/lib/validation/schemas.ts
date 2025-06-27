import { z } from "zod";

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

export const LocalizedTextSchema = z.object({
  en: z.string().min(1, "English text is required"),
});

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

export const ResolvedIconSchema = z.object({
  _id: z.string(),
  svgData: z.string(),
  color: z.string().optional(),
});

export const IconAssetSchema = z.union([
  SanityReferenceSchema,
  ResolvedIconSchema,
]);

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
  lightMode: ThemeModeSchema.optional(),
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

export const SettingsSchema = z.object({
  _id: z.string(),
  _type: z.literal("siteSettings"),
  basicInfo: BasicInfoSchema,
  seo: SeoSchema.optional(),
  theme: ThemeSchema.optional(),
  socialLinks: z
    .array(
      z.object({
        _key: z.string(),
        platform: z.string(),
        url: z.string().url(),
        icon: IconAssetSchema.optional(),
      }),
    )
    .optional(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PortfolioItemSchema = z.object({
  _key: z.string(),
  title: LocalizedTextSchema,
  description: z.array(BlockContentSchema),
  image: SanityImageReferenceSchema.optional(),
  url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

export const PortfolioSchema = z.object({
  _id: z.string(),
  _type: z.literal("portfolio"),
  title: LocalizedTextSchema,
  description: z.array(BlockContentSchema),
  content: z.array(z.unknown()),
  meta: z
    .object({
      title: LocalizedTextSchema.optional(),
      description: LocalizedTextSchema.optional(),
      image: SanityImageReferenceSchema.optional(),
    })
    .optional(),
});

export const PageSchema = z.object({
  _id: z.string(),
  _type: z.literal("page"),
  title: LocalizedTextSchema,
  slug: z.string(),
  content: z.array(z.unknown()),
  meta: z
    .object({
      title: LocalizedTextSchema.optional(),
      description: LocalizedTextSchema.optional(),
      image: SanityImageReferenceSchema.optional(),
    })
    .optional(),
});

export const AboutPageSchema = z.object({
  _id: z.string(),
  _type: z.literal("about"),
  title: LocalizedTextSchema,
  content: z.array(z.unknown()),
  meta: z
    .object({
      title: LocalizedTextSchema.optional(),
      description: LocalizedTextSchema.optional(),
      image: SanityImageReferenceSchema.optional(),
    })
    .optional(),
});

export const AssetSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  title: z.string().optional(),
  alt: z.string().optional(),
  url: z.string().url().optional(),
  svgData: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  });

export const schemas = {
  base: {
    SanityReference: SanityReferenceSchema,
    SanityImageReference: SanityImageReferenceSchema,
    SanitySvgReference: SanitySvgReferenceSchema,
    LocalizedText: LocalizedTextSchema,
    BlockContent: BlockContentSchema,
    IconAsset: IconAssetSchema,
  },
  content: {
    WorkExperienceItem: WorkExperienceItemSchema,
    EducationItem: EducationItemSchema,
    SoftwareItem: SoftwareItemSchema,
    SkillItem: SkillItemSchema,
    ProcessStep: ProcessStepSchema,
    FaqItem: FaqItemSchema,
    QuoteItem: QuoteItemSchema,
    Button: ButtonSchema,
  },
  item: {
    Positioning: PositioningSchema,
    Effects: EffectsSchema,
    PositioningAdvanced: PositioningAdvancedSchema,
  },
  layout: {
    Theme: ThemeSchema,
    Typography: TypographySchema,
    Spacing: SpacingSchema,
  },
  settings: {
    Settings: SettingsSchema,
    BasicInfo: BasicInfoSchema,
    Seo: SeoSchema,
    ThemeColors: ThemeColorsSchema,
    ThemeMode: ThemeModeSchema,
    ThemeOverlays: ThemeOverlaysSchema,
  },
  data: {
    User: UserSchema,
    Portfolio: PortfolioSchema,
    PortfolioItem: PortfolioItemSchema,
    Page: PageSchema,
    AboutPage: AboutPageSchema,
  },
  asset: {
    Asset: AssetSchema,
  },
};
