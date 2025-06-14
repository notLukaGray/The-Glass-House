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
    prepare({ images, title, altCaption }: { images?: any; title?: any; altCaption?: any }) {
      let firstImage = images && images[0];
      let displayTitle = title || (altCaption && altCaption.en) || (firstImage && firstImage._ref) || 'Untitled';
      return {
        title: `Component: Gallery Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default gallerySection; 