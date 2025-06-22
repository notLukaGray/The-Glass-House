import { Rule } from "@sanity/types";
import { metaCoreFields } from "../objects/metaCoreFields";
import React from "react";

interface PreviewProps {
  title?: string;
  media?: string;
}

const model3dSchema = {
  name: "asset3d",
  title: "3D Model Asset",
  type: "document",
  fields: [
    ...metaCoreFields,
    {
      name: "url",
      title: "3D Model URL",
      type: "url",
      validation: (rule: Rule) => rule.required(),
      description: "Direct CDN URL to the 3D model file.",
    },
    {
      name: "poster",
      title: "Poster Image URL",
      type: "url",
      description: "Optional poster image URL for the 3D model.",
    },
    {
      name: "format",
      title: "Format",
      type: "string",
      options: {
        list: [
          { title: "GLB", value: "glb" },
          { title: "GLTF", value: "gltf" },
          { title: "OBJ", value: "obj" },
          { title: "FBX", value: "fbx" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule: Rule) => rule.required(),
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
      media: "poster",
    },
    prepare({ title, media }: PreviewProps) {
      return {
        title: title || "3D Model",
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

export default model3dSchema;
