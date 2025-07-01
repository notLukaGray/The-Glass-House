export const sizeAndPositionFields = [
  {
    name: "width",
    type: "object",
    fields: [
      { name: "value", type: "number" },
      {
        name: "unit",
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
    type: "object",
    fields: [
      { name: "value", type: "number" },
      {
        name: "unit",
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
    type: "object",
    fields: [
      {
        name: "x",
        type: "object",
        fields: [
          { name: "value", type: "number" },
          {
            name: "unit",
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
        type: "object",
        fields: [
          { name: "value", type: "number" },
          {
            name: "unit",
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
