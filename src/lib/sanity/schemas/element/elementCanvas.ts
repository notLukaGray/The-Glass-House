import { Rule } from "@sanity/types";

export const elementCanvas = {
  name: "elementCanvas",
  title: "Canvas Element",
  type: "object",
  fields: [
    {
      name: "url",
      title: "Canvas URL",
      type: "url",
      description: "URL to HTML canvas content or canvas-based application",
      validation: (rule: Rule) =>
        rule.required().custom((value: unknown) => {
          if (
            value &&
            typeof value === "string" &&
            !value.match(/^https?:\/\//)
          ) {
            return "URL must start with http:// or https://";
          }
          return true;
        }),
    },
    {
      name: "width",
      title: "Width",
      type: "number",
      description: "Canvas width in pixels",
      initialValue: 800,
      validation: (rule: Rule) => rule.min(100).max(2000),
    },
    {
      name: "height",
      title: "Height",
      type: "number",
      description: "Canvas height in pixels",
      initialValue: 600,
      validation: (rule: Rule) => rule.min(100).max(2000),
    },
    {
      name: "responsive",
      title: "Responsive",
      type: "boolean",
      initialValue: true,
      description: "Make canvas responsive to container width",
    },
    {
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      options: {
        list: [
          { title: "16:9", value: "16/9" },
          { title: "4:3", value: "4/3" },
          { title: "1:1", value: "1/1" },
          { title: "3:2", value: "3/2" },
          { title: "Custom", value: "custom" },
        ],
      },
      initialValue: "16/9",
      description: "Aspect ratio for responsive canvas",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        !parent?.responsive,
    },
    {
      name: "customAspectRatio",
      title: "Custom Aspect Ratio",
      type: "string",
      description: "Custom aspect ratio (e.g., '21/9' for ultrawide)",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent?.aspectRatio !== "custom",
      validation: (rule: Rule) =>
        rule.regex(/^\d+\/\d+$/).error("Must be in format 'width/height'"),
    },
  ],
  preview: {
    select: {
      url: "url",
      width: "width",
      height: "height",
      responsive: "responsive",
    },
    prepare({
      url,
      width,
      height,
      responsive,
    }: {
      url?: string;
      width?: number;
      height?: number;
      responsive?: boolean;
    }) {
      const title = "Canvas Element";
      let subtitle = "";

      if (url) {
        subtitle = url.length > 30 ? url.substring(0, 30) + "..." : url;
      } else {
        subtitle = "No URL configured";
      }

      if (width && height) {
        subtitle += ` • ${width}×${height}`;
      }

      if (responsive) {
        subtitle += " • Responsive";
      }

      return {
        title,
        subtitle,
      };
    },
  },
};

export default elementCanvas;
