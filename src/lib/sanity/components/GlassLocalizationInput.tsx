import React from "react";
import { set, unset, PatchEvent } from "sanity";
import { Stack, Select, TextInput, Button, Card } from "@sanity/ui";

interface Language {
  code: string;
  name: string;
}

const LANGUAGES: Language[] = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
];

const LANGUAGE_CODES = ["en", ...LANGUAGES.map((l) => l.code)];

interface GlassLocalizationInputProps {
  value?: Record<string, string>;
  onChange: (patch: PatchEvent) => void;
  elementProps: {
    markers?: unknown[];
    presence?: unknown[];
    onBlur?: () => void;
    onFocus?: () => void;
    readOnly?: boolean;
    focusPath?: unknown[];
  };
  type?: {
    name?: string;
    title?: string;
    description?: string;
  };
  documentId?: string;
  fieldName?: string;
}

export const GlassLocalizationInput: React.FC<GlassLocalizationInputProps> = ({
  value = {},
  onChange,
  elementProps = {},
}) => {
  // Only show valid language codes (never _type or other system fields)
  const selectedLangs = Object.keys(value).filter(
    (k) => k !== "en" && LANGUAGE_CODES.includes(k),
  );

  // Only pass relevant props to inputs
  const inputProps = {
    readOnly: elementProps.readOnly,
    onBlur: elementProps.onBlur,
    onFocus: elementProps.onFocus,
  };

  // Handle English input
  const handleEnglishChange = (text: string) => {
    if (text.trim()) {
      onChange(PatchEvent.from(set(text, ["en"])));
    } else {
      onChange(PatchEvent.from(unset(["en"])));
    }
  };

  // Handle other language input
  const handleLangChange = (lang: string, text: string) => {
    if (text.trim()) {
      onChange(PatchEvent.from(set(text, [lang])));
    } else {
      onChange(PatchEvent.from(unset([lang])));
    }
  };

  // Handle add language
  const handleAddLang = (lang: string) => {
    if (!selectedLangs.includes(lang)) {
      onChange(PatchEvent.from(set("", [lang])));
    }
  };

  // Handle remove language
  const handleRemoveLang = (lang: string) => {
    onChange(PatchEvent.from(unset([lang])));
  };

  // Available languages for dropdown
  const availableLangs = LANGUAGES.filter(
    (l) => !selectedLangs.includes(l.code),
  );

  return (
    <Stack space={4} style={{ width: "100%" }}>
      {}
      <TextInput
        className="glass-localization-input"
        style={{ width: "100%" }}
        value={value.en || ""}
        onChange={(e) => handleEnglishChange(e.currentTarget.value)}
        placeholder="Enter English text..."
        aria-label="English"
        {...inputProps}
      />
      {}
      {selectedLangs.map((lang) => {
        const langInfo = LANGUAGES.find((l) => l.code === lang);
        if (!langInfo) return null;
        return (
          <div
            key={lang}
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Card
              padding={0}
              radius={2}
              shadow={0}
              border
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: "inherit",
                  border: "none",
                  outline: "none",
                  color: "inherit",
                  font: "inherit",
                  padding: "0.75em 1em",
                  height: "2.5em",
                }}
                value={value[lang] || ""}
                onChange={(e) => handleLangChange(lang, e.currentTarget.value)}
                placeholder={`Enter ${langInfo.name} text...`}
                aria-label={langInfo.name}
                disabled={elementProps?.readOnly}
              />
            </Card>
            <Button
              mode="ghost"
              tone="critical"
              size={0}
              style={{ marginLeft: "8px" }}
              onClick={() => handleRemoveLang(lang)}
              disabled={elementProps?.readOnly}
              text="Remove"
            />
          </div>
        );
      })}
      {availableLangs.length > 0 && (
        <Select
          value=""
          onChange={(e) => handleAddLang(e.currentTarget.value)}
          disabled={elementProps?.readOnly}
        >
          <option value="">Add language...</option>
          {availableLangs.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </Select>
      )}
    </Stack>
  );
};
