import { Rule } from "@sanity/types";

export const element3D = {
  name: "element3D",
  title: "3D Model Element",
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
      title: "3D Model File",
      type: "file",
      options: {
        accept: ".glb,.gltf,.obj,.fbx,.dae,.stl,.ply",
      },
      description: "Upload a 3D model file (GLB, GLTF, OBJ, etc.)",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent?.source !== "upload",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { source } = context.document || {};
            if (source === "upload" && !value) {
              return "3D model file is required when using upload option";
            }
            return true;
          },
        ),
    },
    {
      name: "url",
      title: "3D Model URL",
      type: "url",
      description: "Direct URL to 3D model file (GLB, GLTF, OBJ, etc.)",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent?.source !== "url",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { source } = context.document || {};
            if (source === "url" && !value) {
              return "3D model URL is required when using custom URL source";
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
    // Display Settings
    {
      name: "autoRotate",
      title: "Auto Rotate",
      type: "boolean",
      initialValue: false,
      description: "Automatically rotate the 3D model",
    },
    {
      name: "showControls",
      title: "Show Controls",
      type: "boolean",
      initialValue: true,
      description: "Display 3D viewer controls",
    },
    {
      name: "enableZoom",
      title: "Enable Zoom",
      type: "boolean",
      initialValue: true,
      description: "Allow zooming in/out of the model",
    },
    {
      name: "enablePan",
      title: "Enable Pan",
      type: "boolean",
      initialValue: true,
      description: "Allow panning around the model",
    },
    // Advanced Options
    {
      name: "advancedOptions",
      title: "Advanced Options",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: "backgroundColor",
          title: "Background Color",
          type: "string",
          description: "Hex color for background (without #)",
          validation: (rule: Rule) =>
            rule
              .regex(/^[0-9A-Fa-f]{6}$/)
              .error(
                "Color must be a valid 6-digit hex code (e.g., FF5733, 582973)",
              ),
        },
        {
          name: "cameraPosition",
          title: "Camera Position",
          type: "object",
          fields: [
            {
              name: "x",
              title: "X",
              type: "number",
              initialValue: 0,
            },
            {
              name: "y",
              title: "Y",
              type: "number",
              initialValue: 0,
            },
            {
              name: "z",
              title: "Z",
              type: "number",
              initialValue: 5,
            },
          ],
          description: "Initial camera position",
        },
      ],
    },
  ],
  preview: {
    select: {
      source: "source",
      file: "file.asset.originalFilename",
      url: "url",
      autoRotate: "autoRotate",
      showControls: "showControls",
    },
    prepare({
      source,
      file,
      url,
      autoRotate,
      showControls,
    }: {
      source?: string;
      file?: string;
      url?: string;
      autoRotate?: boolean;
      showControls?: boolean;
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
      if (autoRotate) settings.push("Auto Rotate");
      if (!showControls) settings.push("No Controls");
      if (settings.length > 0) {
        subtitle += ` • ${settings.join(", ")}`;
      }

      return {
        title: `${sourceName} 3D Model`,
        subtitle,
      };
    },
  },
};

export default element3D;
