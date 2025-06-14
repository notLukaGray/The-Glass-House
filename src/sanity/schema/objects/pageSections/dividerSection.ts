import React from 'react';

const dividerSection = {
  name: 'dividerSection',
  title: 'Divider/Spacer Section',
  type: 'object',
  fields: [
    { name: 'style', title: 'Style', type: 'string', options: { list: [ 'line', 'space', 'graphic' ] }},
    { name: 'size', title: 'Size', type: 'string', options: { list: [ 'small', 'medium', 'large' ] }},
    { name: 'color', title: 'Color', type: 'string' },
    { name: 'icon', title: 'Icon', type: 'reference', to: [{ type: 'assetSVG' }] }
  ],
  preview: {
    select: {
      style: 'style',
      icon: 'icon'
    },
    prepare({ style, icon }: { style?: any; icon?: any }) {
      let displayTitle = style || 'Untitled';
      return {
        title: `Component: Divider/Spacer Section | Title: ${displayTitle}`,
        media: icon && icon.svgData ? React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
          dangerouslySetInnerHTML: { __html: `<div style=\"width:100%;height:100%;display:flex;align-items:center;justify-content:center;\">${icon.svgData}</div>` }
        }) : undefined
      };
    }
  }
}

export default dividerSection; 