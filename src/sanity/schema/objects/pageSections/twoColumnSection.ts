const twoColumnSection = {
  name: 'twoColumnSection',
  title: 'Two Column Section',
  type: 'object',
  fields: [
    { name: 'leftContent', title: 'Left Content', type: 'blockContent' },
    {
      name: 'leftAsset',
      title: 'Left Asset',
      type: 'reference',
      to: [
        { type: 'assetPhoto' },
        { type: 'assetSVG' },
        { type: 'assetVideo' },
        { type: 'asset3d' }
      ]
    },
    { name: 'rightContent', title: 'Right Content', type: 'blockContent' },
    {
      name: 'rightAsset',
      title: 'Right Asset',
      type: 'reference',
      to: [
        { type: 'assetPhoto' },
        { type: 'assetSVG' },
        { type: 'assetVideo' },
        { type: 'asset3d' }
      ]
    }
  ],
  preview: {
    select: {
      leftContent: 'leftContent',
      rightContent: 'rightContent',
    },
    prepare({ leftContent, rightContent }: { leftContent?: any; rightContent?: any }) {
      let displayTitle = (leftContent && leftContent[0] && leftContent[0].children && leftContent[0].children[0] && leftContent[0].children[0].text) || (rightContent && rightContent[0] && rightContent[0].children && rightContent[0].children[0] && rightContent[0].children[0].text) || 'Untitled';
      return {
        title: `Component: Two Column Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default twoColumnSection; 