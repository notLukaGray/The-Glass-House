import { Rule } from "@sanity/types";
import CastRefInput from "../../../components/CastRefInput";

export function createCastRefModuleObject({
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

// Specific cast reference for hero image modules
const castRefHeroImageObject = createCastRefModuleObject({
  name: "castRefHeroImageObject",
  to: [{ type: "moduleHeroImage" }],
  preview: {
    select: {
      title: "ref.meta.moduleTitle",
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

// Generic cast reference for any module type
const castRefModuleObject = createCastRefModuleObject({
  name: "castRefModuleObject",
  to: [
    { type: "moduleHeroImage" },
    { type: "moduleTestCasting" },
    // Add other module types as needed
  ],
  preview: {
    select: {
      title: "ref.meta.moduleTitle",
      titleAlt: "ref.title",
      subtitle: "ref._ref",
    },
    prepare({
      title,
      titleAlt,
      subtitle,
    }: {
      title: Record<string, string> | string;
      titleAlt?: string;
      subtitle?: string;
    }) {
      const displayTitle = title || titleAlt;
      return {
        title:
          typeof displayTitle === "string"
            ? displayTitle
            : displayTitle?.en || "No reference selected",
        subtitle: subtitle || "",
      };
    },
  },
});

export default castRefModuleObject;
export { castRefHeroImageObject };
