import { SanityField } from "../types";
import type { Rule } from "@sanity/types";

interface RichTextAnnotation {
  title: string;
  name: string;
  type: string;
  fields?: Array<{
    title: string;
    name: string;
    type: string;
    validation?: (rule: Rule) => Rule;
    initialValue?: unknown;
  }>;
}

interface RichTextOptions {
  styles?: Array<{ title: string; value: string }>;
  marks?: {
    decorators?: Array<{ title: string; value: string }>;
    annotations?: Array<RichTextAnnotation>;
  };
  lists?: Array<{ title: string; value: string }>;
  imageOptions?: Record<string, unknown>;
  imageFields?: Array<{
    name: string;
    type: string;
    title: string;
    description?: string;
  }>;
}

/**
 * Create a localized string field using Glass Localization
 */
export function createLocalizedStringField(
  fieldName: string,
  fieldTitle: string,
  description?: string,
  fieldset?: string,
  validation?: (rule: Rule) => Rule,
): SanityField {
  return {
    name: fieldName,
    title: fieldTitle,
    type: "glassLocaleString",
    description,
    fieldset,
    validation,
  };
}

/**
 * Create a localized text field using Glass Localization
 */
export function createLocalizedTextField(
  fieldName: string,
  fieldTitle: string,
  description?: string,
  fieldset?: string,
  validation?: (rule: Rule) => Rule,
): SanityField {
  return {
    name: fieldName,
    title: fieldTitle,
    type: "glassLocaleText",
    description,
    fieldset,
    validation,
  };
}

/**
 * Create localized rich text fields using Glass Localization
 */
export function createLocalizedRichTextFields(
  fieldName: string,
  fieldTitle: string,
  richTextOptions: RichTextOptions,
  description?: string,
  fieldset?: string,
  validation?: (rule: Rule) => Rule,
): SanityField {
  return {
    name: fieldName,
    title: fieldTitle,
    type: "glassLocaleRichText",
    description,
    fieldset,
    validation,
    options: {
      richTextOptions,
    },
  };
}

/**
 * Create localized computed fields (ARIA, alt text, etc.)
 * These fields use Glass Localization for dynamic language support
 */
export function createLocalizedComputedFields(): SanityField[] {
  return [
    {
      name: "ariaLabel",
      title: "ARIA Label",
      type: "glassLocaleString",
    },
    {
      name: "altText",
      title: "Alt Text",
      type: "glassLocaleString",
    },
  ];
}
