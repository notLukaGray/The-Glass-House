import React from "react";
import {
  createBaseElementSchema,
  createImageFields,
} from "./baseElementSchema";

const base = createBaseElementSchema(
  "elementImage",
  "Image Element",
  "image",
  [
    // Usage field for categorization
    {
      name: "usage",
      title: "Usage",
      type: "string",
      options: {
        list: [
          { title: "General", value: "" },
          { title: "Hero Background", value: "hero-background" },
        ],
      },
      fieldset: "content",
      description:
        "What this image element is used for (helps with organization)",
    },
    ...createImageFields(
      "image",
      "Image",
      "Choose how to provide the image",
      "content",
    ),
  ],
  [],
);

// Override the preview to handle external URLs with fallback
base.preview = {
  select: {
    title: "title",
    alternativeTitle: "alternativeTitle", // Keep these to match base type
    description: "description",
    subtitle: "title",
    media: "imageUpload",
    imageSource: "imageSource",
    imageUrl: "imageUrl",
  } as typeof base.preview.select & {
    imageSource: string;
    imageUrl: string;
  },
  prepare(selection: Record<string, unknown>) {
    const { title, usage, media, imageSource, imageUrl } = selection as {
      title?: Record<string, string>;
      usage?: string;
      media?: unknown;
      imageSource?: string;
      imageUrl?: string;
    };

    // Get title content
    const displayTitle =
      title?.en ||
      Object.values(title || {}).find((val) => val?.trim()) ||
      "Untitled Image";

    let displaySubtitle = usage ? `${usage} - Image Element` : "Image Element";
    let displayMedia = media;

    if (imageSource === "upload") {
      displaySubtitle = "Uploaded Image";
    } else if (imageSource === "external" && imageUrl) {
      displaySubtitle = imageUrl;
      displayMedia = React.createElement("img", {
        src: imageUrl,
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

export const elementImageCastingFields = [
  {
    name: "sizeAndPosition",
    title: "Size & Position",
    type: "object",
    fields: [
      {
        name: "width",
        title: "Width",
        type: "object",
        fields: [
          { name: "value", title: "Value", type: "number" },
          {
            name: "unit",
            title: "Unit",
            type: "string",
            options: {
              list: [
                { title: "px", value: "px" },
                { title: "%", value: "%" },
              ],
            },
            initialValue: "px",
          },
        ],
      },
      {
        name: "height",
        title: "Height",
        type: "object",
        fields: [
          { name: "value", title: "Value", type: "number" },
          {
            name: "unit",
            title: "Unit",
            type: "string",
            options: {
              list: [
                { title: "px", value: "px" },
                { title: "%", value: "%" },
              ],
            },
            initialValue: "px",
          },
        ],
      },
      {
        name: "position",
        title: "Position",
        type: "object",
        fields: [
          {
            name: "x",
            title: "X",
            type: "object",
            fields: [
              { name: "value", title: "Value", type: "number" },
              {
                name: "unit",
                title: "Unit",
                type: "string",
                options: {
                  list: [
                    { title: "px", value: "px" },
                    { title: "%", value: "%" },
                  ],
                },
                initialValue: "px",
              },
            ],
          },
          {
            name: "y",
            title: "Y",
            type: "object",
            fields: [
              { name: "value", title: "Value", type: "number" },
              {
                name: "unit",
                title: "Unit",
                type: "string",
                options: {
                  list: [
                    { title: "px", value: "px" },
                    { title: "%", value: "%" },
                  ],
                },
                initialValue: "px",
              },
            ],
          },
        ],
      },
      {
        name: "aspectRatioLock",
        title: "Aspect Ratio Lock",
        type: "boolean",
        initialValue: false,
      },
      {
        name: "rotation",
        title: "Rotation",
        type: "number",
        min: -360,
        max: 360,
        step: 1,
        initialValue: 0,
      },
      {
        name: "scale",
        title: "Scale",
        type: "number",
        initialValue: 1.0,
        description: "Uniform scale (1.0 = 100%)",
      },
      {
        name: "alignment",
        title: "Alignment",
        type: "string",
        options: {
          list: [
            { title: "Top Left", value: "top-left" },
            { title: "Top Center", value: "top-center" },
            { title: "Top Right", value: "top-right" },
            { title: "Center Left", value: "center-left" },
            { title: "Center", value: "center" },
            { title: "Center Right", value: "center-right" },
            { title: "Bottom Left", value: "bottom-left" },
            { title: "Bottom Center", value: "bottom-center" },
            { title: "Bottom Right", value: "bottom-right" },
          ],
        },
        initialValue: "center",
      },
    ],
  },
  // Display & Transform Segment
  {
    name: "displayAndTransform",
    title: "Display & Transform",
    type: "object",
    fields: [
      {
        name: "objectFit",
        title: "Object Fit",
        type: "string",
        options: {
          list: [
            { title: "Fill", value: "fill" },
            { title: "Cover", value: "cover" },
            { title: "Contain", value: "contain" },
            { title: "Scale Down", value: "scale-down" },
            { title: "None", value: "none" },
          ],
        },
        initialValue: "cover",
        description: "How the image should fit its container",
      },
      {
        name: "opacity",
        title: "Opacity",
        type: "number",
        min: 0,
        max: 100,
        step: 1,
        initialValue: 100,
        description: "Opacity percentage (0-100)",
      },
      {
        name: "flipHorizontal",
        title: "Flip Horizontal",
        type: "boolean",
        initialValue: false,
        description: "Flip image horizontally",
      },
      {
        name: "flipVertical",
        title: "Flip Vertical",
        type: "boolean",
        initialValue: false,
        description: "Flip image vertically",
      },
      {
        name: "zIndex",
        title: "Z-Index",
        type: "number",
        initialValue: 0,
        description: "Stacking order",
      },
    ],
  },
];

export default base;
