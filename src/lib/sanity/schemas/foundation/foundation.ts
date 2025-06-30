import { Rule } from "@sanity/types";

const foundation = {
  name: "foundation",
  title: "Foundation Settings",
  type: "document",
  description: "Core system settings and configuration",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Foundation Settings",
      readOnly: true,
      hidden: true,
    },
    {
      name: "localization",
      title: "Localization",
      type: "object",
      description: "Configure languages and localization settings",
      fields: [
        {
          name: "defaultLanguage",
          title: "Default Language",
          type: "string",
          initialValue: "en",
          readOnly: true,
          description: "English is always the default language",
        },
        {
          name: "additionalLanguages",
          title: "Additional Languages",
          type: "array",
          description:
            "Add languages that will be available throughout the system",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "code",
                  title: "Language Code",
                  type: "string",
                  description: "ISO language code (e.g., es, fr, de)",
                  validation: (rule: Rule) =>
                    rule
                      .required()
                      .min(2)
                      .max(5)
                      .regex(/^[a-z]{2,5}$/)
                      .error("Language code must be 2-5 lowercase letters"),
                },
                {
                  name: "name",
                  title: "Language Name",
                  type: "string",
                  description:
                    "Display name of the language (e.g., Spanish, French)",
                  validation: (rule: Rule) =>
                    rule
                      .required()
                      .min(2)
                      .max(50)
                      .error("Language name must be 2-50 characters"),
                },
                {
                  name: "enabled",
                  title: "Enabled",
                  type: "boolean",
                  initialValue: true,
                  description: "Enable or disable this language",
                },
                {
                  name: "direction",
                  title: "Text Direction",
                  type: "string",
                  options: {
                    list: [
                      { title: "Left to Right (LTR)", value: "ltr" },
                      { title: "Right to Left (RTL)", value: "rtl" },
                    ],
                    layout: "radio",
                  },
                  initialValue: "ltr",
                  description: "Text direction for this language",
                },
              ],
              preview: {
                select: {
                  code: "code",
                  name: "name",
                  enabled: "enabled",
                },
                prepare({
                  code,
                  name,
                  enabled,
                }: {
                  code: string;
                  name: string;
                  enabled: boolean;
                }) {
                  return {
                    title: `${name} (${code})`,
                    subtitle: enabled ? "Enabled" : "Disabled",
                  };
                },
              },
            },
          ],
          validation: (rule: Rule) =>
            rule.custom(
              (languages: Array<{ code: string; enabled: boolean }>) => {
                if (!languages) return true;

                const enabledLanguages = languages.filter(
                  (lang) => lang.enabled,
                );
                const codes = enabledLanguages.map((lang) => lang.code);
                const uniqueCodes = [...new Set(codes)];

                if (codes.length !== uniqueCodes.length) {
                  return "Duplicate language codes are not allowed";
                }

                return true;
              },
            ),
        },
        {
          name: "fallbackLanguage",
          title: "Fallback Language",
          type: "string",
          description:
            "Language to use when content is not available in the requested language",
          initialValue: "en",
          options: {
            list: [{ title: "English", value: "en" }],
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare() {
      return {
        title: "Foundation Settings",
        subtitle: "System configuration and settings",
      };
    },
  },
};

export default foundation;
