import { Rule } from "@sanity/types";
import { metaCoreFields } from "../../schemas/objects/core/metaCoreFields";
import React from "react";

interface PreviewProps {
  title?: string;
  media?: string;
}

const photoSchema = {
  name: "assetPhoto",
  title: "Photo Asset",
  type: "document",
  fields: [
    ...metaCoreFields,
    {
      name: "url",
      title: "Image URL",
      type: "url",
      validation: (rule: Rule) => rule.required(),
      description: "Direct CDN URL to the image file.",
    },
    {
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule: Rule) => rule.required(),
      description: "Order for drag-to-reorder in the Studio.",
    },
  ],
  preview: {
    select: {
      title: "title.en",
      media: "url",
    },
    prepare({ title, media }: PreviewProps) {
      return {
        title: title || "Photo",
        media: media
          ? React.createElement("img", {
              src: media,
              alt: title || "Preview",
              style: { width: "100%", height: "100%", objectFit: "cover" },
            })
          : undefined,
      };
    },
  },
};

export default photoSchema;
