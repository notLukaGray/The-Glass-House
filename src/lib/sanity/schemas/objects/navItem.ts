const navItem = {
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'localeString' },
    { name: 'url', title: 'URL', type: 'string' },
    { name: 'icon', title: 'Icon', type: 'reference', to: [{ type: 'assetSVG' }] }
  ]
}

export default navItem; 