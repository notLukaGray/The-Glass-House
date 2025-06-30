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
    ...createImageFields(
      "image",
      "Image",
      "Choose how to provide the image",
      "content",
    ),
  ],
  [],
);

// Override the preview to handle external URLs
base.preview = {
  select: {
    title: "title.en",
    alternativeTitle: "alternativeTitle.en",
    description: "description.en",
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
      media,
      imageSource,
      imageUrl,
    } = selection as {
      title?: string;
      alternativeTitle?: string;
      description?: string;
      media?: unknown;
      imageSource?: string;
      imageUrl?: string;
    };

    const displayTitle =
      alternativeTitle || title || description || "Untitled Image";

    let displaySubtitle = "Image Element";
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
