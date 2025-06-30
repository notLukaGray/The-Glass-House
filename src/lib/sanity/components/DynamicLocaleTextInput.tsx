import React from "react";
import { PatchEvent } from "sanity";
import { DynamicLocalizationInput } from "./DynamicLocalizationInput";

interface DynamicLocaleTextInputProps {
  value?: Record<string, string>;
  onChange: (patch: PatchEvent) => void;
  type: {
    name: string;
    title: string;
  };
}

export function DynamicLocaleTextInput(props: DynamicLocaleTextInputProps) {
  return <DynamicLocalizationInput {...props} fieldType="text" />;
}
