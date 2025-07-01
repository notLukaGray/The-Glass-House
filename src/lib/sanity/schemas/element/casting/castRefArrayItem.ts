import { defineField, defineType } from "sanity";

const castRefArrayItem = defineType({
  name: "castRefArrayItem",
  title: "Cast Reference Array Item",
  type: "object",
  fields: [
    defineField({
      name: "ref",
      title: "Reference",
      type: "reference",
      to: [{ type: "elementImage" }],
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

export default castRefArrayItem;
