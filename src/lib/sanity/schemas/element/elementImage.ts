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
    alternativeTitle: "alternativeTitle",
    description: "description",
    subtitle: "title",
    usage: "usage",
    media: "imageUpload",
    imageSource: "imageSource",
    imageUrl: "imageUrl",
  } as typeof base.preview.select & {
    imageSource: string;
    imageUrl: string;
  },
  prepare(selection: Record<string, unknown>) {
    const {
      title,
      alternativeTitle,
      description,
      usage,
      media,
      imageSource,
      imageUrl,
    } = selection as {
      title?: Record<string, string>;
      alternativeTitle?: Record<string, string>;
      description?: Record<string, string>;
      usage?: string;
      media?: unknown;
      imageSource?: string;
      imageUrl?: string;
    };

    // Get the best available title content
    const displayTitle =
      alternativeTitle?.en ||
      alternativeTitle?.es ||
      Object.values(alternativeTitle || {}).find((val) => val?.trim()) ||
      title?.en ||
      title?.es ||
      Object.values(title || {}).find((val) => val?.trim()) ||
      description?.en ||
      description?.es ||
      Object.values(description || {}).find((val) => val?.trim()) ||
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

export default base;
