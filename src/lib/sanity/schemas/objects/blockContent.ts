const blockContent = {
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    { type: 'block' },
    {
      type: 'reference',
      name: 'asset',
      title: 'Asset (Photo/SVG/Video/3D)',
      to: [
        { type: 'assetPhoto' },
        { type: 'assetSVG' },
        { type: 'assetVideo' },
        { type: 'asset3d' }
      ]
    }
  ]
}

export default blockContent; 