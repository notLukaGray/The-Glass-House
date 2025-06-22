import { Rule } from "@sanity/types";

const contactForm = {
  name: "contactForm",
  title: "Contact Form",
  type: "object",
  fields: [
    {
      name: "headline",
      title: "Headline",
      type: "localeString",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "subhead",
      title: "Subhead",
      type: "localeString",
    },
    {
      name: "successMessage",
      title: "Success Message",
      type: "localeString",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "errorMessage",
      title: "Error Message",
      type: "localeString",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "fields",
      title: "Form Fields",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "type",
              title: "Field Type",
              type: "string",
              options: {
                list: [
                  { title: "Name", value: "name" },
                  { title: "Email", value: "email" },
                  { title: "Message", value: "message" },
                ],
              },
              validation: (rule: Rule) => rule.required(),
            },
            {
              name: "label",
              title: "Label",
              type: "localeString",
              validation: (rule: Rule) => rule.required(),
            },
            {
              name: "placeholder",
              title: "Placeholder",
              type: "localeString",
            },
            {
              name: "required",
              title: "Required",
              type: "boolean",
              initialValue: true,
            },
          ],
        },
      ],
      validation: (rule: Rule) => rule.required().min(1),
    },
  ],
};

export default contactForm;
