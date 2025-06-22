import { Rule } from "@sanity/types";

const skillsSection = {
  name: "skillsSection",
  title: "Skills Section",
  type: "object",
  fields: [
    {
      name: "items",
      title: "Skills",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Skill Name",
              type: "localeString",
              validation: (rule: Rule) => rule.required(),
            },
            { name: "description", title: "Description", type: "string" },
            {
              name: "icon",
              title: "Icon",
              type: "reference",
              to: [{ type: "assetSVG" }],
            },
          ],
          preview: {
            select: {
              name: "name",
            },
            prepare({ name }: { name?: { en?: string } }) {
              const displayTitle = (name && name.en) || name || "Untitled";
              return {
                title: displayTitle,
              };
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      items: "items",
    },
    prepare() {
      return {
        title: "Skills Section Component",
      };
    },
  },
};

export default skillsSection;
