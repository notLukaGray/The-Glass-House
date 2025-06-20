import React from 'react';

const HeaderBanner = {
  name: 'headerBanner',
  title: 'Header Banner',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string'
    },
    {
      name: 'bannerItems',
      title: 'Banner Items',
      type: 'array',
      of: [
        {
          name: 'item',
          title: 'Item',
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'image'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      heading: 'heading',
      bannerItems: 'bannerItems'
    },
    prepare({ heading, bannerItems }: { heading?: unknown; bannerItems?: unknown }) {
      const displayTitle = (
        heading && 
        typeof heading === 'object' && 
        'en' in heading && 
        (heading as { en?: string }).en
      ) || heading || 'Untitled';
      const firstItem = Array.isArray(bannerItems) && bannerItems[0];
      const icon = firstItem && firstItem.icon;
      return {
        title: `Component: Header Banner | Title: ${displayTitle}`,
        media: icon && icon.svgData ? React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
          dangerouslySetInnerHTML: { __html: `<div style=\"width:100%;height:100%;display:flex;align-items:center;justify-content:center;\">${icon.svgData}</div>` }
        }) : undefined
      };
    }
  }
};

export default HeaderBanner; 