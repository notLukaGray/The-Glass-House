export const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "fr",
  "de",
  "ja",
  "zh",
] as const;

export const ELEMENT_TYPE_MAPPINGS = {
  elementTextSingleLine: "textSingleLine",
  elementTextBlock: "textBlock",
  elementRichText: "richText",
  elementImage: "image",
  elementVideo: "video",
  elementButton: "button",
  elementSVG: "svg",
  moduleHeroImage: "moduleHeroImage",
} as const;

export const ELEMENT_TITLES = {
  textSingleLine: "Single Line Text Element",
  textBlock: "Text Block Element",
  richText: "Rich Text Element",
  image: "Image Element",
  video: "Video Element",
  button: "Button Element",
  svg: "SVG Element",
  moduleHeroImage: "Hero Image Module",
} as const;
