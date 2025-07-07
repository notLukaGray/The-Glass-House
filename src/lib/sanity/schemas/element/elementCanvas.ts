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

export const elementCanvasCastingFields = [
  {
    name: "sizeAndPosition",
    title: "Size & Position",
    type: "object",
    fields: [
      {
        name: "width",
        title: "Width",
        type: "object",
        fields: [
          { name: "value", title: "Value", type: "number" },
          {
            name: "unit",
            title: "Unit",
            type: "string",
            options: {
              list: [
                { title: "px", value: "px" },
                { title: "%", value: "%" },
              ],
            },
            initialValue: "px",
          },
        ],
      },
      {
        name: "height",
        title: "Height",
        type: "object",
        fields: [
          { name: "value", title: "Value", type: "number" },
          {
            name: "unit",
            title: "Unit",
            type: "string",
            options: {
              list: [
                { title: "px", value: "px" },
                { title: "%", value: "%" },
              ],
            },
            initialValue: "px",
          },
        ],
      },
      {
        name: "position",
        title: "Position",
        type: "object",
        fields: [
          {
            name: "x",
            title: "X",
            type: "object",
            fields: [
              { name: "value", title: "Value", type: "number" },
              {
                name: "unit",
                title: "Unit",
                type: "string",
                options: {
                  list: [
                    { title: "px", value: "px" },
                    { title: "%", value: "%" },
                  ],
                },
                initialValue: "px",
              },
            ],
          },
          {
            name: "y",
            title: "Y",
            type: "object",
            fields: [
              { name: "value", title: "Value", type: "number" },
              {
                name: "unit",
                title: "Unit",
                type: "string",
                options: {
                  list: [
                    { title: "px", value: "px" },
                    { title: "%", value: "%" },
                  ],
                },
                initialValue: "px",
              },
            ],
          },
        ],
      },
      {
        name: "aspectRatioLock",
        title: "Aspect Ratio Lock",
        type: "boolean",
        initialValue: false,
      },
      {
        name: "rotation",
        title: "Rotation",
        type: "number",
        min: -360,
        max: 360,
        step: 1,
        initialValue: 0,
      },
      {
        name: "scale",
        title: "Scale",
        type: "number",
        initialValue: 1.0,
        description: "Uniform scale (1.0 = 100%)",
      },
      {
        name: "alignment",
        title: "Alignment",
        type: "string",
        options: {
          list: [
            { title: "Top Left", value: "top-left" },
            { title: "Top Center", value: "top-center" },
            { title: "Top Right", value: "top-right" },
            { title: "Center Left", value: "center-left" },
            { title: "Center", value: "center" },
            { title: "Center Right", value: "center-right" },
            { title: "Bottom Left", value: "bottom-left" },
            { title: "Bottom Center", value: "bottom-center" },
            { title: "Bottom Right", value: "bottom-right" },
          ],
        },
        initialValue: "center",
      },
    ],
  },
  // Display & Transform Segment
  {
    name: "displayAndTransform",
    title: "Display & Transform",
    type: "object",
    fields: [
      {
        name: "opacity",
        title: "Opacity",
        type: "number",
        min: 0,
        max: 100,
        step: 1,
        initialValue: 100,
        description: "Opacity percentage (0-100)",
      },
      {
        name: "flipHorizontal",
        title: "Flip Horizontal",
        type: "boolean",
        initialValue: false,
        description: "Flip canvas horizontally",
      },
      {
        name: "flipVertical",
        title: "Flip Vertical",
        type: "boolean",
        initialValue: false,
        description: "Flip canvas vertically",
      },
      {
        name: "zIndex",
        title: "Z-Index",
        type: "number",
        initialValue: 0,
        description: "Stacking order",
      },
    ],
  },
];

export default elementCanvas;
