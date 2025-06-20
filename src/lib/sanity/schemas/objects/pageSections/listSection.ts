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
    prepare({ title }: { title?: unknown }) {
      const displayTitle = (
        title && 
        typeof title === 'object' && 
        'en' in title && 
        (title as { en?: string }).en
      ) || title || 'Untitled';
      return {
        title: `Component: List/Bullet Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default listSection; 