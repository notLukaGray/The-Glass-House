import { createBaseElementSchema } from "./baseElementSchema";
import { Rule } from "@sanity/types";

const base = createBaseElementSchema(
  "elementVideo",
  "Video Element",
  "video",
  [
    {
      name: "videoSource",
      title: "Video Source",
      type: "string",
      options: {
        list: [
          { title: "Upload Video", value: "upload" },
          { title: "External URL", value: "external" },
        ],
        layout: "radio",
      },
      validation: (rule: Rule) => rule.required(),
      fieldset: "content",
    },
    {
      name: "sanityVideo",
      title: "Upload Video",
      type: "file",
      options: {
        accept: "video/*",
      },
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent &&
        typeof parent === "object" &&
        (parent as Record<string, unknown>).videoSource !== "upload",
      fieldset: "content",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { videoSource } = context.document || {};
            if (videoSource === "upload" && !value) {
              return "Video is required when using upload option";
            }
            return true;
          },
        ),
    },
    {
      name: "externalUrl",
      title: "External Video URL",
      type: "url",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent &&
        typeof parent === "object" &&
        (parent as Record<string, unknown>).videoSource !== "external",
      fieldset: "content",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { videoSource } = context.document || {};
            if (videoSource === "external" && !value) {
              return "URL is required when using external option";
            }
            if (
              value &&
              typeof value === "string" &&
              !value.match(/^https?:\/\//)
            ) {
              return "URL must start with http:// or https://";
            }
            return true;
          },
        ),
    },
  ],
  [],
);

export default base;
