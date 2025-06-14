const timelineSection = {
  name: 'timelineSection',
  title: 'Timeline Section',
  type: 'object',
  fields: [
    {
      name: 'steps',
      title: 'Timeline Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', title: 'Date', type: 'localeString' },
            { name: 'description', title: 'Description', type: 'localeString' }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      steps: 'steps',
    },
    prepare({ steps }: { steps?: any }) {
      let displayTitle = (steps && steps[0] && steps[0].date && (steps[0].date.en || steps[0].date)) || 'Untitled';
      return {
        title: `Component: Timeline Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default timelineSection; 