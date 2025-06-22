import { Rule } from "@sanity/types";

const videoSection = {
  name: "videoSection",
  title: "Video Section",
  type: "object",
  fields: [
    {
      name: "video",
      title: "Video",
      type: "reference",
      to: [{ type: "assetVideo" }, { type: "asset3d" }],
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "showCaption",
      title: "Show Caption",
      type: "boolean",
      initialValue: false,
    },
    { name: "altCaption", title: "Alternative Caption", type: "localeString" },
    { name: "autoplay", title: "Autoplay", type: "boolean" },
    { name: "loop", title: "Loop", type: "boolean" },
  ],
  preview: {
    select: {
      video: "video",
      title: "title",
      altCaption: "altCaption",
    },
    prepare({
      video,
      title,
      altCaption,
    }: {
      video?: unknown;
      title?: unknown;
      altCaption?: unknown;
    }) {
      const displayTitle =
        title ||
        (altCaption &&
          typeof altCaption === "object" &&
          "en" in altCaption &&
          (altCaption as { en?: string }).en) ||
        (video && typeof video === "object" && "_ref" in video && video._ref) ||
        "Untitled";
      return {
        title: `Component: Video Section | Title: ${displayTitle}`,
      };
    },
  },
};

export default videoSection;
