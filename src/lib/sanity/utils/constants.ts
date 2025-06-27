export const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "fr",
  "de",
  "ja",
  "zh",
] as const;

export const ELEMENT_TYPE_MAPPINGS = {
  elementTextSingleLine: "text",
  elementTextBlock: "textBlock",
  elementImage: "image",
  elementVideo: "video",
} as const;

export const ELEMENT_TITLES = {
  text: "Single Line Text",
  textBlock: "Text Block",
  image: "Image Element",
  video: "Video Element",
} as const;
