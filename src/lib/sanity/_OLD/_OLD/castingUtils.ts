// Casting mechanics for elements - how modules should treat/display elements
// This is a "buff" to Sanity that enables better positioning and layout workflows

export interface CastingField {
  name: string;
  title: string;
  type: string;
  description?: string;
  options?: {
    list: Array<{ title: string; value: string }>;
  };
  min?: number;
  max?: number;
  step?: number;
  initialValue?: unknown;
}

// Core casting fields for positioning elements within modules
export const elementCastingFields: CastingField[] = [
  // Positioning
  {
    name: "position",
    title: "Position",
    type: "string",
    options: {
      list: [
        { title: "Static", value: "static" },
        { title: "Relative", value: "relative" },
        { title: "Absolute", value: "absolute" },
        { title: "Fixed", value: "fixed" },
        { title: "Sticky", value: "sticky" },
      ],
    },
    description: "CSS positioning for this element within the module",
  },
  {
    name: "alignment",
    title: "Alignment",
    type: "string",
    options: {
      list: [
        { title: "Left", value: "left" },
        { title: "Center", value: "center" },
        { title: "Right", value: "right" },
        { title: "Justify", value: "justify" },
      ],
    },
    description: "How to align this element within the module",
  },
  {
    name: "verticalAlignment",
    title: "Vertical Alignment",
    type: "string",
    options: {
      list: [
        { title: "Top", value: "top" },
        { title: "Center", value: "center" },
        { title: "Bottom", value: "bottom" },
        { title: "Stretch", value: "stretch" },
      ],
    },
    description: "Vertical alignment of this element within the module",
  },

  // Sizing
  {
    name: "width",
    title: "Width",
    type: "string",
    options: {
      list: [
        { title: "Auto", value: "auto" },
        { title: "Full Width", value: "full" },
        { title: "Container", value: "container" },
        { title: "Narrow", value: "narrow" },
        { title: "Custom", value: "custom" },
      ],
    },
    description: "Width constraint for this element within the module",
  },
  {
    name: "customWidth",
    title: "Custom Width",
    type: "string",
    description:
      "Custom width value (e.g., '200px', '50%') when width is set to custom",
  },
  {
    name: "height",
    title: "Height",
    type: "string",
    options: {
      list: [
        { title: "Auto", value: "auto" },
        { title: "Full Height", value: "full" },
        { title: "Large", value: "large" },
        { title: "Medium", value: "medium" },
        { title: "Small", value: "small" },
        { title: "Custom", value: "custom" },
      ],
    },
    description: "Height constraint for this element within the module",
  },
  {
    name: "customHeight",
    title: "Custom Height",
    type: "string",
    description:
      "Custom height value (e.g., '100px', '50vh') when height is set to custom",
  },

  // Spacing
  {
    name: "margin",
    title: "Margin",
    type: "string",
    options: {
      list: [
        { title: "None", value: "none" },
        { title: "Small", value: "small" },
        { title: "Medium", value: "medium" },
        { title: "Large", value: "large" },
        { title: "Auto", value: "auto" },
        { title: "Custom", value: "custom" },
      ],
    },
    description: "Margin around this element within the module",
  },
  {
    name: "customMargin",
    title: "Custom Margin",
    type: "string",
    description:
      "Custom margin value (e.g., '10px 20px') when margin is set to custom",
  },
  {
    name: "padding",
    title: "Padding",
    type: "string",
    options: {
      list: [
        { title: "None", value: "none" },
        { title: "Small", value: "small" },
        { title: "Medium", value: "medium" },
        { title: "Large", value: "large" },
        { title: "Custom", value: "custom" },
      ],
    },
    description: "Padding inside this element's container within the module",
  },
  {
    name: "customPadding",
    title: "Custom Padding",
    type: "string",
    description:
      "Custom padding value (e.g., '10px 20px') when padding is set to custom",
  },

  // Layout
  {
    name: "zIndex",
    title: "Z-Index",
    type: "number",
    description: "Stacking order for this element within the module",
  },
  {
    name: "order",
    title: "Order",
    type: "number",
    description:
      "Display order of this element within the module (lower numbers appear first)",
  },
  {
    name: "flexGrow",
    title: "Flex Grow",
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    initialValue: 0,
    description: "How much this element should grow relative to other elements",
  },
  {
    name: "flexShrink",
    title: "Flex Shrink",
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    initialValue: 1,
    description:
      "How much this element should shrink relative to other elements",
  },

  // Advanced
  {
    name: "overflow",
    title: "Overflow",
    type: "string",
    options: {
      list: [
        { title: "Visible", value: "visible" },
        { title: "Hidden", value: "hidden" },
        { title: "Scroll", value: "scroll" },
        { title: "Auto", value: "auto" },
      ],
    },
    description: "How to handle content that overflows this element's bounds",
  },
  {
    name: "transform",
    title: "Transform",
    type: "string",
    options: {
      list: [
        { title: "None", value: "none" },
        { title: "Scale Up", value: "scale-110" },
        { title: "Scale Down", value: "scale-90" },
        { title: "Rotate 90°", value: "rotate-90" },
        { title: "Rotate -90°", value: "-rotate-90" },
        { title: "Flip Horizontal", value: "-scale-x-100" },
        { title: "Flip Vertical", value: "-scale-y-100" },
        { title: "Custom", value: "custom" },
      ],
    },
    description: "CSS transform to apply to this element",
  },
  {
    name: "customTransform",
    title: "Custom Transform",
    type: "string",
    description: "Custom transform value when transform is set to custom",
  },
];
