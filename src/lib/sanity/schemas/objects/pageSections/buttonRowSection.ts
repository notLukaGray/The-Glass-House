const buttonRowSection = {
  name: 'buttonRowSection',
  title: 'Button Row/CTA Section',
  type: 'object',
  fields: [
    {
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'localeString' },
            { name: 'url', title: 'URL', type: 'string' },
            { name: 'style', title: 'Style', type: 'string', options: { list: [ 'primary', 'secondary', 'ghost' ] }},
            { name: 'icon', title: 'Icon', type: 'reference', to: [{ type: 'assetSVG' }] }
          ]
        }
      ]
    },
    { name: 'alignment', title: 'Alignment', type: 'string', options: { list: [ 'left', 'center', 'right' ] } }
  ],
  preview: {
    select: {
      buttons: 'buttons',
    },
    prepare({ buttons }: { buttons?: unknown }) {
      const displayTitle = (
        Array.isArray(buttons) && 
        buttons[0] && 
        typeof buttons[0] === 'object' && 
        'label' in buttons[0] && 
        buttons[0].label && 
        typeof buttons[0].label === 'object' && 
        'en' in buttons[0].label && 
        (buttons[0].label.en || buttons[0].label)
      ) || 'Untitled';
      
      return {
        title: `Component: Button Row Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default buttonRowSection; 