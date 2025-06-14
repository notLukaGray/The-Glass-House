const listSection = {
  name: 'listSection',
  title: 'List/Bullet Section',
  type: 'object',
  fields: [
    { name: 'title', title: 'Title', type: 'localeString' },
    { name: 'items', title: 'Items', type: 'array', of: [{ type: 'string' }] }
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }: { title?: any }) {
      let displayTitle = (title && title.en) || title || 'Untitled';
      return {
        title: `Component: List/Bullet Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default listSection; 