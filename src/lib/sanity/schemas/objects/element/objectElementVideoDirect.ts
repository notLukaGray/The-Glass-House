import { Rule } from "@sanity/types";

export const objectElementVideoDirect = {
  name: "objectElementVideoDirect",
  title: "Direct Video",
  type: "object",
  fields: [
    // Primary Configuration (Always Visible)
    {
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Upload to Sanity", value: "upload" },
          { title: "Custom URL", value: "url" },
        ],
        layout: "radio",
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "file",
      title: "Video File",
      type: "file",
      options: {
        accept: "video/*",
      },
      description: "Upload a video file (MP4, WebM, etc.)",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent?.source !== "upload",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { source } = context.document || {};
            if (source === "upload" && !value) {
              return "Video file is required when using upload option";
            }
            return true;
          },
        ),
    },
    {
      name: "url",
      title: "Video URL",
      type: "url",
      description: "Direct URL to video file (MP4, WebM, etc.)",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent?.source !== "url",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { source } = context.document || {};
            if (source === "url" && !value) {
              return "Video URL is required when using custom URL source";
            }
            if (
              value &&
              typeof value === "string" &&
              !value.match(/^https?:\/\//)
            ) {
              return "URL must start with http:// or https://";
            }
            return true;
          },
        ),
    },
    // Playback Settings (Frequently Used)
    {
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      initialValue: false,
      description: "Start playing automatically",
    },
    {
      name: "muted",
      title: "Muted",
      type: "boolean",
      initialValue: false,
      description: "Mute audio (required for autoplay on most browsers)",
    },
    {
      name: "loop",
      title: "Loop Video",
      type: "boolean",
      initialValue: false,
      description: "Repeat video when it ends",
    },
    {
      name: "controls",
      title: "Show Controls",
      type: "boolean",
      initialValue: true,
      description: "Display video controls",
    },
    // Visual Settings (Common)
    {
      name: "poster",
      title: "Poster Image",
      type: "image",
      description: "Thumbnail image shown before video plays",
    },
    // Advanced Options (Collapsed by default)
    {
      name: "advancedOptions",
      title: "Advanced Options",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: "preload",
          title: "Preload",
          type: "string",
          options: {
            list: [
              { title: "None", value: "none" },
              { title: "Metadata", value: "metadata" },
              { title: "Auto", value: "auto" },
            ],
          },
          initialValue: "metadata",
          description: "How much video data to preload",
        },
        {
          name: "playsinline",
          title: "Play Inline on Mobile",
          type: "boolean",
          initialValue: true,
          description: "Play video inline instead of fullscreen on mobile",
        },
        {
          name: "crossorigin",
          title: "Cross-Origin",
          type: "string",
          options: {
            list: [
              { title: "None", value: "" },
              { title: "Anonymous", value: "anonymous" },
              { title: "Use Credentials", value: "use-credentials" },
            ],
          },
          description: "Cross-origin policy for external videos",
        },
      ],
    },
  ],
  preview: {
    select: {
      source: "source",
      file: "file.asset.originalFilename",
      url: "url",
      autoplay: "autoplay",
      muted: "muted",
    },
    prepare({
      source,
      file,
      url,
      autoplay,
      muted,
    }: {
      source?: string;
      file?: string;
      url?: string;
      autoplay?: boolean;
      muted?: boolean;
    }) {
      const sourceName = source
        ? source.charAt(0).toUpperCase() + source.slice(1)
        : "Unknown";
      let subtitle = "";
      if (source === "upload" && file) {
        subtitle = file;
      } else if (source === "url" && url) {
        subtitle = url.length > 30 ? url.substring(0, 30) + "..." : url;
      } else {
        subtitle = "No source configured";
      }

      const settings = [];
      if (autoplay) settings.push("Autoplay");
      if (muted) settings.push("Muted");
      if (settings.length > 0) {
        subtitle += ` • ${settings.join(", ")}`;
      }

      return {
        title: `${sourceName} Video`,
        subtitle,
      };
    },
  },
};
