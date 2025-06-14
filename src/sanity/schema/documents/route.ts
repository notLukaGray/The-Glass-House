import { Rule } from '@sanity/types'

const route = {
  name: 'route',
  title: 'Route',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'localeString', validation: (rule: Rule) => rule.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (rule: Rule) => rule.required(),
      options: {
        source: (doc: any) => doc.title?.en || '',
        maxLength: 96
      }
    },
    { name: 'description', title: 'Description', type: 'localeString' }
  ]
}

export default route; 