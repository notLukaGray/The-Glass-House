import { Rule } from '@sanity/types';

const softwareSection = {
  name: 'softwareSection',
  title: 'Software Section',
  type: 'object',
  fields: [
    {
      name: 'items',
      title: 'Software',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Software Name', type: 'localeString', validation: (rule: Rule) => rule.required() },
            { name: 'icon', title: 'Icon', type: 'reference', to: [{ type: 'assetSVG' }] }
          ],
          preview: {
            select: {
              name: 'name'
            },
            prepare({ name }: { name?: { en?: string } }) {
              const displayTitle = (name && name.en) || name || 'Untitled';
              return {
                title: displayTitle
              };
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      items: 'items'
    },
    prepare() {
      return {
        title: 'Software Section Component'
      };
    }
  }
}

export default softwareSection; 