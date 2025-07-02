import { Rule } from "@sanity/types";
import CastRefInput from "../../../components/CastRefInput";

export function createCastRefWingObject({
  name,
  to,
  preview,
}: {
  name: string;
  to: { type: string }[];
  preview: Record<string, unknown>;
}) {
  return {
    name,
    type: "object",
    components: { input: CastRefInput },
    fields: [
      {
        name: "ref",
        type: "reference",
        to,
        validation: (Rule: Rule) => Rule.required(),
      },
      {
        name: "casting",
        type: "object",
        fields: [{ name: "dummy", type: "string", hidden: true }],
      },
    ],
    preview,
  };
}

// Generic cast reference for any wing type
const castRefWingObject = createCastRefWingObject({
  name: "castRefWingObject",
  to: [
    { type: "wingsTestCasting" },
    // Add other wing types as needed
  ],
  preview: {
    select: {
      title: "ref.title",
      subtitle: "ref._ref",
    },
    prepare({
      title,
      subtitle,
    }: {
      title: Record<string, string> | string;
      subtitle?: string;
    }) {
      return {
        title:
          typeof title === "string"
            ? title
            : title?.en || "No reference selected",
        subtitle: subtitle || "",
      };
    },
  },
});

export default castRefWingObject;
