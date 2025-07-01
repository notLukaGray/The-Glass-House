import { createCastRefObject } from "./castRefObject";

const castRefHeadlineObject = createCastRefObject({
  name: "castRefHeadlineObject",
  to: [{ type: "elementTextSingleLine" }],
  preview: {
    select: {
      title: "ref.text",
      subtitle: "ref._ref",
    },
    prepare({
      title,
      subtitle,
    }: {
      title: Record<string, string> | string;
      subtitle?: string;
    }) {
      let displayTitle = "";
      if (typeof title === "string" && title) {
        displayTitle = title;
      } else if (title && typeof title === "object" && title.en) {
        displayTitle = title.en;
      } else {
        displayTitle = "No reference selected";
      }
      return {
        title: displayTitle,
        subtitle: subtitle || "",
      };
    },
  },
});

export default castRefHeadlineObject;
