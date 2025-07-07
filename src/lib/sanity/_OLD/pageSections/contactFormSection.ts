import React from "react";

const ContactFormSection = {
  name: "contactFormSection",
  title: "Contact Form Section",
  type: "object",
  fields: [
    {
      name: "heading",
      title: "Heading",
      type: "string",
    },
    {
      name: "formFields",
      title: "Form Fields",
      type: "array",
      of: [{ type: "formField" }],
    },
  ],
  preview: {
    select: {
      heading: "heading",
      formFields: "formFields",
    },
    prepare({
      heading,
      formFields,
    }: {
      heading?: unknown;
      formFields?: unknown;
    }) {
      const displayTitle =
        (heading &&
          typeof heading === "object" &&
          "en" in heading &&
          (heading as { en?: string }).en) ||
        heading ||
        "Untitled";
      const firstField = Array.isArray(formFields) && formFields[0];
      const icon = firstField && firstField.icon;
      return {
        title: `Component: Contact Form Section | Title: ${displayTitle}`,
        media:
          icon && icon.svgData
            ? React.createElement("div", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                },
                dangerouslySetInnerHTML: {
                  __html: `<div style=\"width:100%;height:100%;display:flex;align-items:center;justify-content:center;\">${icon.svgData}</div>`,
                },
              })
            : undefined,
      };
    },
  },
};

export default ContactFormSection;
