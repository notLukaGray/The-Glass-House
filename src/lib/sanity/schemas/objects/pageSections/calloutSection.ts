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
    prepare({ title }: { title?: unknown }) {
      const displayTitle = (
        title && 
        typeof title === 'object' && 
        'en' in title && 
        (title as { en?: string }).en
      ) || title || 'Untitled';
      
      return {
        title: `Component: Callout Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default calloutSection; 