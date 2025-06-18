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
    prepare({ label, media }: { label?: any; media?: string }) {
      return {
        title: label?.en || 'Avatar Section',
        media: media
          ? React.createElement('img', {
              src: media,
              alt: label?.en || 'Avatar preview',
              style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }
            })
          : undefined
      }
    }
  }
}

export default avatarSection; 