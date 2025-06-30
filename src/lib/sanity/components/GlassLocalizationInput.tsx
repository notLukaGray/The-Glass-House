import React, { useEffect, useState } from "react";
import { useClient, PatchEvent } from "sanity";
import { set, unset } from "sanity";
import { Stack, Text, Card, Flex } from "@sanity/ui";
import { LanguageConfig } from "../utils/foundationUtils";

// Types for Sanity block content
interface Span {
  _type: "span";
  text: string;
}
interface Block {
  _type: "block";
  children: Span[];
  style: string;
}

interface RichTextOptions {
  styles?: Array<{ title: string; value: string }>;
  marks?: {
    decorators?: Array<{ title: string; value: string }>;
    annotations?: Array<unknown>;
  };
  lists?: Array<{ title: string; value: string }>;
  imageOptions?: unknown;
  imageFields?: Array<unknown>;
}

interface GlassLocalizationInputProps {
  value?: Record<string, string | Block[]>;
  onChange: (patch: PatchEvent) => void;
  type?: {
    name?: string;
    title?: string;
    options?: {
      fieldType?: "string" | "text" | "richText";
      richTextOptions?: RichTextOptions;
    };
  };
  fieldType?: "string" | "text" | "richText";
}

export function GlassLocalizationInput(props: GlassLocalizationInputProps) {
  const { value = {}, onChange, type = {}, fieldType = "string" } = props;
  const client = useClient();
  const [languages, setLanguages] = useState<LanguageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine field type from type options or prop
  const actualFieldType = type.options?.fieldType || fieldType;

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

  const handleLanguageChange = (
    langCode: string,
    newValue: string | Block[],
  ) => {
    if (actualFieldType === "richText") {
      // For rich text, we handle arrays of blocks
      if (!newValue || (Array.isArray(newValue) && newValue.length === 0)) {
        onChange(PatchEvent.from([unset([langCode])]));
      } else {
        onChange(PatchEvent.from([set(newValue, [langCode])]));
      }
    } else {
      // For string and text fields
      if ((newValue as string).trim() === "") {
        onChange(PatchEvent.from([unset([langCode])]));
      } else {
        onChange(PatchEvent.from([set(newValue, [langCode])]));
      }
    }
  };

  if (loading) {
    return (
      <Card padding={3}>
        <Text>Loading languages from foundation settings...</Text>
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
        {type.title || "Localized Content"} (Glass Localization)
      </Text>
      <Text size={0} muted>
        Languages: {languages.map((lang) => lang.name).join(", ")}
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
            {actualFieldType === "richText" ? (
              <div>
                <Text
                  size={0}
                  muted
                  style={{ marginBottom: "8px", display: "block" }}
                >
                  Rich text editor for {language.name}
                </Text>
                {/* For now, we'll use a simple textarea as placeholder for rich text */}
                {/* In a full implementation, this would be replaced with a proper rich text editor */}
                <textarea
                  value={
                    Array.isArray(value[language.code])
                      ? (value[language.code] as Block[])
                          .map((block) =>
                            block._type === "block" && block.children
                              ? block.children
                                  .map((child) => child.text || "")
                                  .join("")
                              : "",
                          )
                          .join("\n")
                      : ""
                  }
                  onChange={(e) => {
                    // This is a simplified implementation - in reality, you'd want a proper rich text editor
                    const text = e.target.value;
                    if (text.trim() === "") {
                      handleLanguageChange(language.code, []);
                    } else {
                      // Create a simple block structure
                      const block: Block = {
                        _type: "block",
                        children: [{ _type: "span", text }],
                        style: "normal",
                      };
                      handleLanguageChange(language.code, [block]);
                    }
                  }}
                  placeholder={`Enter ${language.name} rich text content...`}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                />
                <Text
                  size={0}
                  muted
                  style={{ marginTop: "4px", display: "block" }}
                >
                  Note: This is a simplified rich text editor. Full rich text
                  editing will be implemented.
                </Text>
              </div>
            ) : actualFieldType === "string" ? (
              <input
                type="text"
                value={(value[language.code] as string) || ""}
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
                value={(value[language.code] as string) || ""}
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
