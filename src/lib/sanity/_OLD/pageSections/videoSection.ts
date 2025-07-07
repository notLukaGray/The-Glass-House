import { Rule } from "@sanity/types";

const videoSection = {
  name: "videoSection",
  title: "Video Section",
  type: "object",
  fields: [
    {
      name: "video",
      title: "Video",
      type: "reference",
      to: [{ type: "assetVideo" }, { type: "asset3d" }],
      validation: (rule: Rule) => rule.required(),
      description: "Select a video asset to display.",
    },
    {
      name: "meta",
      title: "Meta",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: "titleDisplayMode",
          title: "Title Display Mode",
          type: "string",
          options: {
            list: [
              { title: "Don't Show Title", value: "none" },
              { title: "Below Video", value: "below" },
              { title: "Overlay - Top", value: "overlay-top" },
              { title: "Overlay - Bottom", value: "overlay-bottom" },
              { title: "Overlay - Center", value: "overlay-center" },
              { title: "Show on Hover (Centered)", value: "hover" },
            ],
          },
          initialValue: "below",
          description: "How to display the video title",
        },
        {
          name: "showCaption",
          title: "Show Caption",
          type: "boolean",
          initialValue: true,
          description: "Whether to display the video caption",
          hidden: ({ parent }: { parent: unknown }) =>
            (parent as Record<string, unknown>)?.titleDisplayMode === "none",
        },
        {
          name: "altDescription",
          title: "Alt Description",
          type: "localeString",
          description:
            "Overrides the asset description. Used for the video alt attribute (accessibility).",
        },
        {
          name: "altCaption",
          title: "Alt Caption",
          type: "localeString",
          description: "Overrides the asset caption. Shown below the video.",
        },
        {
          name: "linkUrl",
          title: "Link URL",
          type: "string",
          description:
            'Optional. Make the video a link. Example: "https://example.com"',
        },
        {
          name: "hideOnMobile",
          title: "Hide on Mobile",
          type: "boolean",
          description: "Hide this video on mobile screens.",
        },
        {
          name: "hideOnDesktop",
          title: "Hide on Desktop",
          type: "boolean",
          description: "Hide this video on desktop screens.",
        },
      ],
    },
    {
      name: "effects",
      title: "Effects",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: "hoverEffect",
          title: "Hover Effect",
          type: "string",
          options: { list: ["none", "zoom", "shadow", "colorShift", "blur"] },
          description: "Visual effect on hover.",
        },
        {
          name: "boxShadow",
          title: "Box Shadow",
          type: "string",
          options: {
            list: [
              { title: "None", value: "none" },
              { title: "Small", value: "sm" },
              { title: "Medium", value: "md" },
              { title: "Large", value: "lg" },
              { title: "XL", value: "xl" },
              { title: "2XL", value: "2xl" },
              { title: "3XL", value: "3xl" },
              { title: "4XL", value: "4xl" },
              { title: "5XL", value: "5xl" },
            ],
          },
          description: "Shadow style for the video.",
        },
        {
          name: "borderRadius",
          title: "Corner Rounding",
          type: "string",
          options: { list: ["none", "sm", "md", "lg", "xl", "full", "custom"] },
          description:
            'Corner rounding. Example: "lg" (large), "full" (circle).',
        },
        {
          name: "backgroundColor",
          title: "Background Color",
          type: "string",
          description:
            'Background color for the video container. Example: "#fff", "rgba(0,0,0,0.1)".',
        },
      ],
    },
    {
      name: "positioning",
      title: "Positioning",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: "fullBleed",
          title: "Full Bleed",
          type: "boolean",
          description:
            "If true, video stretches edge-to-edge (ignores page padding/margins).",
        },
        {
          name: "size",
          title: "Size",
          type: "string",
          options: {
            list: [
              { title: "Auto", value: "auto" },
              { title: "Small", value: "small" },
              { title: "Medium", value: "medium" },
              { title: "Large", value: "large" },
              { title: "XL", value: "xl" },
              { title: "2XL", value: "2xl" },
              { title: "3XL", value: "3xl" },
              { title: "4XL", value: "4xl" },
              { title: "5XL", value: "5xl" },
              { title: "6XL", value: "6xl" },
              { title: "7XL", value: "7xl" },
              { title: "Full Width", value: "full" },
              { title: "Custom", value: "custom" },
            ],
          },
          description:
            'Set the max width of the video. Example: "small" (320px), "medium" (384px), "large" (448px), "xl" (512px), "2xl" (576px), etc. Use "custom" with Width/Max Width for advanced sizing.',
          hidden: ({ parent }: { parent: unknown }) =>
            (parent as Record<string, unknown>)?.fullBleed,
        },
        {
          name: "width",
          title: "Width",
          type: "string",
          description:
            'Custom width (overrides size). Example: "300px", "50vw", "20rem".',
          hidden: ({ parent }: { parent: unknown }) =>
            (parent as Record<string, unknown>)?.fullBleed ||
            (parent as Record<string, unknown>)?.size !== "custom",
        },
        {
          name: "height",
          title: "Height",
          type: "string",
          description:
            'Custom height. Example: "200px", "30vh", "15rem". Leave blank for auto height.',
          hidden: ({ parent }: { parent: unknown }) =>
            (parent as Record<string, unknown>)?.fullBleed ||
            (parent as Record<string, unknown>)?.size !== "custom",
        },
        {
          name: "aspectRatio",
          title: "Aspect Ratio",
          type: "string",
          options: {
            list: ["auto", "16:9", "4:3", "1:1", "3:4", "9:16", "custom"],
          },
          description:
            'Set the aspect ratio of the video. Example: "16:9" for widescreen, "1:1" for square. Use "auto" for natural video ratio.',
        },
        {
          name: "alignment",
          title: "Alignment",
          type: "string",
          options: {
            list: ["left", "center", "right"],
          },
          description: "Align the video within the section.",
        },
        {
          name: "objectFit",
          title: "Object Fit",
          type: "string",
          options: {
            list: ["cover", "contain", "fill", "none", "scale-down"],
          },
          description: "How the video should fit within its container.",
        },
        {
          name: "maxWidth",
          title: "Max Width",
          type: "string",
          description: 'Maximum width for the video. Example: "1200px".',
        },
      ],
    },
    {
      name: "advanced",
      title: "Advanced",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: "marginTop",
          title: "Margin Top",
          type: "string",
          description: 'Top margin. Example: "2rem".',
        },
        {
          name: "marginBottom",
          title: "Margin Bottom",
          type: "string",
          description: 'Bottom margin. Example: "2rem".',
        },
        {
          name: "padding",
          title: "Padding",
          type: "string",
          description: 'Padding inside the video container. Example: "1rem".',
        },
      ],
    },
  ],
  preview: {
    select: {
      video: "video",
      title: "title",
      altCaption: "altCaption",
    },
    prepare({
      video,
      title,
      altCaption,
    }: {
      video?: unknown;
      title?: unknown;
      altCaption?: unknown;
    }) {
      const displayTitle =
        title ||
        (altCaption &&
          typeof altCaption === "object" &&
          "en" in altCaption &&
          (altCaption as { en?: string }).en) ||
        (video && typeof video === "object" && "_ref" in video && video._ref) ||
        "Untitled";
      return {
        title: `Component: Video Section | Title: ${displayTitle}`,
      };
    },
  },
};

export default videoSection;
