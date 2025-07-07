import { Rule } from "@sanity/types";

const tag = {
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule: Rule) => rule.required(),
    },
    { name: "description", title: "Description", type: "localeString" },
  ],
};

export default tag;
