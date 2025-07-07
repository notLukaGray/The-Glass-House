import { z } from "zod";

export const TextSingleLineElementSchema = z.object({
  text: z.record(z.string()),
  usage: z.string().optional(),
  typography: z.record(z.any()).optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});

export const TextBlockElementSchema = z.object({
  text: z.record(z.string()),
  typography: z.record(z.any()).optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});

export const RichTextElementSchema = z.object({
  text: z.array(z.any()),
  typography: z.record(z.any()).optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});

export const ImageElementSchema = z.object({
  image: z.record(z.any()),
  alt: z.string().optional(),
  caption: z.string().optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});

export const VideoElementSchema = z.object({
  videos: z.array(z.any()),
  aspectRatio: z.string().optional(),
  objectFit: z.string().optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});

export const ButtonElementSchema = z.object({
  buttonText: z.record(z.string()),
  buttonType: z.string().optional(),
  url: z.string().optional(),
  imageSource: z.string().optional(),
  imageUrl: z.string().optional(),
  imageUpload: z.record(z.any()).optional(),
  svgIcon: z.string().optional(),
  svgColor: z.string().optional(),
  svgRecolor: z.string().optional(),
  contentType: z.string().optional(),
  mediaType: z.string().optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});

export const SVGElementSchema = z.object({
  svgSource: z.string(),
  svgFile: z.record(z.any()).optional(),
  svgString: z.string().optional(),
  color: z.string().optional(),
  recolor: z.string().optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});

export const AudioElementSchema = z.object({
  source: z.string(),
  file: z.record(z.any()).optional(),
  url: z.string().optional(),
  autoplay: z.boolean().optional(),
  controls: z.boolean().optional(),
  loop: z.boolean().optional(),
  muted: z.boolean().optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});

export const ThreeDElementSchema = z.object({
  source: z.string(),
  file: z.record(z.any()).optional(),
  url: z.string().optional(),
  autoRotate: z.boolean().optional(),
  showControls: z.boolean().optional(),
  enableZoom: z.boolean().optional(),
  enablePan: z.boolean().optional(),
  advancedOptions: z.record(z.any()).optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});

export const CanvasElementSchema = z.object({
  url: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  responsive: z.boolean().optional(),
  aspectRatio: z.string().optional(),
  customAspectRatio: z.string().optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});

export const DividerElementSchema = z.object({
  style: z.string().optional(),
  thickness: z.string().optional(),
  spacing: z.string().optional(),
  color: z.string().optional(),
  length: z.string().optional(),
  customWidth: z.string().optional(),
  customSVG: z.string().optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});

export const WidgetElementSchema = z.object({
  apiRefs: z.array(z.any()).optional(),
  refreshInterval: z.number().optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});
