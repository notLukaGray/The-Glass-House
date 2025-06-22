import { Rule } from "@sanity/types";
import React from "react";

const user = {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "localeString",
      validation: (rule: Rule) => rule.required(),
    },
    { name: "jobTitle", title: "Job Title", type: "localeString" },
    {
      name: "avatar",
      title: "Avatar",
      type: "reference",
      to: [{ type: "assetPhoto" }],
      description: "Reference to a photo asset for the user avatar.",
    },
    { name: "bio", title: "Bio", type: "blockContent" },
    {
      name: "social",
      title: "Links",
      type: "array",
      of: [{ type: "reference", to: [{ type: "website" }] }],
    },
  ],
  preview: {
    select: {
      title: "name.en",
      media: "avatar.asset.url",
    },
    prepare({ title, media }: { title?: string; media?: string }) {
      return {
        title: title || "User",
        media: media
          ? React.createElement("img", {
              src: media,
              alt: title || "Avatar",
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              },
            })
          : undefined,
      };
    },
  },
};

export default user;
