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
    { name: 'altText', title: 'Alt Text', type: 'localeString' },
    { name: 'caption', title: 'Caption', type: 'localeString' },
    { name: 'linkUrl', title: 'Link URL', type: 'string' },
    { name: 'size', title: 'Size', type: 'string', options: { list: ['auto', 'small', 'medium', 'large', 'full', 'custom'] } },
    { name: 'aspectRatio', title: 'Aspect Ratio', type: 'string', options: { list: ['auto', '16:9', '4:3', '1:1', '3:4', '9:16', 'custom'] } },
    { name: 'width', title: 'Width', type: 'string' },
    { name: 'height', title: 'Height', type: 'string' },
    { name: 'maxWidth', title: 'Max Width', type: 'string', options: { list: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] } },
    { name: 'fullBleed', title: 'Full Bleed', type: 'boolean' },
    { name: 'alignment', title: 'Alignment', type: 'string', options: { list: ['left', 'center', 'right'] } },
    { name: 'objectFit', title: 'Object Fit', type: 'string', options: { list: ['cover', 'contain', 'fill', 'none', 'scale-down'] } },
    {
      name: 'advanced',
      title: 'Advanced Options',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'marginTop', title: 'Margin Top', type: 'string' },
        { name: 'marginBottom', title: 'Margin Bottom', type: 'string' },
        { name: 'padding', title: 'Padding', type: 'string' },
        { name: 'borderRadius', title: 'Border Radius', type: 'string', options: { list: ['none', 'sm', 'md', 'lg', 'xl', 'full', 'custom'] } },
        { name: 'boxShadow', title: 'Box Shadow', type: 'string', options: { list: ['none', 'sm', 'md', 'lg', 'xl'] } },
        { name: 'backgroundColor', title: 'Background Color', type: 'string' },
        { name: 'overlayColor', title: 'Overlay Color', type: 'string' },
        { name: 'overlayOpacity', title: 'Overlay Opacity', type: 'number' },
        { name: 'hoverEffect', title: 'Hover Effect', type: 'string', options: { list: ['none', 'zoom', 'shadow', 'colorShift', 'blur'] } },
        { name: 'hideOnMobile', title: 'Hide on Mobile', type: 'boolean' },
        { name: 'hideOnDesktop', title: 'Hide on Desktop', type: 'boolean' },
      ]
    }
  ],
  preview: {
    select: {
      image: 'image',
      title: 'title',
      caption: 'caption',
    },
    prepare({ image, title, caption }: { image?: any; title?: any; caption?: any }) {
      let displayTitle = title || (caption && caption.en) || (image && image._ref) || 'Untitled';
      return {
        title: `Component: Image Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default imageSection; 