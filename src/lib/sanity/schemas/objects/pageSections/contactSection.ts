import React from 'react';

const ContactSection = {
  name: 'contactSection',
  title: 'Contact Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string'
    },
    {
      name: 'contactItems',
      title: 'Contact Items',
      type: 'array',
      of: [{ type: 'contactItem' }]
    }
  ],
  preview: {
    select: {
      heading: 'heading',
      contactItems: 'contactItems'
    },
    prepare({ heading, contactItems }: { heading?: unknown; contactItems?: unknown }) {
      const displayTitle = (
        heading && 
        typeof heading === 'object' && 
        'en' in heading && 
        (heading as { en?: string }).en
      ) || heading || 'Untitled';
      const firstItem = Array.isArray(contactItems) && contactItems[0];
      const icon = firstItem && firstItem.icon;
      return {
        title: `Component: Contact Section | Title: ${displayTitle}`,
        media: icon && icon.svgData ? React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
          dangerouslySetInnerHTML: { __html: `<div style=\"width:100%;height:100%;display:flex;align-items:center;justify-content:center;\">${icon.svgData}</div>` }
        }) : undefined
      };
    }
  }
};

export default ContactSection; 