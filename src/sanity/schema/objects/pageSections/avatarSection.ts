import { Rule } from '@sanity/types'
import React from 'react'

const avatarSection = {
  name: 'avatarSection',
  title: 'Avatar Section',
  type: 'object',
  fields: [
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'reference',
      to: [
        { type: 'assetPhoto' },
        { type: 'assetSVG' },
        { type: 'assetVideo' },
        { type: 'asset3d' }
      ],
      validation: (rule: Rule) => rule.required()
    },
    { name: 'label', title: 'Label', type: 'localeString' }
  ],
  preview: {
    select: {
      label: 'label',
      avatar: 'avatar'
    },
    prepare({ label, avatar }: { label?: any; avatar?: any }) {
      let displayTitle = (label && label.en) || label || 'Untitled';
      return {
        title: `Component: Avatar Section | Title: ${displayTitle}`,
        media: avatar && avatar.svgData ? React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
          dangerouslySetInnerHTML: { __html: `<div style=\"width:100%;height:100%;display:flex;align-items:center;justify-content:center;\">${avatar.svgData}</div>` }
        }) : undefined
      };
    }
  }
}

export default avatarSection; 