import { Rule } from '@sanity/types'
import React from 'react'

const imageSection = {
  name: 'imageSection',
  title: 'Image Section',
  type: 'object',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'reference',
      to: [{ type: 'assetPhoto' }],
      validation: (rule: Rule) => rule.required(),
      description: 'Select an image asset to display.'
    },
    {
      name: 'meta',
      title: 'Meta',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { 
          name: 'titleDisplayMode', 
          title: 'Title Display Mode', 
          type: 'string',
          options: {
            list: [
              { title: "Don't Show Title", value: 'none' },
              { title: 'Below Image', value: 'below' },
              { title: 'Overlay - Top', value: 'overlay-top' },
              { title: 'Overlay - Bottom', value: 'overlay-bottom' },
              { title: 'Overlay - Center', value: 'overlay-center' },
              { title: 'Show on Hover (Centered)', value: 'hover' }
            ]
          },
          initialValue: 'below',
          description: 'How to display the image title'
        },
        { 
          name: 'showCaption', 
          title: 'Show Caption', 
          type: 'boolean',
          initialValue: true,
          description: 'Whether to display the image caption',
          hidden: ({ parent }: { parent: any }) => parent?.titleDisplayMode === 'none'
        },
        { 
          name: 'altDescription', 
          title: 'Alt Description', 
          type: 'localeString', 
          description: 'Overrides the asset description. Used for the image alt attribute (accessibility). Example: "A panoramic view of a mountain range at sunset."' 
        },
        { 
          name: 'altCaption', 
          title: 'Alt Caption', 
          type: 'localeString', 
          description: 'Overrides the asset caption. Shown below the image. Example: "A beautiful sunset over the mountains."' 
        },
        { 
          name: 'linkUrl', 
          title: 'Link URL', 
          type: 'string', 
          description: 'Optional. Make the image a link. Example: "https://example.com"' 
        },
        { 
          name: 'hideOnMobile', 
          title: 'Hide on Mobile', 
          type: 'boolean', 
          description: 'Hide this image on mobile screens.' 
        },
        { 
          name: 'hideOnDesktop', 
          title: 'Hide on Desktop', 
          type: 'boolean', 
          description: 'Hide this image on desktop screens.' 
        }
      ]
    },
    {
      name: 'effects',
      title: 'Effects',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'hoverEffect', title: 'Hover Effect', type: 'string', options: { list: ['none', 'zoom', 'shadow', 'colorShift', 'blur'] }, description: 'Visual effect on hover.' },
        { name: 'boxShadow', title: 'Box Shadow', type: 'string', options: {
          list: [
            { title: 'None', value: 'none' },
            { title: 'Small', value: 'sm' },
            { title: 'Medium', value: 'md' },
            { title: 'Large', value: 'lg' },
            { title: 'XL', value: 'xl' },
            { title: '2XL', value: '2xl' },
            { title: '3XL', value: '3xl' },
            { title: '4XL', value: '4xl' },
            { title: '5XL', value: '5xl' },
          ]
        }, description: 'Shadow style for the image.' },
        { name: 'borderRadius', title: 'Corner Rounding', type: 'string', options: { list: ['none', 'sm', 'md', 'lg', 'xl', 'full', 'custom'] }, description: 'Corner rounding. Example: "lg" (large), "full" (circle).' },
        { name: 'overlayColor', title: 'Overlay Color', type: 'string', description: 'Color overlay on top of the image. Example: "#000".' },
        { name: 'overlayOpacity', title: 'Overlay Opacity', type: 'number', description: 'Opacity for the overlay color (0 to 1).', hidden: ({ parent }: { parent: any }) => !parent?.overlayColor },
        { name: 'backgroundColor', title: 'Background Color', type: 'string', description: 'Background color for the image container. Example: "#fff", "rgba(0,0,0,0.1)".' }
      ]
    },
    {
      name: 'positioning',
      title: 'Positioning',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'fullBleed', title: 'Full Bleed', type: 'boolean', description: 'If true, image stretches edge-to-edge (ignores page padding/margins).' },
        { name: 'size', title: 'Size', type: 'string', options: { list: ['auto', 'small', 'medium', 'large', 'full', 'custom'] }, description: 'Set the max width of the image. Example: "small" (max-w-xs), "medium" (max-w-md), "large" (max-w-lg), "full" (100% width). Use "custom" with Width/Max Width for advanced sizing.', hidden: ({ parent }: { parent: any }) => parent?.fullBleed },
        { name: 'width', title: 'Width', type: 'string', description: 'Custom width (overrides size). Example: "300px", "50vw", "20rem".', hidden: ({ parent }: { parent: any }) => parent?.fullBleed || parent?.size !== 'custom' },
        { name: 'height', title: 'Height', type: 'string', description: 'Custom height. Example: "200px", "30vh", "15rem". Leave blank for auto height.', hidden: ({ parent }: { parent: any }) => parent?.fullBleed || parent?.size !== 'custom' },
        { name: 'aspectRatio', title: 'Aspect Ratio', type: 'string', options: { list: ['auto', '16:9', '4:3', '1:1', '3:4', '9:16', 'custom'] }, description: 'Set the aspect ratio of the image. Example: "16:9" for widescreen, "1:1" for square. Use "auto" for natural image ratio.' },
        { name: 'alignment', title: 'Alignment', type: 'string', options: { list: ['left', 'center', 'right'] }, description: 'Align the image within its container.' }
      ]
    },
    {
      name: 'positioningAdvanced',
      title: 'Positioning Advanced',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'objectFit', title: 'Object Fit', type: 'string', options: { list: ['cover', 'contain', 'fill', 'none', 'scale-down'] }, description: 'How the image should fit its container. "cover" crops, "contain" letterboxes, "fill" stretches.' },
        { name: 'margin', title: 'Margin', type: 'string', description: 'Custom margin. Example: "2rem", "32px".' },
        { name: 'padding', title: 'Padding', type: 'string', description: 'Custom padding inside the image container.' },
        { name: 'maxWidth', title: 'Max Width', type: 'string', options: { list: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] }, description: 'Set a maximum width for the image. Example: "lg" (max-w-lg), "full" (100% width).' },
        { name: 'maxHeight', title: 'Max Height', type: 'string', description: 'Set a maximum height for the image. Example: "200px", "30vh".' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'image.title.en',
      media: 'image.url'
    },
    prepare({ title, media }: { title?: string; media?: string }) {
      return {
        title: title || 'Untitled Image',
        media: media
          ? React.createElement('img', {
              src: media,
              alt: title || 'Image preview',
              style: { width: '100%', height: '100%', objectFit: 'cover' }
            })
          : undefined
      }
    }
  }
}

export default imageSection; 