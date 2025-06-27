import React, { useState, useEffect } from "react";
import { set, unset, PatchEvent } from "sanity";
import { Card, Stack, Text, Button, Checkbox, Flex, Badge } from "@sanity/ui";

const LANGS = [
  { code: "en", label: "English", required: true },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
];

interface LocalizedStringInputProps {
  value?: Record<string, string>;
  onChange: (patch: PatchEvent) => void;
}

export function LocalizedStringInput(props: LocalizedStringInputProps) {
  const { value = {}, onChange } = props;
  const [showOther, setShowOther] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  // Always show English
  useEffect(() => {
    if (!value?.en) {
      onChange(PatchEvent.from(set("", ["en"])));
    }
  }, [onChange, value?.en]);

  // Show other languages if any are filled
  useEffect(() => {
    const filled = LANGS.filter((l) => l.code !== "en" && value?.[l.code]);
    if (filled.length) {
      setShowOther(true);
      setSelected(filled.map((l) => l.code));
    }
  }, [value]);

  const handleChange = (lang: string, val: string) => {
    if (val === "") {
      onChange(PatchEvent.from(unset([lang])));
    } else {
      onChange(PatchEvent.from(set(val, [lang])));
    }
  };

  const toggleLang = (lang: string) => {
    if (selected.includes(lang)) {
      setSelected(selected.filter((l) => l !== lang));
      onChange(PatchEvent.from(unset([lang])));
    } else {
      setSelected([...selected, lang]);
      onChange(PatchEvent.from(set("", [lang])));
    }
  };

  return (
    <Stack space={4}>
      <Card padding={3} border radius={2} tone="primary">
        <Stack space={3}>
          <Flex align="center" gap={2}>
            <Badge tone="primary" mode="outline">
              Required
            </Badge>
            <Text weight="semibold" size={1}>
              English
            </Text>
          </Flex>
          <input
            type="text"
            value={value?.en || ""}
            onChange={(e) => handleChange("en", e.target.value)}
            placeholder="Enter English…"
            style={{ width: "100%", padding: 8 }}
          />
        </Stack>
      </Card>
      <Card padding={3} border radius={2}>
        <Stack space={3}>
          <Flex align="center" gap={2}>
            <Checkbox
              checked={showOther}
              onChange={(e) => {
                setShowOther(e.currentTarget.checked);
                if (!e.currentTarget.checked) {
                  setSelected([]);
                  LANGS.filter((l) => l.code !== "en").forEach((l) =>
                    onChange(PatchEvent.from(unset([l.code]))),
                  );
                }
              }}
            />
            <Text weight="semibold" size={1}>
              Add translations in other languages
            </Text>
          </Flex>
          {showOther && (
            <Stack space={3}>
              <Text size={0} muted>
                Select languages to add translations:
              </Text>
              <Flex wrap="wrap" gap={2}>
                {LANGS.filter((l) => l.code !== "en").map((l) => (
                  <Button
                    key={l.code}
                    mode={selected.includes(l.code) ? "default" : "ghost"}
                    size={0}
                    tone={selected.includes(l.code) ? "primary" : "default"}
                    onClick={() => toggleLang(l.code)}
                  >
                    {l.label}
                  </Button>
                ))}
              </Flex>
              {selected.map((lang) => (
                <Card key={lang} padding={3} border radius={2}>
                  <Stack space={3}>
                    <Flex align="center" justify="space-between">
                      <Text weight="semibold" size={1}>
                        {LANGS.find((l) => l.code === lang)?.label}
                      </Text>
                      <Button
                        mode="ghost"
                        size={0}
                        tone="critical"
                        onClick={() => toggleLang(lang)}
                      >
                        Remove
                      </Button>
                    </Flex>
                    <input
                      type="text"
                      value={value?.[lang] || ""}
                      onChange={(e) => handleChange(lang, e.target.value)}
                      placeholder={`Enter ${LANGS.find((l) => l.code === lang)?.label}…`}
                      style={{ width: "100%", padding: 8 }}
                    />
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
