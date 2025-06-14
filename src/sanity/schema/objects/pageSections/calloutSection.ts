const calloutSection = {
  name: 'calloutSection',
  title: 'Callout/Highlight Section',
  type: 'object',
  fields: [
    { name: 'title', title: 'Title', type: 'localeString' },
    { name: 'content', title: 'Content', type: 'blockContent' },
    { name: 'backgroundColor', title: 'Background Color', type: 'string' },
    { name: 'icon', title: 'Icon', type: 'reference', to: [{ type: 'assetSVG' }] }
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }: { title?: any }) {
      let displayTitle = (title && title.en) || title || 'Untitled';
      return {
        title: `Component: Callout/Highlight Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default calloutSection; 