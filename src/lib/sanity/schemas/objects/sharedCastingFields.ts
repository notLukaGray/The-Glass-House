export const sizeAndPositionFields = [
  // Minimal fallback fields for schema validity and basic UI
  {
    name: "width",
    type: "string",
    description: "Width (e.g. '100%', '800px')",
  },
  {
    name: "height",
    type: "string",
    description: "Height (e.g. '400px', '50vh')",
  },
  {
    name: "x",
    type: "string",
    description: "X Position (e.g. '0', '10px', '5%')",
  },
  {
    name: "y",
    type: "string",
    description: "Y Position (e.g. '0', '10px', '5%')",
  },
  { name: "aspectRatioLock", type: "boolean", initialValue: false },
  {
    name: "rotation",
    type: "number",
    min: -360,
    max: 360,
    step: 1,
    initialValue: 0,
  },
  {
    name: "scale",
    type: "number",
    initialValue: 1.0,
    description: "Uniform scale (1.0 = 100%)",
  },
  {
    name: "alignment",
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
];

export const displayAndTransformFields = [
  // Minimal fallback fields for schema validity and basic UI
  {
    name: "objectFit",
    type: "string",
    options: {
      list: [
        { title: "Fill", value: "fill" },
        { title: "Cover", value: "cover" },
        { title: "Contain", value: "contain" },
        { title: "Scale Down", value: "scale-down" },
        { title: "None", value: "none" },
      ],
    },
    initialValue: "cover",
    description: "How the image should fit its container",
  },
  {
    name: "opacity",
    type: "number",
    min: 0,
    max: 100,
    step: 1,
    initialValue: 100,
    description: "Opacity percentage (0-100)",
  },
  {
    name: "flipHorizontal",
    type: "boolean",
    initialValue: false,
    description: "Flip image horizontally",
  },
  {
    name: "flipVertical",
    type: "boolean",
    initialValue: false,
    description: "Flip image vertically",
  },
  {
    name: "zIndex",
    type: "number",
    initialValue: 0,
    description: "Stacking order",
  },
];

// New casting fields for layout composition (modules, wings, scaffolds)
export const layoutCompositionFields = [
  {
    name: "layout",
    type: "string",
    options: {
      list: [
        { title: "Stack", value: "stack" },
        { title: "Grid", value: "grid" },
        { title: "Flex", value: "flex" },
        { title: "Absolute", value: "absolute" },
        { title: "Masonry", value: "masonry" },
        { title: "Carousel", value: "carousel" },
      ],
    },
    initialValue: "stack",
    description: "How child items are arranged",
  },
  {
    name: "gap",
    type: "number",
    min: 0,
    max: 100,
    step: 1,
    initialValue: 16,
    description: "Spacing between child items",
  },
  {
    name: "direction",
    type: "string",
    options: {
      list: [
        { title: "Row", value: "row" },
        { title: "Column", value: "column" },
      ],
    },
    initialValue: "column",
    description: "Direction of flex layout",
  },
  {
    name: "wrap",
    type: "boolean",
    initialValue: false,
    description: "Whether items should wrap to next line",
  },
  {
    name: "columns",
    type: "number",
    min: 1,
    max: 12,
    step: 1,
    initialValue: 1,
    description: "Number of columns for grid layout",
  },
];

// Casting fields for positioning within parent (modules in wings, wings in scaffolds)
export const parentPositioningFields = [
  {
    name: "margin",
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
    initialValue: "none",
    description: "Margin around this item within parent",
  },
  {
    name: "customMargin",
    type: "string",
    description:
      "Custom margin value (e.g., '16px', '1rem') when margin is set to custom",
  },
  {
    name: "padding",
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
    initialValue: "none",
    description: "Padding inside this item's container within parent",
  },
  {
    name: "customPadding",
    type: "string",
    description:
      "Custom padding value (e.g., '16px', '1rem') when padding is set to custom",
  },
  {
    name: "flexGrow",
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    initialValue: 0,
    description: "How much this item should grow relative to siblings",
  },
  {
    name: "flexShrink",
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    initialValue: 1,
    description: "How much this item should shrink relative to siblings",
  },
  {
    name: "order",
    type: "number",
    initialValue: 0,
    description: "Display order (lower numbers appear first)",
  },
  {
    name: "overflow",
    type: "string",
    options: {
      list: [
        { title: "Visible", value: "visible" },
        { title: "Hidden", value: "hidden" },
        { title: "Scroll", value: "scroll" },
        { title: "Auto", value: "auto" },
      ],
    },
    initialValue: "visible",
    description: "How to handle content that overflows bounds",
  },
];

// Advanced casting fields for complex layouts
export const advancedCastingFields = [
  {
    name: "minWidth",
    type: "string",
    description: "Minimum width this item requires (e.g., '200px', '50%')",
  },
  {
    name: "maxWidth",
    type: "string",
    description: "Maximum width this item should have (e.g., '800px', '100%')",
  },
  {
    name: "minHeight",
    type: "string",
    description: "Minimum height this item requires (e.g., '100px', '50vh')",
  },
  {
    name: "maxHeight",
    type: "string",
    description:
      "Maximum height this item should have (e.g., '600px', '100vh')",
  },
  {
    name: "transform",
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
    initialValue: "none",
    description: "CSS transform to apply",
  },
  {
    name: "customTransform",
    type: "string",
    description: "Custom transform value when transform is set to custom",
  },
];

// Function to create casting fields for any level
export const createCastingFields = (
  level: "element" | "module" | "wing" | "scaffold",
) => {
  const fields = [];

  // All levels get size and position (now empty, handled by custom UI)
  fields.push({
    name: "sizeAndPosition",
    type: "object",
    fields: sizeAndPositionFields,
  });

  // All levels get display and transform (now empty, handled by custom UI)
  fields.push({
    name: "displayAndTransform",
    type: "object",
    fields: displayAndTransformFields,
  });

  // Modules, wings, and scaffolds get layout composition
  if (level !== "element") {
    fields.push({
      name: "layoutComposition",
      type: "object",
      fields: layoutCompositionFields,
    });
  }

  // Modules, wings, and scaffolds get parent positioning
  if (level !== "element") {
    fields.push({
      name: "parentPositioning",
      type: "object",
      fields: parentPositioningFields,
    });
  }

  // Wings and scaffolds get advanced casting
  if (level === "wing" || level === "scaffold") {
    fields.push({
      name: "advancedCasting",
      type: "object",
      fields: advancedCastingFields,
    });
  }

  return fields;
};

// Export individual field groups for backward compatibility
