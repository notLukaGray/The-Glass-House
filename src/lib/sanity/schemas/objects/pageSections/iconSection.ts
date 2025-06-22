import { Rule } from "@sanity/types";
import React from "react";

const iconSection = {
  name: "iconSection",
  title: "Icon Section",
  type: "object",
  fields: [
    {
      name: "icon",
      title: "Icon",
      type: "reference",
      to: [{ type: "assetSVG" }],
      validation: (rule: Rule) => rule.required(),
    },
    { name: "label", title: "Label", type: "localeString" },
  ],
  preview: {
    select: {
      label: "label",
      icon: "icon",
    },
    prepare({ label, icon }: { label?: unknown; icon?: unknown }) {
      const displayTitle =
        (label &&
          typeof label === "object" &&
          "en" in label &&
          (label as { en?: string }).en) ||
        label ||
        "Untitled";
      return {
        title: `Component: Icon Section | Title: ${displayTitle}`,
        media:
          icon &&
          typeof icon === "object" &&
          "svgData" in icon &&
          typeof (icon as { svgData?: string }).svgData === "string"
            ? React.createElement("div", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                },
                dangerouslySetInnerHTML: {
                  __html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${(icon as { svgData: string }).svgData}</div>`,
                },
              })
            : undefined,
      };
    },
  },
};

export default iconSection;
