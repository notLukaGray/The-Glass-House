const faqSection = {
  name: "faqSection",
  title: "FAQ/Accordion Section",
  type: "object",
  fields: [
    {
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "localeString" },
            { name: "answer", title: "Answer", type: "blockContent" },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      faqs: "faqs",
    },
    prepare({ faqs }: { faqs?: unknown }) {
      const displayTitle =
        (Array.isArray(faqs) &&
          faqs[0] &&
          typeof faqs[0] === "object" &&
          "question" in faqs[0] &&
          faqs[0].question &&
          typeof faqs[0].question === "object" &&
          "en" in faqs[0].question &&
          (faqs[0].question.en || faqs[0].question)) ||
        "Untitled";
      return {
        title: `Component: FAQ/Accordion Section | Title: ${displayTitle}`,
      };
    },
  },
};

export default faqSection;
