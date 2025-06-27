import React from "react";
import { createBaseElementSchema } from "./baseElementSchema";
import { Rule } from "@sanity/types";

const base = createBaseElementSchema(
  "elementImage",
  "Image Element",
  "image",
  [
    // Image source selection
    {
      name: "imageSource",
      title: "Image Source",
      type: "string",
      options: {
        list: [
          { title: "Upload Image", value: "upload" },
          { title: "External URL", value: "external" },
        ],
        layout: "radio",
      },
      validation: (rule: Rule) => rule.required(),
      fieldset: "content",
    },
    // Sanity image upload
    {
      name: "sanityImage",
      title: "Upload Image",
      type: "image",
      options: {
        hotspot: true,
        accept: "image/*",
      },
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent &&
        typeof parent === "object" &&
        (parent as Record<string, unknown>).imageSource !== "upload",
      fieldset: "content",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { imageSource } = context.document || {};
            if (imageSource === "upload" && !value) {
              return "Image is required when using upload option";
            }
            return true;
          },
        ),
    },
    // External URL
    {
      name: "externalUrl",
      title: "External Image URL",
      type: "url",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent &&
        typeof parent === "object" &&
        (parent as Record<string, unknown>).imageSource !== "external",
      fieldset: "content",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { imageSource } = context.document || {};
            if (imageSource === "external" && !value) {
              return "URL is required when using external option";
            }
            if (
              value &&
              typeof value === "string" &&
              !value.match(/^https?:\/\//)
            ) {
              return "URL must start with http:// or https://";
            }
            return true;
          },
        ),
    },
  ],
  [],
);

// Override the preview to handle external URLs
base.preview = {
  select: {
    title: "title.en",
    alternativeTitle: "alternativeTitle.en",
    description: "description.en",
    subtitle: "subtitle",
    media: "sanityImage",
  },
  prepare(selection: Record<string, unknown>) {
    const { title, alternativeTitle, description, subtitle, media } =
      selection as {
        title?: string;
        alternativeTitle?: string;
        description?: string;
        subtitle?: string;
        media?: unknown;
      };

    // Get additional fields from the document context
    const imageSource = selection.imageSource as string | undefined;
    const externalUrl = selection.externalUrl as string | undefined;

    const displayTitle =
      alternativeTitle || title || description || "Untitled Image";

    let displaySubtitle = subtitle || "Image Element";
    let displayMedia = media;

    if (imageSource === "upload") {
      displaySubtitle = "Uploaded Image";
    } else if (imageSource === "external" && externalUrl) {
      displaySubtitle = externalUrl;
      displayMedia = React.createElement("img", {
        src: externalUrl,
        alt: displayTitle,
        style: { maxWidth: 80, maxHeight: 80, objectFit: "contain" },
        onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
          (e.target as HTMLImageElement).src = "";
        },
      });
    }

    return {
      title: displayTitle,
      subtitle: displaySubtitle,
      media: displayMedia,
    };
  },
};

export default base;
