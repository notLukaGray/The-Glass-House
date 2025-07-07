const relatedSection = {
  name: "relatedSection",
  title: "Related Projects/Posts Section",
  type: "object",
  fields: [
    {
      name: "items",
      title: "Related Items",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "projectMeta" }, { type: "blogMeta" }],
        },
      ],
    },
    { name: "heading", title: "Heading", type: "localeString" },
  ],
  preview: {
    select: {
      heading: "heading",
    },
    prepare({ heading }: { heading?: unknown }) {
      const displayTitle =
        (heading &&
          typeof heading === "object" &&
          "en" in heading &&
          (heading as { en?: string }).en) ||
        heading ||
        "Untitled";
      return {
        title: `Component: Related Projects/Posts Section | Title: ${displayTitle}`,
      };
    },
  },
};

export default relatedSection;
