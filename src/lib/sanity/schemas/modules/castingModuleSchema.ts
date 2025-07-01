// Casting mechanics for modules - how wings should treat/display modules

export const castingFields = [
  // Wing Requirements
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
    description: "How to align this module within the wing",
  },
  {
    name: "width",
    title: "Width",
    type: "string",
    options: {
      list: [
        { title: "Full Width", value: "full" },
        { title: "Container", value: "container" },
        { title: "Narrow", value: "narrow" },
        { title: "Auto", value: "auto" },
      ],
    },
    description: "Width constraint for this module within the wing",
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
      ],
    },
    description: "Height constraint for this module within the wing",
  },
  {
    name: "positioning",
    title: "Positioning",
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
    description: "CSS positioning for this module within the wing",
  },
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
      ],
    },
    description: "Margin around this module within the wing",
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
      ],
    },
    description: "Padding inside this module's container within the wing",
  },
  {
    name: "zIndex",
    title: "Z-Index",
    type: "number",
    description: "Stacking order for this module within the wing",
  },
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
    description: "How to handle content that overflows this module's bounds",
  },
  // Wing Values
  {
    name: "flexGrow",
    title: "Flex Grow",
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    initialValue: 0,
    description: "How much this module should grow relative to other modules",
  },
  {
    name: "flexShrink",
    title: "Flex Shrink",
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    initialValue: 1,
    description: "How much this module should shrink relative to other modules",
  },
  {
    name: "order",
    title: "Order",
    type: "number",
    description:
      "Display order of this module within the wing (lower numbers appear first)",
  },
  {
    name: "minWidth",
    title: "Minimum Width",
    type: "string",
    description: "Minimum width this module requires (e.g., '200px', '50%')",
  },
  {
    name: "maxWidth",
    title: "Maximum Width",
    type: "string",
    description:
      "Maximum width this module should have (e.g., '800px', '100%')",
  },
  {
    name: "minHeight",
    title: "Minimum Height",
    type: "string",
    description: "Minimum height this module requires (e.g., '100px', '50vh')",
  },
  {
    name: "maxHeight",
    title: "Maximum Height",
    type: "string",
    description:
      "Maximum height this module should have (e.g., '600px', '100vh')",
  },
];
