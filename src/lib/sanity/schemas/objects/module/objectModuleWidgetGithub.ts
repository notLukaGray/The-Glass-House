import { Rule } from "@sanity/types";

// GitHub API Reference Object
export const githubApiRefObject = {
  name: "githubApiRefObject",
  title: "GitHub API Reference",
  type: "object",
  description: "Configuration for GitHub API integration",
  fields: [
    // Configuration Name
    {
      name: "name",
      title: "Configuration Name",
      type: "string",
      validation: (rule: Rule) => rule.required().max(50),
      description: "A descriptive name for this GitHub configuration",
    },
    // Description
    {
      name: "description",
      title: "Description",
      type: "text",
      description: "Brief description of what this configuration does",
    },
    // Basic User Info
    {
      name: "userInfo",
      title: "User Information",
      type: "object",
      fields: [
        {
          name: "username",
          title: "GitHub Username",
          type: "string",
          validation: (rule: Rule) => rule.required(),
          description: "GitHub username to fetch data for",
        },
        {
          name: "includeProfile",
          title: "Include Profile Data",
          type: "boolean",
          initialValue: true,
          description: "Include user profile information (bio, location, etc.)",
        },
        {
          name: "includeAvatar",
          title: "Include Avatar",
          type: "boolean",
          initialValue: true,
          description: "Include user avatar image",
        },
      ],
    },
    // Repository Configuration
    {
      name: "repositoryConfig",
      title: "Repository Configuration",
      type: "object",
      fields: [
        {
          name: "includeRepos",
          title: "Include Repositories",
          type: "boolean",
          initialValue: true,
          description: "Include repository information",
        },
        {
          name: "specificRepos",
          title: "Specific Repositories",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Only include these specific repositories (leave empty for all)",
        },
        {
          name: "includeForked",
          title: "Include Forked Repositories",
          type: "boolean",
          initialValue: false,
          description: "Include repositories that are forks",
        },
        {
          name: "includePrivate",
          title: "Include Private Repositories",
          type: "boolean",
          initialValue: false,
          description:
            "Include private repositories (requires proper authentication)",
        },
        {
          name: "maxRepos",
          title: "Maximum Repositories",
          type: "number",
          initialValue: 10,
          validation: (rule: Rule) => rule.min(1).max(100),
          description: "Maximum number of repositories to display",
        },
      ],
    },
    // Data Display Options
    {
      name: "displayOptions",
      title: "Display Options",
      type: "object",
      fields: [
        {
          name: "showStats",
          title: "Show Statistics",
          type: "object",
          fields: [
            {
              name: "showStars",
              title: "Show Stars",
              type: "boolean",
              initialValue: true,
            },
            {
              name: "showForks",
              title: "Show Forks",
              type: "boolean",
              initialValue: true,
            },
            {
              name: "showWatchers",
              title: "Show Watchers",
              type: "boolean",
              initialValue: false,
            },
            {
              name: "showIssues",
              title: "Show Issues",
              type: "boolean",
              initialValue: false,
            },
            {
              name: "showPullRequests",
              title: "Show Pull Requests",
              type: "boolean",
              initialValue: false,
            },
          ],
        },
        {
          name: "showActivity",
          title: "Show Activity",
          type: "object",
          fields: [
            {
              name: "showLastCommit",
              title: "Show Last Commit",
              type: "boolean",
              initialValue: true,
            },
            {
              name: "showCommitMessage",
              title: "Show Commit Message",
              type: "boolean",
              initialValue: true,
            },
            {
              name: "showTimeSince",
              title: "Show Time Since",
              type: "boolean",
              initialValue: true,
            },
            {
              name: "showContributions",
              title: "Show Contributions",
              type: "boolean",
              initialValue: true,
            },
          ],
        },
        {
          name: "showSocial",
          title: "Show Social Data",
          type: "object",
          fields: [
            {
              name: "showFollowers",
              title: "Show Followers",
              type: "boolean",
              initialValue: true,
            },
            {
              name: "showFollowing",
              title: "Show Following",
              type: "boolean",
              initialValue: false,
            },
            {
              name: "showOrganizations",
              title: "Show Organizations",
              type: "boolean",
              initialValue: false,
            },
          ],
        },
        {
          name: "showLanguages",
          title: "Show Languages",
          type: "object",
          fields: [
            {
              name: "showTopLanguages",
              title: "Show Top Languages",
              type: "boolean",
              initialValue: true,
            },
            {
              name: "maxLanguages",
              title: "Maximum Languages",
              type: "number",
              initialValue: 5,
              validation: (rule: Rule) => rule.min(1).max(20),
            },
            {
              name: "showLanguageStats",
              title: "Show Language Statistics",
              type: "boolean",
              initialValue: true,
            },
          ],
        },
      ],
    },
    // Advanced Options
    {
      name: "advancedOptions",
      title: "Advanced Options",
      type: "object",
      fields: [
        {
          name: "sortBy",
          title: "Sort Repositories By",
          type: "string",
          options: {
            list: [
              { title: "Last Updated", value: "updated" },
              { title: "Stars", value: "stars" },
              { title: "Forks", value: "forks" },
              { title: "Name", value: "name" },
              { title: "Created Date", value: "created" },
            ],
          },
          initialValue: "updated",
        },
        {
          name: "sortOrder",
          title: "Sort Order",
          type: "string",
          options: {
            list: [
              { title: "Descending", value: "desc" },
              { title: "Ascending", value: "asc" },
            ],
          },
          initialValue: "desc",
        },
        {
          name: "cacheDuration",
          title: "Cache Duration (minutes)",
          type: "number",
          initialValue: 15,
          validation: (rule: Rule) => rule.min(1).max(1440),
          description: "How long to cache the API response",
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      username: "userInfo.username",
      description: "description",
    },
    prepare({
      title,
      username,
      description,
    }: {
      title?: string;
      username?: string;
      description?: string;
    }) {
      const displayTitle = title || "Untitled GitHub Config";
      const userInfo = username ? ` - ${username}` : "";
      const desc = description ? ` (${description})` : "";

      return {
        title: displayTitle,
        subtitle: `GitHub API${userInfo}${desc}`,
        media: undefined,
      };
    },
  },
};

export default githubApiRefObject;
