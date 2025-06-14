const processStepSection = {
  name: 'processStepSection',
  title: 'Process Step Section',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'localeString' },
    { name: 'description', title: 'Description', type: 'blockContent' },
    {
      name: 'asset',
      title: 'Asset',
      type: 'reference',
      to: [
        { type: 'assetPhoto' },
        { type: 'assetSVG' },
        { type: 'assetVideo' },
        { type: 'asset3d' }
      ]
    }
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare({ heading }: { heading?: any }) {
      let displayTitle = (heading && heading.en) || heading || 'Untitled';
      return {
        title: `Component: Process Step Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default processStepSection; 