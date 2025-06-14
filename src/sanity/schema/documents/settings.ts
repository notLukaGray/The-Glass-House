import { Rule } from '@sanity/types'

const settings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'localeString', validation: (rule: Rule) => rule.required() },
    { name: 'description', title: 'Description', type: 'localeString' },
    { name: 'favicon', title: 'Favicon', type: 'url' },
    { name: 'logo', title: 'Logo', type: 'reference', to: [{ type: 'assetSVG' }] },
    { name: 'theme', title: 'Theme', type: 'string' }
  ]
}

export default settings; 