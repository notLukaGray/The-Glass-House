const quoteSection = {
  name: 'quoteSection',
  title: 'Quote/Block Quote Section',
  type: 'object',
  fields: [
    { name: 'quote', title: 'Quote', type: 'blockContent' },
    { name: 'attribution', title: 'Attribution', type: 'localeString' }
  ],
  preview: {
    select: {
      attribution: 'attribution',
    },
    prepare({ attribution }: { attribution?: unknown }) {
      const displayTitle = (
        attribution && 
        typeof attribution === 'object' && 
        'en' in attribution && 
        (attribution as { en?: string }).en
      ) || attribution || 'Untitled';
      return {
        title: `Component: Quote/Block Quote Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default quoteSection; 