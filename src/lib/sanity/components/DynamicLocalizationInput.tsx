import React, { useEffect, useState } from "react";
import { set, unset, PatchEvent } from "sanity";
import { createClient } from "@sanity/client";
import { LanguageConfig } from "../utils/foundationUtils";

interface DynamicLocalizationInputProps {
  type: {
    name: string;
  };
  value?: Record<string, string>;
  onChange: (patch: PatchEvent) => void;
}

export const DynamicLocalizationInput: React.FC<
  DynamicLocalizationInputProps
> = ({ type, value = {}, onChange }) => {
  const [languages, setLanguages] = useState<LanguageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        setError(null);

        const client = createClient({
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
          apiVersion: "2024-01-01",
          useCdn: false,
        });

        const foundation = await client.fetch(`
          *[_type == "foundationLocalization"][0] {
            additionalLanguages
          }
        `);

        if (!foundation?.additionalLanguages) {
          // Default to English if no foundation settings found
          setLanguages([
            {
              code: "en",
              name: "English",
              enabled: true,
              direction: "ltr",
            },
          ]);
          setLoading(false);
          return;
        }

        const enabledLanguages = foundation.additionalLanguages
          .filter((lang: LanguageConfig) => lang.enabled)
          .map((lang: LanguageConfig) => ({
            code: lang.code,
            name: lang.name,
            enabled: lang.enabled,
            direction: lang.direction,
          }));

        // Always include English as the first language
        const englishLanguage = {
          code: "en",
          name: "English",
          enabled: true,
          direction: "ltr",
        };

        // Check if English is already in the list
        const hasEnglish = enabledLanguages.some(
          (lang: LanguageConfig) => lang.code === "en",
        );
        if (!hasEnglish) {
          enabledLanguages.unshift(englishLanguage);
        }

        setLanguages(enabledLanguages);
      } catch (err) {
        console.error("Error fetching foundation settings:", err);
        setError("Failed to load languages");
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
    };

    fetchLanguages();
  }, []);

  const handleLanguageChange = (languageCode: string, text: string) => {
    if (text.trim() === "") {
      // Remove the language field if empty
      onChange(PatchEvent.from(unset([languageCode])));
    } else {
      // Set the language field
      onChange(PatchEvent.from(set(text, [languageCode])));
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "1rem" }}>
        <div>Loading languages from foundation settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1rem", color: "red" }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
          {type?.name || "Localized Content"}
        </div>
        <div style={{ fontSize: "0.875rem", color: "#666" }}>
          Enter content for each language
        </div>
      </div>

      {languages.map((language) => (
        <div
          key={language.code}
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            backgroundColor: "#fafafa",
          }}
        >
          <label
            style={{
              display: "block",
              fontWeight: "500",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            {language.name} ({language.code})
            {language.code === "en" && (
              <span style={{ color: "#666", marginLeft: "0.5rem" }}>
                (Required)
              </span>
            )}
          </label>
          <textarea
            value={value[language.code] || ""}
            onChange={(e) =>
              handleLanguageChange(language.code, e.target.value)
            }
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "0.5rem",
              border: "1px solid #d0d0d0",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontFamily: "inherit",
              resize: "vertical",
            }}
            placeholder={`Enter ${language.name} content...`}
            required={language.code === "en"}
          />
        </div>
      ))}
    </div>
  );
};
