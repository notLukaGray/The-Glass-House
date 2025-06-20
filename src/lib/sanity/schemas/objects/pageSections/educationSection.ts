import { Rule } from '@sanity/types';

const educationSection = {
  name: 'educationSection',
  title: 'Education Section',
  type: 'object',
  fields: [
    {
      name: 'items',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'institution', title: 'Institution', type: 'localeString', validation: (rule: Rule) => rule.required() },
            { name: 'degree', title: 'Degree', type: 'localeString' },
            { name: 'field', title: 'Field of Study', type: 'localeString' },
            { name: 'startYear', title: 'Start Year', type: 'string' },
            { name: 'endYear', title: 'End Year', type: 'string' },
            { name: 'logo', title: 'Logo', type: 'reference', to: [
              { type: 'assetPhoto' },
              { type: 'assetSVG' },
              { type: 'assetVideo' },
              { type: 'asset3d' }
            ] }
          ],
          preview: {
            select: {
              institution: 'institution'
            },
            prepare({ institution }: { institution?: { en?: string } }) {
              const displayTitle = (institution && institution.en) || institution || 'Untitled';
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
        title: 'Education Section Component'
      };
    }
  }
}

export default educationSection; 