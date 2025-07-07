import { Rule } from "@sanity/types";

export const objectElementVideoEmbed = {
  name: "objectElementVideoEmbed",
  title: "Embed Video",
  type: "object",
  fields: [
    // Primary Configuration (Always Visible)
    {
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
        ],
        layout: "radio",
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "videoId",
      title: "Video ID",
      type: "string",
      description: "YouTube: dQw4w9WgXcQ | Vimeo: 123456789",
      validation: (rule: Rule) => rule.required(),
    },
    // Common Playback Settings (Frequently Used)
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
    // Player Controls (Common)
    {
      name: "controls",
      title: "Show Controls",
      type: "boolean",
      initialValue: true,
      description: "Display player controls",
    },
    // YouTube-Specific Options (Hidden unless YouTube selected)
    {
      name: "youtubeOptions",
      title: "YouTube Options",
      type: "object",
      options: { collapsible: true, collapsed: true },
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent?.platform !== "youtube",
      fields: [
        {
          name: "modestbranding",
          title: "Hide YouTube Branding",
          type: "boolean",
          initialValue: false,
          description: "Remove YouTube logo from player",
        },
        {
          name: "rel",
          title: "Show Related Videos",
          type: "boolean",
          initialValue: true,
          description: "Display related videos when playback ends",
        },
        {
          name: "start",
          title: "Start Time (seconds)",
          type: "number",
          min: 0,
          description: "Start video at specific time",
        },
        {
          name: "end",
          title: "End Time (seconds)",
          type: "number",
          min: 0,
          description: "End video at specific time",
        },
        {
          name: "color",
          title: "Progress Bar Color",
          type: "string",
          options: {
            list: [
              { title: "Red", value: "red" },
              { title: "White", value: "white" },
            ],
          },
          initialValue: "red",
        },
      ],
    },
    // Vimeo-Specific Options (Hidden unless Vimeo selected)
    {
      name: "vimeoOptions",
      title: "Vimeo Options",
      type: "object",
      options: { collapsible: true, collapsed: true },
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent?.platform !== "vimeo",
      fields: [
        {
          name: "title",
          title: "Show Title",
          type: "boolean",
          initialValue: true,
          description: "Display video title",
        },
        {
          name: "byline",
          title: "Show Uploader",
          type: "boolean",
          initialValue: true,
          description: "Display uploader information",
        },
        {
          name: "portrait",
          title: "Show Uploader Portrait",
          type: "boolean",
          initialValue: true,
          description: "Display uploader profile picture",
        },
        {
          name: "color",
          title: "Player Color",
          type: "string",
          description: "Hex color for player accent (e.g., #ff0000)",
        },
        {
          name: "background",
          title: "Background Mode",
          type: "boolean",
          initialValue: false,
          description: "Hide all player controls for background video",
        },
      ],
    },
    // Advanced Options (Collapsed by default)
    {
      name: "advancedOptions",
      title: "Advanced Options",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: "playsinline",
          title: "Play Inline on Mobile",
          type: "boolean",
          initialValue: true,
          description: "Play video inline instead of fullscreen on mobile",
        },
        {
          name: "fs",
          title: "Allow Fullscreen",
          type: "boolean",
          initialValue: true,
          description: "Enable fullscreen button",
        },
        {
          name: "pip",
          title: "Picture-in-Picture",
          type: "boolean",
          initialValue: true,
          description: "Enable picture-in-picture button (Vimeo only)",
          hidden: ({ parent }: { parent: Record<string, unknown> }) =>
            parent?.platform !== "vimeo",
        },
        {
          name: "dnt",
          title: "Do Not Track",
          type: "boolean",
          initialValue: false,
          description: "Disable tracking (Vimeo only)",
          hidden: ({ parent }: { parent: Record<string, unknown> }) =>
            parent?.platform !== "vimeo",
        },
        {
          name: "iv_load_policy",
          title: "Show Annotations",
          type: "boolean",
          initialValue: true,
          description: "Display video annotations (YouTube only)",
          hidden: ({ parent }: { parent: Record<string, unknown> }) =>
            parent?.platform !== "youtube",
        },
        {
          name: "cc_load_policy",
          title: "Force Closed Captions",
          type: "boolean",
          initialValue: false,
          description: "Automatically show closed captions (YouTube only)",
          hidden: ({ parent }: { parent: Record<string, unknown> }) =>
            parent?.platform !== "youtube",
        },
      ],
    },
  ],
  preview: {
    select: {
      platform: "platform",
      videoId: "videoId",
      autoplay: "autoplay",
      muted: "muted",
    },
    prepare({
      platform,
      videoId,
      autoplay,
      muted,
    }: {
      platform?: string;
      videoId?: string;
      autoplay?: boolean;
      muted?: boolean;
    }) {
      const platformName = platform
        ? platform.charAt(0).toUpperCase() + platform.slice(1)
        : "Unknown";
      const settings = [];
      if (autoplay) settings.push("Autoplay");
      if (muted) settings.push("Muted");
      if (settings.length > 0) {
        return {
          title: `${platformName} Video`,
          subtitle: `${videoId || "No ID"} • ${settings.join(", ")}`,
        };
      }
      return {
        title: `${platformName} Video`,
        subtitle: videoId || "No ID",
      };
    },
  },
};
