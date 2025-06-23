import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import deskStructure from "./schemas/deskStructure";
import { colorInput } from "@sanity/color-input";
import { Card, Text, Stack, Box, Heading } from "@sanity/ui";
import { HomeIcon } from "@sanity/icons";
import React from "react";

/**
 * A custom tool for the Sanity Studio that displays a welcoming dashboard.
 * This provides a user-friendly entry point for content editors, explaining
 * what the other tools are for. It's a good example of how to customize
 * the Sanity Studio UI.
 */
const studioInfoTool = () => {
  return {
    title: "Studio",
    name: "studio-info", // Unique name for the tool
    icon: HomeIcon,
    component: () => {
      // The component is built using Sanity's own UI components (`@sanity/ui`)
      // and React's `createElement` for a declarative structure.
      return React.createElement(
        Box,
        {
          padding: 4,
          style: { maxWidth: "800px", margin: "0 auto" },
        },
        [
          React.createElement(
            Stack,
            {
              key: "content",
              space: 4,
            },
            [
              React.createElement(
                Heading,
                {
                  key: "title",
                  size: 3,
                },
                "Welcome to Portfolio CMS Studio",
              ),

              React.createElement(
                Text,
                {
                  key: "intro",
                  size: 2,
                  muted: true,
                },
                "Here are the available tools to help you manage your portfolio content:",
              ),

              React.createElement(
                Stack,
                {
                  key: "tools-grid",
                  space: 3,
                },
                [
                  React.createElement(
                    Card,
                    {
                      key: "structure-tool",
                      padding: 4,
                      radius: 2,
                      shadow: 1,
                      tone: "primary",
                    },
                    [
                      React.createElement(
                        Stack,
                        {
                          key: "structure-content",
                          space: 3,
                        },
                        [
                          React.createElement(
                            Heading,
                            {
                              key: "structure-title",
                              size: 2,
                            },
                            "📋 Structure",
                          ),
                          React.createElement(
                            Text,
                            {
                              key: "structure-desc",
                              size: 1,
                              muted: true,
                            },
                            "The main content management interface where you can create, edit, and organize all your portfolio content. Here you'll find pages, projects, blog posts, assets, and site settings.",
                          ),
                        ],
                      ),
                    ],
                  ),

                  React.createElement(
                    Card,
                    {
                      key: "vision-tool",
                      padding: 4,
                      radius: 2,
                      shadow: 1,
                      tone: "primary",
                    },
                    [
                      React.createElement(
                        Stack,
                        {
                          key: "vision-content",
                          space: 3,
                        },
                        [
                          React.createElement(
                            Heading,
                            {
                              key: "vision-title",
                              size: 2,
                            },
                            "🔍 Vision",
                          ),
                          React.createElement(
                            Text,
                            {
                              key: "vision-desc",
                              size: 1,
                              muted: true,
                            },
                            "A powerful query interface for exploring your content database. Write GROQ queries to find, filter, and analyze your content. Great for debugging and understanding your data structure.",
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),

              React.createElement(
                Card,
                {
                  key: "getting-started",
                  padding: 4,
                  radius: 2,
                  shadow: 1,
                  tone: "caution",
                },
                [
                  React.createElement(
                    Stack,
                    {
                      key: "getting-started-content",
                      space: 3,
                    },
                    [
                      React.createElement(
                        Heading,
                        {
                          key: "getting-started-title",
                          size: 2,
                        },
                        "💡 Getting Started",
                      ),
                      React.createElement(
                        Text,
                        {
                          key: "getting-started-desc",
                          size: 1,
                          muted: true,
                        },
                        "Start with Structure to manage your content. Use Vision when you need to query your data or troubleshoot content issues. Both tools work together to give you complete control over your portfolio content.",
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      );
    },
  };
};

/**
 * The main configuration for the Sanity Studio.
 * This object defines the project connection, datasets, plugins, and schema.
 */
export default defineConfig({
  // A name for the studio configuration.
  name: "default",
  // The title of the Sanity Studio, visible in the browser tab.
  title: "Portfolio CMS",

  // These environment variables connect the studio to your Sanity project.
  // It's configured to work with both `NEXT_PUBLIC_` and non-public env variables
  // for flexibility between client-side and server-side environments.
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID ||
    "",
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "",

  // The API version ensures that your queries and mutations are compatible
  // with a specific version of the Sanity API, preventing breaking changes.
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
    process.env.SANITY_API_VERSION ||
    "",

  // Token for authentication with Sanity project
  token: process.env.SANITY_TOKEN || "",

  // Plugins enhance the studio's functionality.
  plugins: [
    // The Desk Tool is the primary interface for editing documents.
    // It's configured with a custom structure to organize content logically.
    deskTool({ structure: deskStructure }),

    // A plugin for a custom color picker input in the schema.
    colorInput(),

    // The Vision Tool allows you to run GROQ queries directly in the studio
    // for testing and data exploration.
    visionTool(),
  ],

  // Custom tools are added here, appearing in the studio's navigation.
  tools: [studioInfoTool()],

  // Defines the document types and schemas available in the studio.
  schema: {
    types: schemaTypes,
  },
});
