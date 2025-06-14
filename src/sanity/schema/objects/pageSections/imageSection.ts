import { Rule } from '@sanity/types'

const imageSection = {
  name: 'imageSection',
  title: 'Image Section',
  type: 'object',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'reference',
      to: [
        { type: 'assetPhoto' },
        { type: 'assetSVG' },
        { type: 'assetVideo' },
        { type: 'asset3d' }
      ],
      validation: (rule: Rule) => rule.required()
    },
    { name: 'showCaption', title: 'Show Caption', type: 'boolean', initialValue: false },
    { name: 'altCaption', title: 'Alternative Caption', type: 'localeString' },
    { name: 'fullBleed', title: 'Full Bleed', type: 'boolean' }
  ],
  preview: {
    select: {
      image: 'image',
      title: 'title',
      altCaption: 'altCaption',
    },
    prepare({ image, title, altCaption }: { image?: any; title?: any; altCaption?: any }) {
      let displayTitle = title || (altCaption && altCaption.en) || (image && image._ref) || 'Untitled';
      return {
        title: `Component: Image Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default imageSection; 