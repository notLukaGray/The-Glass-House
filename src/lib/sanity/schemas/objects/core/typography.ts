export const typographyObject = {
  name: "typography",
  title: "Typography Style",
  type: "object",
  fieldset: "typography",
  description:
    "Configure typography settings. If left empty, defaults will be applied in the frontend.",
  options: { collapsible: true, collapsed: true },
  fields: [
    {
      name: "fontSize",
      title: "Font Size",
      type: "string",
      initialValue: "text-base",
      options: {
        list: [
          { title: "Heading 1", value: "text-6xl" },
          { title: "Heading 2", value: "text-5xl" },
          { title: "Heading 3", value: "text-4xl" },
          { title: "Heading 4", value: "text-3xl" },
          { title: "Heading 5", value: "text-2xl" },
          { title: "Heading 6", value: "text-xl" },
          { title: "Large", value: "text-lg" },
          { title: "Body", value: "text-base" },
          { title: "Small", value: "text-sm" },
          { title: "Caption", value: "text-xs" },
        ],
      },
    },
    {
      name: "fontWeight",
      title: "Font Weight",
      type: "string",
      initialValue: "font-normal",
      options: {
        list: [
          { title: "Thin", value: "font-thin" },
          { title: "Normal", value: "font-normal" },
          { title: "Medium", value: "font-medium" },
          { title: "Semi Bold", value: "font-semibold" },
          { title: "Bold", value: "font-bold" },
          { title: "Extra Bold", value: "font-extrabold" },
        ],
      },
    },
    {
      name: "textAlign",
      title: "Text Alignment",
      type: "string",
      initialValue: "text-left",
      options: {
        list: [
          { title: "Left", value: "text-left" },
          { title: "Center", value: "text-center" },
          { title: "Right", value: "text-right" },
          { title: "Justify", value: "text-justify" },
        ],
      },
    },
    {
      name: "lineHeight",
      title: "Line Height",
      type: "string",
      initialValue: "leading-relaxed",
      options: {
        list: [
          { title: "Tight", value: "leading-tight" },
          { title: "Normal", value: "leading-normal" },
          { title: "Relaxed", value: "leading-relaxed" },
          { title: "Loose", value: "leading-loose" },
        ],
      },
    },
    {
      name: "altColor",
      title: "Alt Color",
      type: "string",
      initialValue: "primary",
      description:
        "Theme color (e.g., primary, secondary) or custom Tailwind class",
    },
  ],
};

export const typographyFieldset = {
  name: "typography",
  title: "Typography",
  options: { collapsible: true, collapsed: true },
};
