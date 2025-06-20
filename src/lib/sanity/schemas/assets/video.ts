import { Rule } from '@sanity/types'
import { metaCoreFields } from '../objects/metaCoreFields'
import React from 'react'

interface PreviewProps {
  title?: string
  media?: string
}

interface ParentType {
  sourceType?: string
}

const videoSchema = {
  name: 'assetVideo',
  title: 'Video Asset',
  type: 'document',
  fields: [
    ...metaCoreFields,
    {
      name: 'sourceType',
      title: 'Source Type',
      type: 'string',
      options: {
        list: [
          { title: 'CDN (Self-hosted)', value: 'cdn' },
          { title: 'Embedded (YouTube, Vimeo, etc.)', value: 'embedded' }
        ],
        layout: 'radio'
      },
      initialValue: 'cdn',
      validation: (rule: Rule) => rule.required()
    },
    // CDN fields
    {
      name: 'cdn4kUrl',
      title: 'CDN 4K URL',
      type: 'url',
      hidden: ({ parent }: { parent: ParentType }) => parent?.sourceType !== 'cdn'
    },
    {
      name: 'cdn2kUrl',
      title: 'CDN 2K URL',
      type: 'url',
      hidden: ({ parent }: { parent: ParentType }) => parent?.sourceType !== 'cdn'
    },
    {
      name: 'cdn1kUrl',
      title: 'CDN 1K URL',
      type: 'url',
      hidden: ({ parent }: { parent: ParentType }) => parent?.sourceType !== 'cdn'
    },
    {
      name: 'cdnSdUrl',
      title: 'CDN SD URL',
      type: 'url',
      hidden: ({ parent }: { parent: ParentType }) => parent?.sourceType !== 'cdn'
    },
    {
      name: 'poster',
      title: 'Poster Image URL',
      type: 'url',
      description: 'Optional poster image URL for the video.',
      hidden: ({ parent }: { parent: ParentType }) => parent?.sourceType !== 'cdn'
    },
    // Embedded fields
    {
      name: 'embedHost',
      title: 'Embed Host',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'Other', value: 'other' }
        ]
      },
      hidden: ({ parent }: { parent: ParentType }) => parent?.sourceType !== 'embedded'
    },
    {
      name: 'embedUrl',
      title: 'Embed URL',
      type: 'url',
      hidden: ({ parent }: { parent: ParentType }) => parent?.sourceType !== 'embedded'
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (rule: Rule) => rule.required(),
      description: 'Order for drag-to-reorder in the Studio.'
    }
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'poster'
    },
    prepare({ title, media }: PreviewProps) {
      return {
        title: title || 'Video',
        media: media
          ? React.createElement('img', {
              src: media,
              alt: title || 'Preview',
              style: { width: '100%', height: '100%', objectFit: 'cover' }
            })
          : undefined
      }
    }
  }
}

export default videoSchema 