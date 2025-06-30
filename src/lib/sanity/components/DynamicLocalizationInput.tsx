import React, { useEffect, useState } from "react";
import { useClient, PatchEvent } from "sanity";
import { set, unset } from "sanity";
import { Stack, Text, Card, Flex } from "@sanity/ui";
import { LanguageConfig } from "../utils/foundationUtils";

interface DynamicLocalizationInputProps {
  value?: Record<string, string>;
  onChange: (patch: PatchEvent) => void;
  type: {
    name: string;
    title: string;
  };
  fieldType: "string" | "text";
}

export function DynamicLocalizationInput(props: DynamicLocalizationInputProps) {
  const { value = {}, onChange, type, fieldType } = props;
  const client = useClient();
  const [languages, setLanguages] = useState<LanguageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        setLoading(true);
        const foundation = await client.fetch(`
          *[_type == "foundation"][0] {
            localization {
              additionalLanguages[] {
                code,
                name,
                enabled,
                direction
              }
            }
          }
        `);

        if (!foundation?.localization?.additionalLanguages) {
          // Default to English if no foundation settings found
          setLanguages([
            {
              code: "en",
              name: "English",
              enabled: true,
              direction: "ltr",
            },
          ]);
        } else {
          // Filter enabled languages and add English as default
          const enabledLanguages = foundation.localization.additionalLanguages
            .filter((lang: LanguageConfig) => lang.enabled)
            .map((lang: LanguageConfig) => ({
              ...lang,
              direction: lang.direction || "ltr",
            }));

          // Always include English as the first language
          const englishLanguage: LanguageConfig = {
            code: "en",
            name: "English",
            enabled: true,
            direction: "ltr",
          };

          setLanguages([englishLanguage, ...enabledLanguages]);
        }
      } catch (err) {
        console.error("Error fetching foundation settings:", err);
        setError("Failed to load language settings");
        // Fallback to English
        setLanguages([
          {
            code: "en",
            name: "English",
            enabled: true,
            direction: "ltr",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchLanguages();
  }, [client]);

  const handleLanguageChange = (langCode: string, newValue: string) => {
    if (newValue.trim() === "") {
      onChange(PatchEvent.from([unset([langCode])]));
    } else {
      onChange(PatchEvent.from([set(newValue, [langCode])]));
    }
  };

  if (loading) {
    return (
      <Card padding={3}>
        <Text>Loading languages...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card padding={3} tone="critical">
        <Text>{error}</Text>
      </Card>
    );
  }

  return (
    <Stack space={3}>
      <Text size={1} weight="semibold">
        {type.title}
      </Text>
      {languages.map((language) => (
        <Card key={language.code} padding={3} border radius={2}>
          <Stack space={2}>
            <Flex justify="space-between" align="center">
              <Text size={1} weight="medium">
                {language.name} ({language.code})
              </Text>
              {language.direction === "rtl" && (
                <Text size={0} style={{ color: "#f39c12" }}>
                  RTL
                </Text>
              )}
            </Flex>
            {fieldType === "string" ? (
              <input
                type="text"
                value={value[language.code] || ""}
                onChange={(e) =>
                  handleLanguageChange(language.code, e.target.value)
                }
                placeholder={`Enter ${language.name} text...`}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
            ) : (
              <textarea
                value={value[language.code] || ""}
                onChange={(e) =>
                  handleLanguageChange(language.code, e.target.value)
                }
                placeholder={`Enter ${language.name} text...`}
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            )}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
