const insetSection = {
  name: 'insetSection',
  title: 'Inset/Callout/Code Section',
  type: 'object',
  fields: [
    { name: 'content', title: 'Content', type: 'blockContent' },
    { name: 'style', title: 'Style', type: 'string', options: { list: [ 'code', 'info', 'warning', 'success', 'custom' ] }},
    { name: 'icon', title: 'Icon', type: 'reference', to: [{ type: 'assetSVG' }] },
    { name: 'label', title: 'Label', type: 'localeString' }
  ],
  preview: {
    select: {
      label: 'label',
    },
    prepare({ label }: { label?: any }) {
      let displayTitle = (label && label.en) || label || 'Untitled';
      return {
        title: `Component: Inset/Callout/Code Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default insetSection; 