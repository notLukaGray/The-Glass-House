import { createCastRefObject } from "./castRefObject";

const castRefImageObject = createCastRefObject({
  name: "castRefImageObject",
  to: [{ type: "elementImage" }],
  preview: {
    select: {
      title: "ref.title",
      imageUpload: "ref.imageUpload",
      subtitle: "ref._ref",
    },
    prepare({
      title,
      imageUpload,
      subtitle,
    }: {
      title: Record<string, string> | string;
      imageUpload?: { asset?: { _ref: string } };
      subtitle?: string;
    }) {
      let media = undefined;
      if (imageUpload && imageUpload.asset) {
        media = imageUpload;
      }
      return {
        title:
          typeof title === "string"
            ? title
            : title?.en || "No reference selected",
        media,
        subtitle: subtitle || "",
      };
    },
  },
});

export default castRefImageObject;
