import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schema'
import deskStructure from './schema/deskStructure'
import { colorInput } from '@sanity/color-input'

export default defineConfig({
  name: 'default',
  title: 'Portfolio CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || '',
  plugins: [deskTool({ structure: (S, context) => deskStructure(S) }), colorInput(), visionTool()],
  schema: { types: schemaTypes },
})
