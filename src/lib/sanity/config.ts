import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import deskStructure from './schemas/deskStructure'
import { colorInput } from '@sanity/color-input'
import { Card, Text, Stack, Box, Heading } from '@sanity/ui'
import { HomeIcon } from '@sanity/icons'
import React from 'react'

// Custom Studio Info Tool
const studioInfoTool = () => {
  return {
    title: 'Studio',
    name: 'studio',
    icon: HomeIcon,
    component: () => {
      return React.createElement(Box, {
        padding: 4,
        style: { maxWidth: '800px', margin: '0 auto' }
      }, [
        React.createElement(Stack, {
          key: 'content',
          space: 4
        }, [
          React.createElement(Heading, {
            key: 'title',
            size: 3
          }, 'Welcome to Portfolio CMS Studio'),
          
          React.createElement(Text, {
            key: 'intro',
            size: 2,
            muted: true
          }, 'Here are the available tools to help you manage your portfolio content:'),
          
          React.createElement(Stack, {
            key: 'tools-grid',
            space: 3
          }, [
            React.createElement(Card, {
              key: 'structure-tool',
              padding: 4,
              radius: 2,
              shadow: 1,
              tone: 'primary'
            }, [
              React.createElement(Stack, {
                key: 'structure-content',
                space: 3
              }, [
                React.createElement(Heading, {
                  key: 'structure-title',
                  size: 2
                }, '📋 Structure'),
                React.createElement(Text, {
                  key: 'structure-desc',
                  size: 1,
                  muted: true
                }, 'The main content management interface where you can create, edit, and organize all your portfolio content. Here you\'ll find pages, projects, blog posts, assets, and site settings.')
              ])
            ]),
            
            React.createElement(Card, {
              key: 'vision-tool',
              padding: 4,
              radius: 2,
              shadow: 1,
              tone: 'primary'
            }, [
              React.createElement(Stack, {
                key: 'vision-content',
                space: 3
              }, [
                React.createElement(Heading, {
                  key: 'vision-title',
                  size: 2
                }, '🔍 Vision'),
                React.createElement(Text, {
                  key: 'vision-desc',
                  size: 1,
                  muted: true
                }, 'A powerful query interface for exploring your content database. Write GROQ queries to find, filter, and analyze your content. Great for debugging and understanding your data structure.')
              ])
            ])
          ]),
          
          React.createElement(Card, {
            key: 'getting-started',
            padding: 4,
            radius: 2,
            shadow: 1,
            tone: 'caution'
          }, [
            React.createElement(Stack, {
              key: 'getting-started-content',
              space: 3
            }, [
              React.createElement(Heading, {
                key: 'getting-started-title',
                size: 2
              }, '💡 Getting Started'),
              React.createElement(Text, {
                key: 'getting-started-desc',
                size: 1,
                muted: true
              }, 'Start with Structure to manage your content. Use Vision when you need to query your data or troubleshoot content issues. Both tools work together to give you complete control over your portfolio content.')
            ])
          ])
        ])
      ])
    }
  }
}

export default defineConfig({
  name: 'default',
  title: 'Portfolio CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || '',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '',
  plugins: [
    deskTool({ structure: (S) => deskStructure(S) }), 
    colorInput(), 
    visionTool()
  ],
  tools: [studioInfoTool()],
  schema: { types: schemaTypes },
})
