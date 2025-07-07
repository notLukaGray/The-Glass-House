import { Rule } from "@sanity/types";

const workExperienceSection = {
  name: "workExperienceSection",
  title: "Work Experience Section",
  type: "object",
  fields: [
    {
      name: "items",
      title: "Work Experience",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "company",
              title: "Company",
              type: "localeString",
              validation: (rule: Rule) => rule.required(),
            },
            { name: "role", title: "Role", type: "localeString" },
            { name: "startYear", title: "Start Year", type: "string" },
            { name: "endYear", title: "End Year", type: "string" },
            { name: "description", title: "Description", type: "blockContent" },
            {
              name: "icon",
              title: "Icon",
              type: "reference",
              to: [{ type: "assetSVG" }],
            },
          ],
          preview: {
            select: {
              company: "company",
            },
            prepare({ company }: { company?: { en?: string } }) {
              const displayTitle =
                (company && company.en) || company || "Untitled";
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
        title: "Work Section Component",
      };
    },
  },
};

export default workExperienceSection;
