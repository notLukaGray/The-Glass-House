import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schema'
import deskStructure from './schema/deskStructure'
import { colorInput } from '@sanity/color-input'

const getSanityEnv = (key: string) => {
  if (typeof window !== 'undefined') {
    return process.env[`NEXT_PUBLIC_${key}`] || '';
  }
  return process.env[key] || '';
};

export default defineConfig({
  name: 'default',
  title: 'Portfolio CMS',
  projectId: getSanityEnv('SANITY_PROJECT_ID'),
  dataset: getSanityEnv('SANITY_DATASET'),
  plugins: [deskTool({ structure: (S, context) => deskStructure(S) }), colorInput(), visionTool()],
  schema: { types: schemaTypes },
})
