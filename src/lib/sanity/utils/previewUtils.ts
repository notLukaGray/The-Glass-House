import { ELEMENT_TITLES } from "./constants";

interface PreviewConfig {
  titleField?: string;
  subtitleField?: string;
  mediaField?: string;
  elementType: string;
  customPrepare?: (params: Record<string, unknown>) => Record<string, unknown>;
}

export const createElementPreview = (config: PreviewConfig) => {
  const { titleField, subtitleField, mediaField, elementType, customPrepare } =
    config;

  const defaultSelect = {
    title: titleField || "title.en",
    alternativeTitle: "alternativeTitle.en",
    description: "description.en",
    subtitle: subtitleField,
    media: mediaField,
  };

  const defaultPrepare = ({
    title,
    alternativeTitle,
    description,
    subtitle,
    media,
  }: {
    title?: string;
    alternativeTitle?: string;
    description?: string;
    subtitle?: string;
    media?: unknown;
  }) => {
    const displayTitle =
      alternativeTitle || title || description || `Untitled ${elementType}`;

    return {
      title: displayTitle,
      subtitle:
        subtitle ||
        ELEMENT_TITLES[elementType as keyof typeof ELEMENT_TITLES] ||
        elementType,
      media: media,
    };
  };

  return {
    select: defaultSelect,
    prepare: customPrepare || defaultPrepare,
  };
};
