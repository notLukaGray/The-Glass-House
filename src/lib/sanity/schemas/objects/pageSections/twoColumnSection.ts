import React from 'react'

const twoColumnSection = {
  name: 'twoColumnSection',
  title: 'Two Column Section',
  type: 'object',
  fields: [
    { name: 'leftContent', title: 'Left Content', type: 'blockContent' },
    {
      name: 'leftAsset',
      title: 'Left Asset',
      type: 'reference',
      to: [{ type: 'assetPhoto' }]
    },
    { name: 'rightContent', title: 'Right Content', type: 'blockContent' },
    {
      name: 'rightAsset',
      title: 'Right Asset',
      type: 'reference',
      to: [{ type: 'assetPhoto' }]
    }
  ],
  preview: {
    select: {
      leftContent: 'leftContent',
      rightContent: 'rightContent',
      leftMedia: 'leftAsset.url',
      rightMedia: 'rightAsset.url'
    },
    prepare({ leftContent, rightContent, leftMedia, rightMedia }: { leftContent?: unknown; rightContent?: unknown; leftMedia?: string; rightMedia?: string }) {
      const title = (Array.isArray(leftContent) && leftContent[0]?.children?.[0]?.text) || 
                   (Array.isArray(rightContent) && rightContent[0]?.children?.[0]?.text) || 
                   'Two Column Section';
      
      return {
        title,
        media: leftMedia 
          ? React.createElement('img', {
              src: leftMedia,
              alt: title,
              style: { width: '100%', height: '100%', objectFit: 'cover' }
            })
          : rightMedia
          ? React.createElement('img', {
              src: rightMedia,
              alt: title,
              style: { width: '100%', height: '100%', objectFit: 'cover' }
            })
          : undefined
      }
    }
  }
}

export default twoColumnSection; 