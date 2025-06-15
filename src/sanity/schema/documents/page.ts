import { Rule } from '@sanity/types'
import pageSections from '../objects/pageSections'

const page = {
  name: 'pageMeta',
  title: 'Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Page Title', type: 'localeString', validation: (rule: Rule) => rule.required() },
    { name: 'subhead', title: 'Subhead', type: 'localeString' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: any) => doc.title?.en || '',
        maxLength: 96
      },
      validation: (rule: Rule) => rule.required()
    },
    { name: 'publishedAt', title: 'Published At', type: 'datetime', validation: (rule: Rule) => rule.required() },
    { name: 'locked', title: 'Locked', type: 'boolean', description: 'Locked documents will be hidden from production queries', initialValue: false },
    {
      name: 'coverAsset',
      title: 'Cover Asset',
      type: 'reference',
      to: [
        { type: 'assetPhoto' },
        { type: 'assetSVG' },
        { type: 'assetVideo' },
        { type: 'asset3d' }
      ]
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
      ]
    },
    { name: 'order', title: 'Sort Order', type: 'number', description: 'Set a manual sort order for display.' },
    { name: 'colorTheme', title: 'Color Theme (CSS String)', type: 'string', description: 'Any valid CSS color, gradient, or CSS snippet for UI use.' },
    { name: 'seo', title: 'SEO', type: 'seo' },
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: pageSections,
      description: 'Add, remove, and drag to order content sections for this page.'
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