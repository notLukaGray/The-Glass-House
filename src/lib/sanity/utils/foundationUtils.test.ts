import {
  getEnabledLanguages,
  getAllLanguages,
  getDefaultLanguage,
  getFallbackLanguage,
} from "./foundationUtils";

jest.mock("@sanity/client", () => {
  return {
    createClient: jest.fn(() => ({
      fetch: jest.fn(async (query: string) => {
        if (query.includes("additionalLanguages")) {
          return {
            additionalLanguages: [
              { code: "en", name: "English", enabled: true, direction: "ltr" },
              { code: "es", name: "Spanish", enabled: true, direction: "ltr" },
              { code: "fr", name: "French", enabled: false, direction: "ltr" },
            ],
          };
        }
        if (query.includes("defaultLanguage")) {
          return { defaultLanguage: "en" };
        }
        if (query.includes("fallbackLanguage")) {
          return { fallbackLanguage: "es" };
        }
        return {};
      }),
    })),
  };
});

describe("foundationUtils", () => {
  it("getEnabledLanguages returns only enabled languages", async () => {
    const langs = await getEnabledLanguages();
    expect(langs).toEqual([
      { code: "en", name: "English", enabled: true, direction: "ltr" },
      { code: "es", name: "Spanish", enabled: true, direction: "ltr" },
    ]);
  });

  it("getAllLanguages returns all languages", async () => {
    const langs = await getAllLanguages();
    expect(langs).toEqual([
      { code: "en", name: "English", enabled: true, direction: "ltr" },
      { code: "es", name: "Spanish", enabled: true, direction: "ltr" },
      { code: "fr", name: "French", enabled: false, direction: "ltr" },
    ]);
  });

  it("getDefaultLanguage returns the default language", async () => {
    const lang = await getDefaultLanguage();
    expect(lang).toBe("en");
  });

  it("getFallbackLanguage returns the fallback language", async () => {
    const lang = await getFallbackLanguage();
    expect(lang).toBe("es");
  });
});
