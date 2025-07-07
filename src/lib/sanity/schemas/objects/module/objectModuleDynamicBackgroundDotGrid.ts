import { Rule } from "@sanity/types";
import React from "react";

// Dot Grid Background Reference Object
export const dotGridBackgroundRefObject = {
  name: "dotGridBackgroundRefObject",
  title: "Dot Grid Background Reference",
  type: "object",
  description: "Configuration for interactive dot grid background",
  fields: [
    // Configuration Name
    {
      name: "name",
      title: "Configuration Name",
      type: "string",
      validation: (rule: Rule) => rule.required().max(50),
      description: "A descriptive name for this dot grid configuration",
    },
    // Description
    {
      name: "description",
      title: "Description",
      type: "text",
      description: "Brief description of what this configuration does",
    },
    // Dot Configuration
    {
      name: "dotConfig",
      title: "Dot Configuration",
      type: "object",
      fields: [
        {
          name: "dotSize",
          title: "Dot Size",
          type: "number",
          initialValue: 2,
          validation: (rule: Rule) => rule.min(1).max(20),
          description: "Size of each dot in pixels",
        },
        {
          name: "gap",
          title: "Gap Between Dots",
          type: "number",
          initialValue: 12,
          validation: (rule: Rule) => rule.min(4).max(50),
          description: "Space between dots in pixels",
        },
      ],
    },
    // Color Configuration
    {
      name: "colorConfig",
      title: "Color Configuration",
      type: "object",
      fields: [
        {
          name: "baseColor",
          title: "Base Color",
          type: "string",
          options: {
            list: [
              { title: "Theme Secondary", value: "theme.secondary" },
              { title: "Theme Primary", value: "theme.primary" },
              { title: "Theme Background", value: "theme.background" },
              { title: "Custom", value: "custom" },
            ],
          },
          initialValue: "theme.secondary",
          description: "Color for dots when not interacting",
        },
        {
          name: "customBaseColor",
          title: "Custom Base Color",
          type: "string",
          description: "Custom hex color (e.g., #000000)",
          validation: (rule: Rule) =>
            rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: "hex-color",
              invert: false,
            }),
          hidden: ({ parent }: { parent: Record<string, unknown> }) =>
            parent?.baseColor !== "custom",
        },
        {
          name: "activeColor",
          title: "Active Color",
          type: "string",
          options: {
            list: [
              { title: "Theme Accent", value: "theme.accent" },
              { title: "Theme Primary", value: "theme.primary" },
              { title: "Theme Secondary", value: "theme.secondary" },
              { title: "Custom", value: "custom" },
            ],
          },
          initialValue: "theme.accent",
          description: "Color for dots when interacting",
        },
        {
          name: "customActiveColor",
          title: "Custom Active Color",
          type: "string",
          description: "Custom hex color (e.g., #ff00ea)",
          validation: (rule: Rule) =>
            rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: "hex-color",
              invert: false,
            }),
          hidden: ({ parent }: { parent: Record<string, unknown> }) =>
            parent?.activeColor !== "custom",
        },
      ],
    },
    // Interaction Configuration
    {
      name: "interactionConfig",
      title: "Interaction Configuration",
      type: "object",
      fields: [
        {
          name: "proximity",
          title: "Proximity Radius",
          type: "number",
          initialValue: 120,
          validation: (rule: Rule) => rule.min(50).max(300),
          description: "Distance from cursor where dots start to react",
        },
        {
          name: "shockRadius",
          title: "Shock Radius",
          type: "number",
          initialValue: 250,
          validation: (rule: Rule) => rule.min(100).max(500),
          description: "Distance from click where dots get pushed",
        },
        {
          name: "shockStrength",
          title: "Shock Strength",
          type: "number",
          initialValue: 5,
          validation: (rule: Rule) => rule.min(1).max(20),
          description: "How far dots are pushed on click",
        },
        {
          name: "resistance",
          title: "Resistance",
          type: "number",
          initialValue: 750,
          validation: (rule: Rule) => rule.min(100).max(2000),
          description: "Resistance to movement (higher = slower)",
        },
        {
          name: "returnDuration",
          title: "Return Duration",
          type: "number",
          initialValue: 1.5,
          validation: (rule: Rule) => rule.min(0.5).max(5),
          description: "Time for dots to return to original position",
        },
        {
          name: "speedTrigger",
          title: "Speed Trigger",
          type: "number",
          initialValue: 100,
          validation: (rule: Rule) => rule.min(50).max(500),
          description: "Mouse speed threshold for triggering effects",
        },
        {
          name: "maxSpeed",
          title: "Max Speed",
          type: "number",
          initialValue: 5000,
          validation: (rule: Rule) => rule.min(1000).max(10000),
          description: "Maximum mouse speed for calculations",
        },
      ],
    },
    // Performance Configuration
    {
      name: "performanceConfig",
      title: "Performance Configuration",
      type: "object",
      fields: [
        {
          name: "throttleRate",
          title: "Throttle Rate (ms)",
          type: "number",
          initialValue: 50,
          validation: (rule: Rule) => rule.min(16).max(100),
          description: "Mouse event throttling for performance",
        },
        {
          name: "enableClickEffects",
          title: "Enable Click Effects",
          type: "boolean",
          initialValue: true,
          description: "Enable shock wave effects on click",
        },
        {
          name: "enableMouseTracking",
          title: "Enable Mouse Tracking",
          type: "boolean",
          initialValue: true,
          description: "Enable color changes on mouse proximity",
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      description: "description",
      dotSize: "dotConfig.dotSize",
      gap: "dotConfig.gap",
      baseColor: "colorConfig.baseColor",
      activeColor: "colorConfig.activeColor",
    },
    prepare({
      title,
      description,
      dotSize,
      gap,
      baseColor,
    }: {
      title?: string;
      description?: string;
      dotSize?: number;
      gap?: number;
      baseColor?: string;
    }) {
      return {
        title: title || "Untitled Dot Grid",
        subtitle: description || `Dots: ${dotSize || 2}px, Gap: ${gap || 12}px`,
        media: React.createElement("div", {
          style: {
            width: 40,
            height: 40,
            background: `radial-gradient(circle at 20px 20px, ${
              baseColor === "theme.accent" ? "#ff00ea" : "#666666"
            } 2px, transparent 2px)`,
            backgroundSize: `${(gap || 12) + (dotSize || 2)}px ${
              (gap || 12) + (dotSize || 2)
            }px`,
            borderRadius: "4px",
            border: "1px solid #e0e0e0",
          },
        }),
      };
    },
  },
};
