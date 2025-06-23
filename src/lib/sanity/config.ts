import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { schemaTypes } from "./schemas";
import deskStructure from "./schemas/deskStructure";
import { clientEnv } from "@/lib/env";
import { Card, Text, Stack, Box, Heading } from "@sanity/ui";
import { HomeIcon } from "@sanity/icons";
import React from "react";

const studioInfoTool = () => {
  return {
    title: "Studio",
    name: "studio-info",
    icon: HomeIcon,
    component: () => {
      return React.createElement(
        Box,
        {
          padding: [3, 4, 5],
          style: { maxWidth: "800px", margin: "0 auto" },
        },
        [
          React.createElement(
            Stack,
            {
              key: "content",
              space: 5,
            },
            [
              React.createElement(
                Stack,
                {
                  key: "header",
                  space: 3,
                },
                [
                  React.createElement(
                    Heading,
                    {
                      key: "title",
                      size: 4,
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
                    "Manage your portfolio content with these powerful tools:",
                  ),
                ],
              ),

              React.createElement(
                Stack,
                {
                  key: "tools-grid",
                  space: 4,
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
                            "Structure",
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
                            "Vision",
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
                        "Getting Started",
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

export default defineConfig({
  // A name for the studio configuration.
  name: "default",
  // The title of the Sanity Studio, visible in the browser tab.
  title: "Portfolio CMS",

  // These environment variables connect the studio to your Sanity project.
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: clientEnv.NEXT_PUBLIC_SANITY_API_VERSION!,

  // Token for authentication with Sanity project
  // Note: The token is not needed for the client-side studio configuration
  // It will be handled by the server-side API routes when needed

  // Enable CORS for the studio
  cors: {
    credentials: "include",
  },

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
  // The studioInfoTool is listed first to make it the default view.
  tools: [studioInfoTool()],

  // Defines the document types and schemas available in the studio.
  schema: {
    types: schemaTypes,
  },
});
