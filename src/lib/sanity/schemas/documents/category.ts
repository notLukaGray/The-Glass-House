import { Rule } from "@sanity/types";

const category = {
  name: "category",
  title: "Category",
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

export default category;
