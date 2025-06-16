import { Rule } from '@sanity/types'
import pageSections from '../objects/pageSections'

const project = {
  name: 'projectMeta',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Project Title', type: 'localeString', validation: (rule: Rule) => rule.required() },
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
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }]
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }]
    },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
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
      ],
      validation: (rule: Rule) => rule.required()
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
    { name: 'externalLink', title: 'External Link', type: 'url' },
    { name: 'colorTheme', title: 'Color Theme (CSS String)', type: 'string', description: 'Any valid CSS color, gradient, or CSS snippet for UI use.' },
    { name: 'seo', title: 'SEO', type: 'seo' },
    {
      name: 'sections',
      title: 'Project Sections',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'section' }] }],
      description: 'Add, remove, and drag to order content sections for this project.'
    }
  ],
  preview: {
    select: {
      title: 'title.en'
    },
    prepare({ title }: { title?: string }) {
      return {
        title: title || 'Project'
      }
    }
  }
}

export default project; 