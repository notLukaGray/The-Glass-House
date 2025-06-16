import { Rule } from '@sanity/types'

const textSection = {
  name: 'textSection',
  title: 'Text Section',
  type: 'object',
  fields: [
    {
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
          { title: 'Justify', value: 'justify' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'left',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'color',
                type: 'object',
                title: 'Text Color',
                fields: [
                  {
                    name: 'color',
                    type: 'color',
                    title: 'Color'
                  }
                ]
              }
            ]
          }
        },
      ],
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'positioning',
      title: 'Positioning',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'fullBleed', title: 'Full Bleed', type: 'boolean', description: 'If true, text stretches edge-to-edge (ignores page padding/margins).' },
        { name: 'size', title: 'Size', type: 'string', options: { list: ['auto', 'small', 'medium', 'large', 'full', 'custom'] }, description: 'Set the max width of the text. Example: "small" (max-w-xs), "medium" (max-w-md), "large" (max-w-lg), "full" (100% width). Use "custom" with Width/Max Width for advanced sizing.', hidden: ({ parent }: { parent: any }) => parent?.fullBleed },
        { name: 'width', title: 'Width', type: 'string', description: 'Custom width (overrides size). Example: "300px", "50vw", "20rem".', hidden: ({ parent }: { parent: any }) => parent?.fullBleed || parent?.size !== 'custom' },
        { name: 'maxWidth', title: 'Max Width', type: 'string', options: { list: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] }, description: 'Set a maximum width for the text. Example: "lg" (max-w-lg), "full" (100% width).' },
        { name: 'blockAlignment', title: 'Block Alignment', type: 'string', options: { list: ['left', 'center', 'right'] }, description: 'Align the text block within the page.' }
      ]
    },
    {
      name: 'effects',
      title: 'Effects',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'backgroundColor', title: 'Background Color', type: 'string', description: 'Background color for the text container. Example: "#fff", "rgba(0,0,0,0.1)".' },
        { name: 'borderRadius', title: 'Corner Rounding', type: 'string', options: { list: ['none', 'sm', 'md', 'lg', 'xl', 'full', 'custom'] }, description: 'Corner rounding. Example: "lg" (large), "full" (circle).' },
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
        }, description: 'Shadow style for the text container.' }
      ]
    },
    {
      name: 'positioningAdvanced',
      title: 'Positioning Advanced',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'margin', title: 'Margin', type: 'string', description: 'Custom margin. Example: "2rem", "32px".' },
        { name: 'padding', title: 'Padding', type: 'string', description: 'Custom padding inside the text container.' },
        { name: 'hideOnMobile', title: 'Hide on Mobile', type: 'boolean', description: 'Hide this text on mobile screens.' },
        { name: 'hideOnDesktop', title: 'Hide on Desktop', type: 'boolean', description: 'Hide this text on desktop screens.' }
      ]
    }
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }: { content?: any }) {
      const firstBlock = content?.[0];
      const text = firstBlock?.children?.[0]?.text || 'Untitled';
      return {
        title: `Component: Text Section | Content: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
      };
    }
  }
}

export default textSection; 