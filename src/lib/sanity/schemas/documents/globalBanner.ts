import { Rule } from '@sanity/types'

const globalBanner = {
  name: 'globalBanner',
  title: 'Global Banner',
  type: 'document',
  fields: [
    { name: 'message', title: 'Message', type: 'localeString', validation: (rule: Rule) => rule.required() },
    { name: 'isActive', title: 'Is Active?', type: 'boolean', initialValue: true },
    { name: 'style', title: 'Style', type: 'string', description: 'Class or theme token' }
  ]
}

export default globalBanner; 