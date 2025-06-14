import { Rule } from '@sanity/types'
import { metaCoreFields } from '../objects/metaCoreFields'
import pageSections from '../objects/pageSections'
import React from 'react'

const about = {
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (rule: Rule) => rule.required()
    },
    {
      name: 'sections',
      title: 'Flexible Content Sections',
      type: 'array',
      of: pageSections,
      description: 'Add, remove, and drag to order content sections for this about page.'
    }
  ],
  preview: {
    select: {
      userName: 'user.name.en',
      userAvatar: 'user.avatarUrl'
    },
    prepare({ userName, userAvatar }: { userName?: string; userAvatar?: string }) {
      return {
        title: userName || 'About Page',
        media: userAvatar
          ? React.createElement('img', {
              src: userAvatar,
              alt: userName || 'Avatar',
              style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }
            })
          : undefined
      }
    }
  }
}

export default about; 