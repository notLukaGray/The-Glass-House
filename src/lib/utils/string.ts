export function sanitizeString(str: string | undefined): string | undefined {
  return typeof str === "string"
    ? str
        .replace(
          /[\u200B-\u200D\uFEFF\u202A-\u202E\u2060-\u206F\u00A0\u180E\u2000-\u200A]/g,
          "",
        )
        .trim()
    : str;
}
