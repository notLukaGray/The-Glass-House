import { Rule } from "@sanity/types";
import { SanityField } from "../../types";

// Common blueprint metadata fields that can be reused
export const createSlugField = (
  fieldName: string = "slug",
  title: string = "Slug",
  description?: string,
  fieldset: string = "main",
): SanityField => ({
  name: fieldName,
  title,
  type: "slug",
  options: {
    source: (doc: Record<string, unknown>) =>
      (doc.title as { en?: string })?.en || "",
    maxLength: 96,
  },
  validation: (rule: Rule) => rule.required(),
  fieldset,
  description:
    description ||
    "The URL path for this page. Example: 'about' will become /about.",
});

export const createScaffoldField = (
  fieldName: string = "scaffold",
  title: string = "Scaffold",
  description?: string,
  fieldset: string = "layout",
): SanityField => ({
  name: fieldName,
  title,
  type: "reference",
  to: [{ type: "scaffoldFixedShell" }],
  validation: (rule: Rule) => rule.required(),
  fieldset,
  description: description || "The layout framework this blueprint uses",
});

export const createThemeField = (
  fieldName: string = "theme",
  title: string = "Theme Override",
  description?: string,
  fieldset: string = "styling",
): SanityField => ({
  name: fieldName,
  title,
  type: "reference",
  to: [{ type: "foundationTheme" }],
  fieldset,
  description:
    description ||
    "Optional theme override for this page (cascades down to scaffolds and wings)",
});

export const createSeoField = (
  fieldName: string = "seo",
  title: string = "SEO",
  description?: string,
  fieldset: string = "seo",
): SanityField => ({
  name: fieldName,
  title,
  type: "seo",
  fieldset,
  description: description || "Search engine configuration for this page",
});

export const createAccessControlField = (
  fieldName: string = "accessControl",
  title: string = "Access Control",
  description?: string,
  fieldset: string = "settings",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "Public", value: "public" },
      { title: "Authenticated Only", value: "authenticated" },
      { title: "Admin Only", value: "admin" },
      { title: "Custom Role", value: "custom" },
    ],
  },
  fieldset,
  description: description || "Defines who can access this page",
});

export const createPublishedField = (
  fieldName: string = "published",
  title: string = "Published",
  description?: string,
  fieldset: string = "settings",
): SanityField => ({
  name: fieldName,
  title,
  type: "boolean",
  initialValue: true,
  fieldset,
  description: description || "Whether this page is published and visible",
});

export const createScheduleField = (
  fieldName: string = "schedule",
  title: string = "Schedule",
  description?: string,
  fieldset: string = "settings",
): SanityField => ({
  name: fieldName,
  title,
  type: "object",
  fieldset,
  description:
    description || "Optional start/end dates for time-based publishing",
  fields: [
    {
      name: "publishAt",
      title: "Publish At",
      type: "datetime",
      description: "When this page should become visible",
    },
    {
      name: "unpublishAt",
      title: "Unpublish At",
      type: "datetime",
      description: "When this page should become hidden",
    },
  ],
});

export const createRedirectField = (
  fieldName: string = "redirect",
  title: string = "Redirect",
  description?: string,
  fieldset: string = "settings",
): SanityField => ({
  name: fieldName,
  title,
  type: "object",
  fieldset,
  description: description || "Optional redirect configuration",
  fields: [
    {
      name: "target",
      title: "Redirect To",
      type: "string",
      description: "URL or path to redirect to",
    },
    {
      name: "type",
      title: "Redirect Type",
      type: "string",
      options: {
        list: [
          { title: "Temporary (302)", value: "temporary" },
          { title: "Permanent (301)", value: "permanent" },
        ],
      },
      initialValue: "temporary",
    },
  ],
});

export const createFallbackField = (
  fieldName: string = "fallback",
  title: string = "Fallback Behavior",
  description?: string,
  fieldset: string = "settings",
): SanityField => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: [
      { title: "Show Default State", value: "default" },
      { title: "Redirect to 404", value: "notFound" },
      { title: "Redirect to Home", value: "home" },
      { title: "Show Error", value: "error" },
    ],
  },
  fieldset,
  description: description || "What to do if content is missing",
});

// Base blueprint schema creator
export const createBaseBlueprintSchema = (
  blueprintName: string,
  blueprintTitle: string,
  blueprintType: string,
  additionalFields: SanityField[] = [],
  additionalFieldsets: Array<{
    name: string;
    title: string;
    options?: { collapsible?: boolean; collapsed?: boolean };
  }> = [],
) => {
  const baseFields = [
    {
      name: "title",
      title: "Title",
      type: "glassLocaleString",
      description: `Human-readable title for the ${blueprintType} (required)`,
      fieldset: "main",
      validation: (rule: Rule) => rule.required(),
    },
    createSlugField(),
    createScaffoldField(),
    createThemeField(),
    createSeoField(),
    createAccessControlField(),
    createPublishedField(),
    createScheduleField(),
    createRedirectField(),
    createFallbackField(),
    ...additionalFields,
  ];

  const baseFieldsets = [
    {
      name: "main",
      title: "Main",
      options: { collapsible: false, collapsed: false },
    },
    {
      name: "layout",
      title: "Layout",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "styling",
      title: "Styling",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "seo",
      title: "SEO",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "settings",
      title: "Settings",
      options: { collapsible: true, collapsed: true },
    },
    ...additionalFieldsets,
  ];

  return {
    name: blueprintName,
    title: blueprintTitle,
    type: "document",
    fieldsets: baseFieldsets,
    fields: baseFields,
    preview: {
      select: {
        title: "title.en",
        slug: "slug.current",
      },
      prepare({ title, slug }: { title?: string; slug?: string }) {
        return {
          title: title || "Untitled Blueprint",
          subtitle: slug ? `/${slug}` : "No slug",
        };
      },
    },
  };
};
