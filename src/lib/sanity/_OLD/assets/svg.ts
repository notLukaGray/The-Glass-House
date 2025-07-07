import { Rule } from "@sanity/types";
import { metaCoreFields } from "../../schemas/objects/core/metaCoreFields";
import React from "react";

const svgSchema = {
  name: "assetSVG",
  title: "SVG Asset",
  type: "document",
  fields: [
    ...metaCoreFields,
    {
      name: "svgData",
      title: "SVG Markup",
      type: "string",
      description: "Paste the SVG markup here.",
    },
    {
      name: "color",
      title: "Color Modifier",
      type: "string",
      description:
        "Optional color (hex, CSS, etc.) to use for this SVG on the frontend.",
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
      svgData: "svgData",
      color: "color",
    },
    prepare({
      title,
      svgData,
      color,
    }: {
      title?: string;
      svgData?: string;
      color?: string;
    }) {
      return {
        title: title || "SVG",
        subtitle: color ? `Color: ${color}` : undefined,
        media: svgData
          ? React.createElement("div", {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              },
              dangerouslySetInnerHTML: {
                __html: `<div style=\"width:100%;height:100%;display:flex;align-items:center;justify-content:center;\">${svgData}</div>`,
              },
            })
          : undefined,
      };
    },
  },
};

export default svgSchema;
