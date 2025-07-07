import { Rule } from "@sanity/types";

export const elementAudio = {
  name: "elementAudio",
  title: "Audio Element",
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
      title: "Audio File",
      type: "file",
      options: {
        accept: "audio/*",
      },
      description: "Upload an audio file (MP3, WAV, etc.)",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent?.source !== "upload",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { source } = context.document || {};
            if (source === "upload" && !value) {
              return "Audio file is required when using upload option";
            }
            return true;
          },
        ),
    },
    {
      name: "url",
      title: "Audio URL",
      type: "url",
      description: "Direct URL to audio file (MP3, WAV, etc.)",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent?.source !== "url",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { source } = context.document || {};
            if (source === "url" && !value) {
              return "Audio URL is required when using custom URL source";
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
    // Playback Settings
    {
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      initialValue: false,
      description: "Start playing automatically",
    },
    {
      name: "controls",
      title: "Show Controls",
      type: "boolean",
      initialValue: true,
      description: "Display audio controls",
    },
    {
      name: "loop",
      title: "Loop Audio",
      type: "boolean",
      initialValue: false,
      description: "Repeat audio when it ends",
    },
    {
      name: "muted",
      title: "Muted",
      type: "boolean",
      initialValue: false,
      description: "Mute audio (required for autoplay on most browsers)",
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
        title: `${sourceName} Audio`,
        subtitle,
      };
    },
  },
};

export default elementAudio;
