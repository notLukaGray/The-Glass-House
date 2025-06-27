export interface LocalizedString {
  [key: string]: string;
}

export interface LocalizedText {
  [key: string]: string;
}

export const getLocalizedText = (
  localizedContent: LocalizedString | LocalizedText | string | undefined,
  language: string = "en",
  fallbackLanguage: string = "en",
): string => {
  if (typeof localizedContent === "string") {
    return localizedContent;
  }

  if (!localizedContent || typeof localizedContent !== "object") {
    return "";
  }

  if (localizedContent[language]) {
    return localizedContent[language];
  }

  if (localizedContent[fallbackLanguage]) {
    return localizedContent[fallbackLanguage];
  }

  const availableLanguages = Object.keys(localizedContent).filter(
    (key) => key !== "_type",
  );
  if (availableLanguages.length > 0) {
    return localizedContent[availableLanguages[0]];
  }

  return "";
};

export const isEnglishContent = (content: unknown): boolean => {
  if (typeof content === "string") {
    return true;
  }

  if (content && typeof content === "object" && "en" in content) {
    return true;
  }

  return false;
};

export const getAvailableLanguages = (
  localizedObject: LocalizedString | LocalizedText | string | undefined,
): string[] => {
  if (!localizedObject || typeof localizedObject === "string") {
    return [];
  }

  return Object.keys(localizedObject);
};

export const hasLanguageContent = (
  localizedObject: LocalizedString | LocalizedText | string | undefined,
  language: string,
): boolean => {
  if (!localizedObject) return false;

  if (typeof localizedObject === "string") {
    return language === "en"; // Assume string content is English
  }

  return !!localizedObject[language];
};

export const getElementLocalizedMetadata = (
  element: Record<string, unknown>,
  language: string = "en",
  fallbackLanguage: string = "en",
) => {
  return {
    title: getLocalizedText(
      element.title as LocalizedString | LocalizedText | string | undefined,
      language,
      fallbackLanguage,
    ),
    description: getLocalizedText(
      element.description as
        | LocalizedString
        | LocalizedText
        | string
        | undefined,
      language,
      fallbackLanguage,
    ),
    alternativeTitle: getLocalizedText(
      element.alternativeTitle as
        | LocalizedString
        | LocalizedText
        | string
        | undefined,
      language,
      fallbackLanguage,
    ),
    caption: getLocalizedText(
      element.caption as LocalizedString | LocalizedText | string | undefined,
      language,
      fallbackLanguage,
    ),
    altText: getLocalizedText(
      element.altText as LocalizedString | LocalizedText | string | undefined,
      language,
      fallbackLanguage,
    ),
    ariaLabel: getLocalizedText(
      element.ariaLabel as LocalizedString | LocalizedText | string | undefined,
      language,
      fallbackLanguage,
    ),
    customId: (element.customId as string) || "",
  };
};

export const SUPPORTED_LANGUAGES = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  ko: "한국어",
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;
