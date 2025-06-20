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
      of: pageSections.map((s: { name: string }) => ({ type: s.name })),
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
    prepare({ title, content, order }: { title?: string; content?: unknown; order?: number }) {
      let sectionTitle = title;
      if (!sectionTitle) {
        if (Array.isArray(content) && content[0] && typeof content[0] === 'object' && '_type' in content[0]) {
          sectionTitle = `Section: ${(content[0] as { _type?: string })._type}`;
        } else {
          sectionTitle = 'Section';
        }
      }
      return {
        title: sectionTitle,
        subtitle: order !== undefined ? `Order: ${order}` : undefined,
      }
    }
  }
}

export default section; 