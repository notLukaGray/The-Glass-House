import { Rule } from "@sanity/types";

const blog = {
  name: "blogMeta",
  title: "Blog Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Blog Title",
      type: "localeString",
      validation: (rule: Rule) => rule.required(),
    },
    { name: "subhead", title: "Subhead", type: "localeString" },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: Record<string, unknown>) =>
          (doc.title as { en?: string })?.en || "",
        maxLength: 96,
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
    {
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "locked",
      title: "Locked",
      type: "boolean",
      description: "Locked documents will be hidden from production queries",
      initialValue: false,
    },
    {
      name: "coverAsset",
      title: "Cover Asset",
      type: "reference",
      to: [
        { type: "assetPhoto" },
        { type: "assetSVG" },
        { type: "assetVideo" },
      ],
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            { type: "assetPhoto" },
            { type: "assetSVG" },
            { type: "assetVideo" },
          ],
        },
      ],
    },
    {
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Set a manual sort order for display.",
    },
    { name: "user", title: "User", type: "reference", to: [{ type: "user" }] },
    { name: "externalLink", title: "External Link", type: "url" },
    {
      name: "colorTheme",
      title: "Color Theme (CSS String)",
      type: "string",
      description: "Any valid CSS color, gradient, or CSS snippet for UI use.",
    },
    { name: "seo", title: "SEO", type: "seo" },
    {
      name: "sections",
      title: "Blog Sections",
      type: "array",
      of: [{ type: "reference", to: [{ type: "section" }] }],
      description:
        "Add, remove, and drag to order content sections for this blog post.",
    },
  ],
};

export default blog;
