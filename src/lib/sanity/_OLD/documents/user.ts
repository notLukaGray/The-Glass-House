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
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "string",
          validation: (rule: Rule) => rule.required(),
        },
      ],
    },
    {
      name: "avatarUrl",
      title: "Avatar URL",
      type: "url",
      description: "URL to the user's avatar image",
    },
    {
      name: "email",
      title: "Email",
      type: "email",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
      description: "A short biography or description",
    },
  ],
  preview: {
    select: {
      userName: "name.en",
      userAvatar: "avatarUrl",
    },
    prepare({
      userName,
      userAvatar,
    }: {
      userName?: string;
      userAvatar?: string;
    }) {
      return {
        title: userName || "User",
        media: userAvatar
          ? React.createElement("img", {
              src: userAvatar,
              alt: userName || "Avatar",
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
