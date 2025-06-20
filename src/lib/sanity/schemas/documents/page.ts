import { Rule } from '@sanity/types'

const page = {
  name: 'pageMeta',
  title: 'Page',
  type: 'document',
  fieldsets: [
    { name: 'main', title: 'Main', options: { collapsible: true, collapsed: true } },
    { name: 'media', title: 'Media', options: { collapsible: true, collapsed: true } },
    { name: 'settings', title: 'Settings', options: { collapsible: true, collapsed: true } },
    { name: 'seo', title: 'SEO', options: { collapsible: true, collapsed: true } },
    { name: 'sections', title: 'Sections', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // Main (dropdown)
    { name: 'title', title: 'Page Title', type: 'localeString', validation: (rule: Rule) => rule.required(), fieldset: 'main', description: 'The main title for this page. This will be shown as the heading and used for SEO.' },
    { name: 'subhead', title: 'Subhead', type: 'localeString', fieldset: 'main', description: 'A short subtitle or tagline for this page. Optional.' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: Record<string, unknown>) => (doc.title as { en?: string })?.en || '',
        maxLength: 96
      },
      validation: (rule: Rule) => rule.required(),
      fieldset: 'main',
      description: 'The URL path for this page. Example: "about" will become /about.'
    },
    { name: 'publishedAt', title: 'Published At', type: 'datetime', validation: (rule: Rule) => rule.required(), fieldset: 'main', description: 'The date and time this page should be published.' },
    { name: 'locked', title: 'Locked', type: 'boolean', description: 'If checked, this page will be hidden from production queries (not live on the site).', initialValue: false, fieldset: 'main' },
    // Page Layout (dropdown, for future use)
    {
      name: 'pageLayout',
      title: 'Page Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Landing', value: 'landing' },
          { title: 'Blog', value: 'blog' },
          { title: 'Portfolio', value: 'portfolio' },
          { title: 'Custom', value: 'custom' }
        ],
        layout: 'dropdown',
      },
      description: 'Choose a layout for this page. This controls the overall structure and style. (Feature coming soon)',
      fieldset: 'main',
    },
    // Media
    {
      name: 'coverAsset',
      title: 'Cover Asset',
      type: 'reference',
      to: [
        { type: 'assetPhoto' },
        { type: 'assetSVG' },
        { type: 'assetVideo' },
        { type: 'asset3d' }
      ],
      fieldset: 'media',
      description: 'The main image, video, or 3D asset for this page.'
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'assetPhoto' },
            { type: 'assetSVG' },
            { type: 'assetVideo' },
            { type: 'asset3d' }
          ]
        }
      ],
      fieldset: 'media',
      description: 'A collection of images, videos, or 3D assets to display in a gallery on this page.'
    },
    // Settings
    { name: 'order', title: 'Sort Order', type: 'number', description: 'Set a manual sort order for display. Lower numbers appear first.', fieldset: 'settings' },
    { name: 'colorTheme', title: 'Color Theme (CSS String)', type: 'string', description: 'Any valid CSS color, gradient, or CSS snippet for UI use. Example: "#fff", "linear-gradient(...)"', fieldset: 'settings' },
    // SEO
    { name: 'seo', title: 'SEO', type: 'seo', fieldset: 'seo', description: 'SEO settings for this page (meta title, description, image, etc.)' },
    // Sections
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'section' }] }],
      description: 'Add, remove, and drag to order content sections for this page. Each section can be reused across multiple pages.',
      fieldset: 'sections'
    }
  ],
  preview: {
    select: {
      title: 'title.en'
    },
    prepare({ title }: { title?: string }) {
      return {
        title: title || 'Page'
      }
    }
  }
}

export default page; 