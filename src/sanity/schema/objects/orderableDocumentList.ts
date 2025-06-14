import { Rule } from '@sanity/types'

const orderableDocumentList = {
  name: 'orderableDocumentList',
  title: 'Orderable Document List',
  type: 'object',
  fields: [
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (rule: Rule) => rule.required()
    }
  ]
}

export default orderableDocumentList; 