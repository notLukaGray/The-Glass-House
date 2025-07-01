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
      // For rich text, we need to let Sanity render its built-in rich text editor
      // The glassLocaleRichText schema already has the proper field structure
      // We just need to show a placeholder that explains this should work
      return (
        <Card padding={3} border radius={2}>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Rich Text Editor for {language.name}
            </Text>
            <Text size={0} muted>
              This should render Sanity&apos;s built-in rich text editor with
              full functionality:
            </Text>
            <Stack space={1}>
              <Text size={0} muted>
                • Text formatting (bold, italic, underline, etc.)
              </Text>
              <Text size={0} muted>
                • Headings (H1-H6)
              </Text>
              <Text size={0} muted>
                • Links with target options
              </Text>
              <Text size={0} muted>
                • Block quotes
              </Text>
              <Text size={0} muted>
                • Code formatting
              </Text>
              <Text size={0} muted>
                • Automatic aria and alt text generation
              </Text>
            </Stack>
            <Card padding={3} border radius={1} tone="caution">
              <Text size={1}>
                The rich text editor should be rendered by Sanity&apos;s
                built-in field rendering. The glassLocaleRichText schema is
                correctly configured, but the component needs to be updated to
                not override the default Sanity rendering.
              </Text>
            </Card>
            <Text size={0} muted>
              Current value:{" "}
              {Array.isArray(currentValue)
                ? `${currentValue.length} blocks`
                : "No content"}
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
      {}
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
