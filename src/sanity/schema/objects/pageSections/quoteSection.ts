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
    prepare({ attribution }: { attribution?: any }) {
      let displayTitle = (attribution && attribution.en) || attribution || 'Untitled';
      return {
        title: `Component: Quote/Block Quote Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default quoteSection; 