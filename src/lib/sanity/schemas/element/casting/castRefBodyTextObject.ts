import { defineField, defineType } from "sanity";

const castRefBodyTextObject = defineType({
  name: "castRefBodyTextObject",
  title: "Cast Reference Body Text Object",
  type: "object",
  fields: [
    defineField({
      name: "ref",
      title: "Reference",
      type: "reference",
      to: [{ type: "elementTextBlock" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "casting",
      title: "Casting",
      type: "object",
      fields: [{ name: "dummy", type: "string", hidden: true }],
    }),
  ],
});

export default castRefBodyTextObject;
