import { Rule } from "@sanity/types";

const website = {
  name: "website",
  title: "Website/Platform",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Platform/Website Name",
      type: "string",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "url",
      title: "URL/Email/Phone",
      type: "string",
      validation: (rule: Rule) => rule.required(),
      description:
        "Enter a full URL (https://...), mailto: address, or tel: number.",
    },
    {
      name: "icon",
      title: "Icon",
      type: "reference",
      to: [{ type: "assetSVG" }],
    },
  ],
};

export default website;
