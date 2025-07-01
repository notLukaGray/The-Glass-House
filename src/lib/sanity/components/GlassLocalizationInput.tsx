import React, { useCallback } from "react";
import { set, unset } from "sanity";
import {
  Card,
  Stack,
  Text,
  TextInput,
  Flex,
  Badge,
  TextArea,
  Label,
  Inline,
} from "@sanity/ui";
import { useFoundation } from "./FoundationProvider";
import { LanguageConfig } from "../utils/foundationUtils";
import type { BlockContent } from "@/types/content";

interface GlassLocalizationInputProps {
  type: {
    name: string;
    title?: string;
  };
  value?: Record<string, string | BlockContent[]>;
  onChange: (patch: unknown) => void;
  options?: {
    fieldType?: "string" | "text" | "richText";
    richTextOptions?: {
      styles?: Array<{ title: string; value: string }>;
      marks?: {
        decorators?: Array<{ title: string; value: string }>;
        annotations?: Array<unknown>;
      };
    };
  };
}

export const GlassLocalizationInput: React.FC<GlassLocalizationInputProps> = ({
  type,
  value = {},
  onChange,
  options = {},
}) => {
  const { localization, loading, error } = useFoundation();
  const fieldType = options?.fieldType || "string";

  // Get the field title from the schema context
  const fieldTitle = type?.title || type?.name || "Localized Content";

  const handleLanguageChange = useCallback(
    (languageCode: string, content: string | BlockContent[]) => {
      if (fieldType === "string" || fieldType === "text") {
        const textContent = typeof content === "string" ? content : "";
        if (textContent.trim() === "") {
          // Remove the language field if empty
          onChange(unset([languageCode]));
        } else {
          // Set the language field
          onChange(set(textContent, [languageCode]));
        }
      } else if (fieldType === "richText") {
        // For rich text, we handle arrays of blocks
        if (!content || (Array.isArray(content) && content.length === 0)) {
          onChange(unset([languageCode]));
        } else {
          onChange(set(content, [languageCode]));
        }
      }
    },
    [onChange, fieldType],
  );

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
        <Text>Error: {error}</Text>
      </Card>
    );
  }

  if (!localization?.additionalLanguages) {
    return (
      <Card padding={3} tone="caution">
        <Text>
          No languages configured. Please set up localization in Foundation
          Settings.
        </Text>
      </Card>
    );
  }

  // Always include English as the base language, even if no additional languages are configured
  const languages: LanguageConfig[] = [];

  // Add English first
  languages.push({
    code: "en",
    name: "English",
    enabled: true,
    direction: "ltr" as const,
  });

  // Add additional languages if they exist and are enabled
  if (localization?.additionalLanguages) {
    const additionalLanguages = localization.additionalLanguages
      .filter((lang) => lang.enabled)
      .map((lang) => ({
        code: lang.code,
        name: lang.name,
        enabled: lang.enabled,
        direction: (lang.direction === "rtl" ? "rtl" : "ltr") as "ltr" | "rtl",
      }));

    // Add additional languages (excluding English if it's already in the list)
    additionalLanguages.forEach((lang) => {
      if (lang.code !== "en") {
        languages.push(lang);
      }
    });
  }

  // Render appropriate input based on field type
  const renderInput = (language: LanguageConfig) => {
    const currentValue = value[language.code];

    if (fieldType === "richText") {
      // For rich text, we need to use Sanity's block content input
      // This is a simplified version - in practice you might want to use a proper rich text editor
      return (
        <Card padding={3} border radius={2} tone="caution">
          <Stack space={2}>
            <Text size={1} muted>
              Rich text editor for {language.name} content
            </Text>
            <Text size={0} muted>
              (Rich text editing will be implemented with proper block content
              support)
            </Text>
          </Stack>
        </Card>
      );
    } else if (fieldType === "text") {
      // Multi-line text input using Sanity UI TextArea
      return (
        <TextArea
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={(e) =>
            handleLanguageChange(language.code, e.currentTarget.value)
          }
          placeholder={`Enter ${language.name} content...`}
          rows={4}
        />
      );
    } else {
      // Single line text input (default)
      return (
        <TextInput
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={(e) =>
            handleLanguageChange(language.code, e.currentTarget.value)
          }
          placeholder={`Enter ${language.name} content...`}
        />
      );
    }
  };

  return (
    <Stack space={4}>
      {/* Header section with field title and description */}
      <Stack space={2}>
        <Label size={1}>{fieldTitle}</Label>
        <Text size={1} muted>
          Enter content for each language
          {fieldType === "richText" && " (Rich text with formatting)"}
          {fieldType === "text" && " (Multi-line text)"}
          {fieldType === "string" && " (Single line text)"}
        </Text>
      </Stack>

      {languages.map((language) => (
        <Card key={language.code} padding={3} border radius={2}>
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <Inline space={2}>
                <Text weight="semibold" size={1}>
                  {language.name} ({language.code})
                </Text>
                {language.direction === "rtl" && (
                  <Badge tone="caution" mode="outline" fontSize={0}>
                    RTL
                  </Badge>
                )}
              </Inline>
            </Flex>

            {renderInput(language)}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};
