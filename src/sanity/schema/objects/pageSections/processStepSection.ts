import React from 'react'

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
      to: [{ type: 'assetPhoto' }]
    }
  ],
  preview: {
    select: {
      heading: 'heading',
      media: 'asset.url'
    },
    prepare({ heading, media }: { heading?: any; media?: string }) {
      return {
        title: heading?.en || 'Process Step',
        media: media
          ? React.createElement('img', {
              src: media,
              alt: heading?.en || 'Process step preview',
              style: { width: '100%', height: '100%', objectFit: 'cover' }
            })
          : undefined
      }
    }
  }
}

export default processStepSection; 