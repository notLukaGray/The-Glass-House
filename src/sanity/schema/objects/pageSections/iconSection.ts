import { Rule } from '@sanity/types'
import React from 'react'

const iconSection = {
  name: 'iconSection',
  title: 'Icon Section',
  type: 'object',
  fields: [
    {
      name: 'icon',
      title: 'Icon',
      type: 'reference',
      to: [{ type: 'assetSVG' }],
      validation: (rule: Rule) => rule.required()
    },
    { name: 'label', title: 'Label', type: 'localeString' }
  ],
  preview: {
    select: {
      label: 'label',
      icon: 'icon'
    },
    prepare({ label, icon }: { label?: any; icon?: any }) {
      let displayTitle = (label && label.en) || label || 'Untitled';
      return {
        title: `Component: Icon Section | Title: ${displayTitle}`,
        media: icon && icon.svgData ? React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
          dangerouslySetInnerHTML: { __html: `<div style=\"width:100%;height:100%;display:flex;align-items:center;justify-content:center;\">${icon.svgData}</div>` }
        }) : undefined
      };
    }
  }
}

export default iconSection; 