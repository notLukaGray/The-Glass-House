export interface BaseMetadata {
  title?: { [key: string]: string };
  description?: { [key: string]: string };
  alternativeTitle?: { [key: string]: string };
  customId?: string;
  sanityId?: string;
}

export interface GeneratedMetadata {
  ariaLabel: { [key: string]: string };
  customId: string;
}

export interface AutoGenerationConfig {
  elementType: string;
  ariaPrefix?: string;
  fallbackText?: string;
  maxCustomIdLength?: number;
  supportedLanguages?: readonly string[];
}

export const cleanDescriptionForAria = (description: string): string => {
  return description
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 100);
};

export const cleanTitleForAltText = (title: string): string => {
  return title
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 50);
};

export const generateCustomId = (sanityId: string): string => {
  return sanityId
    .replace(/^[a-z0-9]+\./, "")
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 20);
};

export const generateAriaLabels = (
  element: Record<string, unknown>,
  languages: string[] = ["en", "es", "fr", "de", "ja", "zh"],
): Record<string, string> => {
  const ariaLabels: Record<string, string> = {};
  const title = element.title as Record<string, string> | undefined;
  const description = element.description as Record<string, string> | undefined;

  languages.forEach((lang) => {
    let ariaText = "";

    if (title && title[lang]) {
      ariaText = title[lang];
    } else if (description && description[lang]) {
      ariaText = cleanDescriptionForAria(description[lang]);
    } else if (title && title.en) {
      ariaText = title.en;
    } else if (description && description.en) {
      ariaText = cleanDescriptionForAria(description.en);
    } else {
      ariaText = "Content";
    }

    ariaLabels[lang] = ariaText;
  });

  return ariaLabels;
};

export const generateAltText = (
  element: Record<string, unknown>,
  languages: string[] = ["en", "es", "fr", "de", "ja", "zh"],
): Record<string, string> => {
  const altTexts: Record<string, string> = {};
  const title = element.title as Record<string, string> | undefined;
  const description = element.description as Record<string, string> | undefined;

  languages.forEach((lang) => {
    let altText = "";

    if (title && title[lang]) {
      altText = cleanTitleForAltText(title[lang]);
    } else if (description && description[lang]) {
      altText = cleanDescriptionForAria(description[lang]);
    } else if (title && title.en) {
      altText = cleanTitleForAltText(title.en);
    } else if (description && description.en) {
      altText = cleanDescriptionForAria(description.en);
    } else {
      altText = "Content";
    }

    altTexts[lang] = altText;
  });

  return altTexts;
};

export const generateAllMetadata = (
  metadata: BaseMetadata,
  config: AutoGenerationConfig,
): GeneratedMetadata => {
  const { customId, sanityId } = metadata;
  const { supportedLanguages = ["en", "es", "fr", "de", "ja", "zh"] } = config;

  // Generate ARIA labels for all supported languages
  const ariaLabels: { [key: string]: string } = {};
  supportedLanguages.forEach((lang: string) => {
    ariaLabels[lang] = generateAriaLabels(metadata as Record<string, unknown>)[
      lang
    ];
  });

  return {
    ariaLabel: ariaLabels,
    customId: customId || generateCustomId(sanityId || ""),
  };
};

export const ELEMENT_CONFIGS = {
  image: {
    elementType: "image",
    ariaPrefix: "Image showing",
    fallbackText: "Image",
    maxCustomIdLength: 20,
    supportedLanguages: ["en", "es", "fr", "de", "ja", "zh"],
  },
  video: {
    elementType: "video",
    ariaPrefix: "Video showing",
    fallbackText: "Video",
    maxCustomIdLength: 20,
    supportedLanguages: ["en", "es", "fr", "de", "ja", "zh"],
  },
  audio: {
    elementType: "audio",
    ariaPrefix: "Audio of",
    fallbackText: "Audio",
    maxCustomIdLength: 20,
    supportedLanguages: ["en", "es", "fr", "de", "ja", "zh"],
  },
  text: {
    elementType: "text",
    ariaPrefix: "Text content",
    fallbackText: "Text",
    maxCustomIdLength: 20,
    supportedLanguages: ["en", "es", "fr", "de", "ja", "zh"],
  },
  button: {
    elementType: "button",
    ariaPrefix: "Button",
    fallbackText: "Button",
    maxCustomIdLength: 20,
    supportedLanguages: ["en", "es", "fr", "de", "ja", "zh"],
  },
  moduleHeroImage: {
    elementType: "moduleHeroImage",
    ariaPrefix: "Module: ",
    fallbackText: "Hero Image Module",
    maxCustomIdLength: 20,
    supportedLanguages: ["en", "es", "fr", "de", "ja", "zh"],
  },
  // Add more element types as needed
} as const;

export const generateImageMetadata = (
  metadata: BaseMetadata,
): GeneratedMetadata => {
  return generateAllMetadata(metadata, ELEMENT_CONFIGS.image);
};

export const generateVideoMetadata = (
  metadata: BaseMetadata,
): GeneratedMetadata => {
  return generateAllMetadata(metadata, ELEMENT_CONFIGS.video);
};

export const generateAudioMetadata = (
  metadata: BaseMetadata,
): GeneratedMetadata => {
  return generateAllMetadata(metadata, ELEMENT_CONFIGS.audio);
};

export const generateElementMetadata = (
  metadata: BaseMetadata,
  elementType: keyof typeof ELEMENT_CONFIGS,
): GeneratedMetadata => {
  const config = ELEMENT_CONFIGS[elementType];
  return generateAllMetadata(metadata, config);
};
