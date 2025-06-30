import React from "react";
import { PatchEvent } from "sanity";
import { DynamicLocalizationInput } from "./DynamicLocalizationInput";

interface DynamicLocaleStringInputProps {
  value?: Record<string, string>;
  onChange: (patch: PatchEvent) => void;
  type: {
    name: string;
    title: string;
  };
}

export function DynamicLocaleStringInput(props: DynamicLocaleStringInputProps) {
  return <DynamicLocalizationInput {...props} fieldType="string" />;
}
