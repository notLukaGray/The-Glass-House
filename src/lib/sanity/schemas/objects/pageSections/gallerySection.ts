const gallerySection = {
  name: 'gallerySection',
  title: 'Gallery Section',
  type: 'object',
  fields: [
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'assetPhoto' },
            { type: 'assetSVG' },
            { type: 'assetVideo' },
            { type: 'asset3d' }
          ]
        }
      ]
    },
    { name: 'showCaption', title: 'Show Captions', type: 'boolean', initialValue: false },
    { name: 'altCaption', title: 'Alternative Caption', type: 'localeString' },
    { name: 'layout', title: 'Layout', type: 'string', options: { list: [ 'grid', 'carousel', 'stacked' ] }},
  ],
  preview: {
    select: {
      images: 'images',
      title: 'title',
      altCaption: 'altCaption',
    },
    prepare({ images, title, altCaption }: { images?: unknown; title?: unknown; altCaption?: unknown }) {
      const firstImage = Array.isArray(images) && images[0];
      const displayTitle = title || (
        altCaption && 
        typeof altCaption === 'object' && 
        'en' in altCaption && 
        (altCaption as { en?: string }).en
      ) || (firstImage && typeof firstImage === 'object' && '_ref' in firstImage && firstImage._ref) || 'Untitled';
      return {
        title: `Component: Gallery Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default gallerySection; 