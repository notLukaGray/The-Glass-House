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
      to: [{ type: 'assetPhoto' }],
      validation: (rule: Rule) => rule.required()
    },
    { name: 'label', title: 'Label', type: 'localeString' }
  ],
  preview: {
    select: {
      label: 'label',
      media: 'avatar.url'
    },
    prepare({ label }: { label?: unknown }) {
      return {
        title: (label && typeof label === 'object' && 'en' in label && (label as { en?: string }).en) || 'Avatar Section',
        subtitle: 'Avatar display section',
        media: React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
          dangerouslySetInnerHTML: { __html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;border-radius:50%;"><span style="font-size:24px;">👤</span></div>` }
        }),
        alt: (label && typeof label === 'object' && 'en' in label && (label as { en?: string }).en) || 'Avatar preview',
      };
    }
  }
}

export default avatarSection; 