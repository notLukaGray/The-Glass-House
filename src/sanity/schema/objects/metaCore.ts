import { Rule } from '@sanity/types'

export const metaCore = {
  name: 'metaCore',
  title: 'Meta Information',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (rule: Rule) => rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'localeString'
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'localeString'
    },
    {
      name: 'altText',
      title: 'Alt Text',
      type: 'localeString',
      validation: (rule: Rule) =>
        rule.custom((value: any) => {
          if (value?.en && value.en.length > 120) {
            return 'Alt text should be 120 characters or less';
          }
          return true;
        }).warning('Alt text helps accessibility')
    }
  ]
} 