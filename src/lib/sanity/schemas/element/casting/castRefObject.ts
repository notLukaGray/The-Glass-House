import { Rule } from "@sanity/types";
import CastRefInput from "../../../components/CastRefInput";

export function createCastRefObject({
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

const castRefObject = {
  name: "castRefObject",
  type: "object",
  components: { input: CastRefInput },
  fields: [
    {
      name: "ref",
      type: "reference",
      to: [
        { type: "elementImage" },
        // Add other element types as needed
      ],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "casting",
      type: "object",
      fields: [{ name: "dummy", type: "string", hidden: true }],
    },
  ],
  preview: {
    select: {
      title: "ref.title",
      imageUpload: "ref.imageUpload",
      subtitle: "ref.imageUrl",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare(value: Record<string, any>) {
      const title = value?.title;
      const imageUpload = value?.imageUpload;
      const subtitle = value?.subtitle;

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
};

export default castRefObject;
