import { Rule } from "@sanity/types";
import { metaCoreFields } from "../objects/metaCoreFields";
import React from "react";

interface ParentType {
  sourceType?: string;
}

const videoSchema = {
  name: "assetVideo",
  title: "Video Asset",
  type: "document",
  fields: [
    ...metaCoreFields,
    {
      name: "sourceType",
      title: "Source Type",
      type: "string",
      options: {
        list: [
          { title: "Bunny Stream", value: "bunny" },
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
        ],
        layout: "radio",
      },
      initialValue: "bunny",
      validation: (rule: Rule) => rule.required(),
    },
    // Bunny Stream fields
    {
      name: "bunnyVideoUrl",
      title: "Bunny Video Direct Play URL",
      type: "url",
      description:
        "Direct Play URL from Bunny Video (e.g., https://iframe.mediadelivery.net/play/libraryId/videoGuid)",
      hidden: ({ parent }: { parent: ParentType }) =>
        parent?.sourceType !== "bunny",
      validation: (rule: Rule) => rule.required(),
    },
    // YouTube fields (for future)
    {
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      hidden: ({ parent }: { parent: ParentType }) =>
        parent?.sourceType !== "youtube",
    },
    // Vimeo fields (for future)
    {
      name: "vimeoUrl",
      title: "Vimeo URL",
      type: "url",
      hidden: ({ parent }: { parent: ParentType }) =>
        parent?.sourceType !== "vimeo",
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
      sourceType: "sourceType",
      bunnyVideoUrl: "bunnyVideoUrl",
      youtubeUrl: "youtubeUrl",
      vimeoUrl: "vimeoUrl",
    },
    prepare({
      title,
      sourceType,
      bunnyVideoUrl,
      youtubeUrl,
      vimeoUrl,
    }: {
      title?: string;
      sourceType?: string;
      bunnyVideoUrl?: string;
      youtubeUrl?: string;
      vimeoUrl?: string;
    }) {
      let url = "";
      if (sourceType === "bunny" && bunnyVideoUrl) {
        url = bunnyVideoUrl;
      } else if (sourceType === "youtube" && youtubeUrl) {
        url = youtubeUrl;
      } else if (sourceType === "vimeo" && vimeoUrl) {
        url = vimeoUrl;
      }

      return {
        title: title || "Video",
        subtitle: sourceType
          ? `${sourceType.charAt(0).toUpperCase() + sourceType.slice(1)} Video`
          : "Video",
        media: url
          ? React.createElement("img", {
              src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xOCAyNEwyOCAxOEwyOCAzMEwxOCAyNFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+",
              alt: title || "Video preview",
              style: { width: "100%", height: "100%", objectFit: "cover" },
            })
          : undefined,
      };
    },
  },
};

export default videoSchema;
