import { Rule } from '@sanity/types'

const textSection = {
  name: 'textSection',
  title: 'Text Section',
  type: 'object',
  fields: [
    { name: 'content', title: 'Content', type: 'blockContent', validation: (rule: Rule) => rule.required() }
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }: { content?: any }) {
      let displayTitle = (content && content[0] && content[0].children && content[0].children[0] && content[0].children[0].text) || 'Untitled';
      return {
        title: `Component: Text Section | Title: ${displayTitle}`,
      };
    }
  }
}

export default textSection; 