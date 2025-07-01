export function getLocalizedContent(
  content: Record<string, string> | undefined,
  language: string,
  fallbackLanguage: string = "en",
): string {
  if (!content) return "";

  // Try requested language first
  if (content[language]) {
    return content[language];
  }

  // Fallback to specified fallback language
  if (content[fallbackLanguage]) {
    return content[fallbackLanguage];
  }

  // Last resort: return first available content
  const firstContent = Object.values(content)[0];
  return firstContent || "";
}

export function pickLocale<T = string>(
  field: Record<string, T> | undefined,
  language: string,
  fallbackLanguage: string = "en",
): T | undefined {
  if (!field) return undefined;

  // Try requested language first
  if (field[language] !== undefined) {
    return field[language];
  }

  // Fallback to specified fallback language
  if (field[fallbackLanguage] !== undefined) {
    return field[fallbackLanguage];
  }

  // Last resort: return first available content
  const firstValue = Object.values(field)[0];
  return firstValue;
}

export function getAvailableLanguages(
  content: Record<string, string> | undefined,
): string[] {
  if (!content) return [];
  return Object.keys(content).filter((key) => content[key]?.trim());
}

export function hasMultipleLanguages(
  content: Record<string, string> | undefined,
): boolean {
  return getAvailableLanguages(content).length > 1;
}

export function getBestLanguageMatch(
  userLanguages: string[],
  availableLanguages: string[],
  defaultLanguage: string = "en",
): string {
  // Try exact matches first
  for (const userLang of userLanguages) {
    if (availableLanguages.includes(userLang)) {
      return userLang;
    }
  }

  // Try language code matches (e.g., "en-US" matches "en")
  for (const userLang of userLanguages) {
    const langCode = userLang.split("-")[0];
    if (availableLanguages.includes(langCode)) {
      return langCode;
    }
  }

  // Fallback to default
  return availableLanguages.includes(defaultLanguage)
    ? defaultLanguage
    : availableLanguages[0] || "en";
}

export interface ProcessedModuleData {
  type: string;
  id: string;
  title?: string;
  description?: string;
  layout?: string;
  behavior?: string;
  theme?: string;
  content: Record<string, unknown>;
}

export function processModuleData(
  moduleData: Record<string, unknown> | null,
): ProcessedModuleData | null {
  if (!moduleData) return null;

  // Extract common module properties
  const {
    _type,
    _id,
    title,
    description,
    layout,
    behavior,
    theme,
    ...content
  } = moduleData;

  return {
    type: _type as string,
    id: _id as string,
    title: title as string | undefined,
    description: description as string | undefined,
    layout: layout as string | undefined,
    behavior: behavior as string | undefined,
    theme: theme as string | undefined,
    content: content as Record<string, unknown>,
  };
}

export function generateAriaLabel(
  title?: string,
  description?: string,
  type?: string,
): string {
  const parts = [];

  if (title) parts.push(title);
  if (description) parts.push(description);
  if (type) parts.push(`${type} section`);

  return parts.join(" - ") || "Content section";
}

export function getModuleClasses(
  layout?: string,
  behavior?: string,
  theme?: string,
): string {
  const classes = ["glass-module"];

  if (layout) classes.push(`layout-${layout}`);
  if (behavior) classes.push(`behavior-${behavior}`);
  if (theme) classes.push(`theme-${theme}`);

  return classes.join(" ");
}

export function validateModuleData(
  moduleData: Record<string, unknown> | null,
): boolean {
  if (!moduleData || typeof moduleData !== "object") return false;

  // Check for required fields
  const requiredFields = ["_type", "_id"];
  for (const field of requiredFields) {
    if (!(field in moduleData)) return false;
  }

  return true;
}

export function extractElementReferences(
  moduleData: Record<string, unknown> | null,
): string[] {
  if (!moduleData) return [];

  const references: string[] = [];

  // Recursively find all _ref fields
  function findRefs(obj: unknown): void {
    if (!obj || typeof obj !== "object") return;

    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (key === "_ref" && typeof value === "string") {
        references.push(value);
      } else if (Array.isArray(value)) {
        value.forEach(findRefs);
      } else if (typeof value === "object") {
        findRefs(value);
      }
    }
  }

  findRefs(moduleData);
  return references;
}
