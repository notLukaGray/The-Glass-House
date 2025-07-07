import { createCastingFields } from "../../objects/casting/sharedCastingFields";
import { Rule } from "@sanity/types";

const castRefDividerObject = {
  name: "castRefDividerObject",
  title: "Divider with Casting",
  type: "object",
  fields: [
    {
      name: "ref",
      title: "Divider Reference",
      type: "reference",
      to: [{ type: "elementDivider" }],
      description: "Reference to a divider element",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "casting",
      title: "Casting Variables",
      type: "object",
      fields: createCastingFields("element"),
      description: "Positioning and styling for this divider element",
    },
  ],
  preview: {
    select: {
      title: "ref.title",
      style: "ref.style",
      thickness: "ref.thickness",
    },
    prepare({
      title,
      style,
      thickness,
    }: {
      title?: Record<string, string>;
      style?: string;
      thickness?: number;
    }) {
      const displayTitle = title?.en || title?.es || "Untitled Divider";
      const styleInfo = style ? ` (${style})` : "";
      const thicknessInfo = thickness ? ` - ${thickness}px` : "";

      return {
        title: `${displayTitle}${styleInfo}${thicknessInfo}`,
        subtitle: "Divider Element",
      };
    },
  },
};

export default castRefDividerObject;
