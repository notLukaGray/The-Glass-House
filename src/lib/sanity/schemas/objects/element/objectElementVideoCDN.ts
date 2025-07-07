import { Rule } from "@sanity/types";

export const objectElementVideoCDN = {
  name: "objectElementVideoCDN",
  title: "CDN Video",
  type: "object",
  fields: [
    // Primary Configuration (Always Visible)
    {
      name: "provider",
      title: "CDN Provider",
      type: "string",
      options: {
        list: [{ title: "Bunny.net", value: "bunny" }],
        layout: "radio",
      },
      initialValue: "bunny",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "libraryId",
      title: "Library ID",
      type: "string",
      description: "Bunny library ID (e.g., 458305)",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "videoGuid",
      title: "Video GUID",
      type: "string",
      description:
        "Bunny video GUID (e.g., 545f30c7-f6fb-4522-ab4f-e0fc4b9faa1c)",
      validation: (rule: Rule) => rule.required(),
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
    // Quality & Performance (Common)
    {
      name: "quality",
      title: "Quality",
      type: "string",
      options: {
        list: [
          { title: "360p (Low)", value: "360p" },
          { title: "720p (Standard)", value: "720p" },
          { title: "1080p (High)", value: "1080p" },
          { title: "4K (Ultra)", value: "4k" },
        ],
      },
      initialValue: "720p",
      description: "Video quality for direct playback",
    },
    {
      name: "responsive",
      title: "Responsive",
      type: "boolean",
      initialValue: true,
      description: "Automatically adjust to container size",
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
          type: "boolean",
          initialValue: true,
          description: "Preload video data",
        },
        {
          name: "playsinline",
          title: "Play Inline on Mobile",
          type: "boolean",
          initialValue: true,
          description: "Play video inline instead of fullscreen on mobile",
        },
        {
          name: "controls",
          title: "Show Controls",
          type: "boolean",
          initialValue: true,
          description: "Display video controls",
        },
        {
          name: "poster",
          title: "Poster Image",
          type: "image",
          description: "Thumbnail image shown before video plays",
        },
      ],
    },
  ],
  preview: {
    select: {
      provider: "provider",
      videoGuid: "videoGuid",
      quality: "quality",
      autoplay: "autoplay",
    },
    prepare({
      provider,
      videoGuid,
      quality,
      autoplay,
    }: {
      provider?: string;
      videoGuid?: string;
      quality?: string;
      autoplay?: boolean;
    }) {
      const providerName = provider
        ? provider.charAt(0).toUpperCase() + provider.slice(1)
        : "Unknown";
      const videoId = videoGuid ? videoGuid.substring(0, 8) + "..." : "No GUID";
      const settings = [];
      if (quality) settings.push(quality);
      if (autoplay) settings.push("Autoplay");
      if (settings.length > 0) {
        return {
          title: `${providerName} Video`,
          subtitle: `${videoId} • ${settings.join(", ")}`,
        };
      }
      return {
        title: `${providerName} Video`,
        subtitle: videoId,
      };
    },
  },
};
