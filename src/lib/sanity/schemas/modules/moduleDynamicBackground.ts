import { createBaseModuleSchema } from "./baseModuleSchema";
import { Rule } from "@sanity/types";

const base = createBaseModuleSchema(
  "moduleDynamicBackground",
  "Dynamic Background Module",
  "dynamicBackground",
  [
    // Background Reference Objects (array)
    {
      name: "backgroundRefs",
      title: "Background Configurations",
      type: "array",
      of: [
        { type: "dotGridBackgroundRefObject" },
        // Future background objects can be added here:
        // { type: "particleBackgroundRefObject" },
        // { type: "videoBackgroundRefObject" },
        // { type: "waveBackgroundRefObject" },
      ],
      fieldset: "content",
      description: "Configure one or more background effects for this module",
      validation: (rule: Rule) => rule.min(1),
    },
    // Performance Configuration
    {
      name: "performanceConfig",
      title: "Performance Configuration",
      type: "object",
      fieldset: "content",
      fields: [
        {
          name: "performanceMode",
          title: "Performance Mode",
          type: "string",
          options: {
            list: [
              { title: "Low (Better Performance)", value: "low" },
              { title: "Balanced", value: "balanced" },
              { title: "High (Better Quality)", value: "high" },
            ],
          },
          initialValue: "balanced",
          description: "Performance vs quality tradeoff",
        },
        {
          name: "enableOnMobile",
          title: "Enable on Mobile",
          type: "boolean",
          initialValue: true,
          description: "Enable background effects on mobile devices",
        },
        {
          name: "reduceMotion",
          title: "Respect Reduced Motion",
          type: "boolean",
          initialValue: true,
          description: "Disable animations when user prefers reduced motion",
        },
      ],
    },
    // Layer Configuration
    {
      name: "layerConfig",
      title: "Layer Configuration",
      type: "object",
      fieldset: "content",
      fields: [
        {
          name: "blendMode",
          title: "Blend Mode",
          type: "string",
          options: {
            list: [
              { title: "Normal", value: "normal" },
              { title: "Multiply", value: "multiply" },
              { title: "Screen", value: "screen" },
              { title: "Overlay", value: "overlay" },
              { title: "Soft Light", value: "soft-light" },
              { title: "Hard Light", value: "hard-light" },
              { title: "Color Dodge", value: "color-dodge" },
              { title: "Color Burn", value: "color-burn" },
              { title: "Darken", value: "darken" },
              { title: "Lighten", value: "lighten" },
              { title: "Difference", value: "difference" },
              { title: "Exclusion", value: "exclusion" },
              { title: "Hue", value: "hue" },
              { title: "Saturation", value: "saturation" },
              { title: "Color", value: "color" },
              { title: "Luminosity", value: "luminosity" },
            ],
          },
          initialValue: "normal",
          description: "How this background blends with content behind it",
        },
        {
          name: "opacity",
          title: "Opacity",
          type: "number",
          initialValue: 1,
          min: 0,
          max: 1,
          step: 0.1,
          description: "Opacity of the background (0-1)",
        },
        {
          name: "zIndex",
          title: "Z-Index",
          type: "number",
          initialValue: 0,
          description: "Stacking order relative to other elements",
        },
      ],
    },
  ],
);

// Override the preview to show background configuration summary
base.preview = {
  select: {
    title: "title.en",
    description: "description.en",
    moduleType: "moduleType",
  },
  prepare({ title, ...rest }: { title?: string; [key: string]: unknown }) {
    // Find backgroundRefs in rest (Sanity passes all fields)
    const backgroundRefs = rest?.backgroundRefs;
    let backgroundSummary = "No backgrounds configured";
    if (Array.isArray(backgroundRefs) && backgroundRefs.length > 0) {
      backgroundSummary = backgroundRefs
        .map(
          (ref: {
            _type?: string;
            name?: string;
            dotConfig?: { dotSize?: number; gap?: number };
          }) => {
            if (ref._type === "dotGridBackgroundRefObject") {
              const dotSize = ref.dotConfig?.dotSize;
              const gap = ref.dotConfig?.gap;
              return `Dot Grid${ref.name ? `: ${ref.name}` : ""}${
                dotSize && gap ? ` (${dotSize}px/${gap}px)` : ""
              }`;
            }
            return ref.name || "Unknown Background";
          },
        )
        .join(", ");
    }
    return {
      title: title || "Untitled Background",
      subtitle: `Backgrounds: ${backgroundSummary}`,
    };
  },
};

export default base;

export const moduleDynamicBackgroundCastingFields = [
  {
    name: "display",
    title: "Display",
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
        name: "zIndex",
        title: "Z-Index",
        type: "number",
        initialValue: 0,
        description: "Stacking order",
      },
    ],
  },
  {
    name: "layout",
    title: "Layout",
    type: "object",
    fields: [
      {
        name: "position",
        title: "Position",
        type: "string",
        options: {
          list: [
            { title: "Fixed", value: "fixed" },
            { title: "Absolute", value: "absolute" },
            { title: "Relative", value: "relative" },
          ],
        },
        initialValue: "absolute",
        description: "Positioning method",
      },
      {
        name: "fullScreen",
        title: "Full Screen",
        type: "boolean",
        initialValue: true,
        description: "Cover the entire viewport",
      },
    ],
  },
];
