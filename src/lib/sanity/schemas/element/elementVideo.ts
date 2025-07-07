import { createBaseElementSchema } from "./baseElementSchema";

export const elementVideo = createBaseElementSchema(
  "elementVideo",
  "Video Element",
  "video",
  [
    {
      name: "videos",
      title: "Video Sources",
      type: "array",
      of: [
        { type: "objectElementVideoEmbed" },
        { type: "objectElementVideoCDN" },
        { type: "objectElementVideoDirect" },
      ],
      description:
        "Add one or more video sources (first will be primary, others as fallbacks)",
      validation: (rule) => rule.min(1).max(3),
    },
    {
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      options: {
        list: [
          { title: "Auto (Natural)", value: "auto" },
          { title: "16:9 (Widescreen)", value: "16:9" },
          { title: "4:3 (Standard)", value: "4:3" },
          { title: "1:1 (Square)", value: "1:1" },
          { title: "3:4 (Portrait)", value: "3:4" },
          { title: "9:16 (Mobile)", value: "9:16" },
        ],
      },
      initialValue: "auto",
      description:
        "Force a specific aspect ratio (auto uses video's natural ratio)",
      fieldset: "content",
    },
    {
      name: "objectFit",
      title: "Object Fit",
      type: "string",
      options: {
        list: [
          { title: "Cover", value: "cover" },
          { title: "Contain", value: "contain" },
          { title: "Fill", value: "fill" },
          { title: "None", value: "none" },
          { title: "Scale Down", value: "scale-down" },
        ],
      },
      initialValue: "cover",
      description: "How the video should fit within its container",
      fieldset: "content",
    },
  ],
  [], // No additional metadata fields
  {
    subtitleField: "description.en",
    mediaField: "videos.0",
  },
);

export default elementVideo;
