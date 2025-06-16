import { Rule } from '@sanity/types'
import pageSections from '../objects/pageSections'

const section = {
  name: 'section',
  title: 'Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      description: 'Give this section a descriptive name so you can identify it in the Studio.'
    },
    {
      name: 'content',
      title: 'Section Content',
      type: 'array',
      of: pageSections.map((s: any) => ({ type: s.name })),
      validation: (rule: Rule) => rule.required().min(1),
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Order for drag-to-reorder in the Studio.'
    }
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
      order: 'order',
    },
    prepare({ title, content, order }: { title?: string; content?: any; order?: number }) {
      return {
        title: title || (content && content[0]?._type ? `Section: ${content[0]._type}` : 'Section'),
        subtitle: order !== undefined ? `Order: ${order}` : undefined,
      }
    }
  }
}

export default section; 