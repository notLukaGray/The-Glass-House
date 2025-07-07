export const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "fr",
  "de",
  "ja",
  "zh",
] as const;

export const ELEMENT_TYPES = {
  elementTextSingleLine: "textSingleLine",
  elementTextBlock: "textBlock",
  elementRichText: "richText",
  elementImage: "image",
  elementSVG: "svg",
  elementButton: "button",
  elementDivider: "divider",
  elementWidget: "widget",
} as const;

export const ELEMENT_TITLES = {
  textSingleLine: "Single Line Text Element",
  textBlock: "Text Block Element",
  richText: "Rich Text Element",
  image: "Image Element",
  video: "Video Element",
  button: "Button Element",
  svg: "SVG Element",
  widget: "Widget Element",
  divider: "Divider Element",
  moduleHeroImage: "Hero Image Module",
} as const;

export const MODULE_TYPES = {
  moduleHeroImage: "heroImage",
  moduleTextBlock: "textBlock",
  moduleImage: "image",
  moduleDynamicBackground: "dynamicBackground",
} as const;
