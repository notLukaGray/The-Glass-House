import { Rule } from "@sanity/types";
import { GenericComputedFieldsInput } from "../../components/GenericComputedFieldsInput";
import { mapElementFields } from "../../utils/elementUtils";
import { createElementPreview } from "../../utils/previewUtils";
import { SanityField } from "../../types";

export const createBaseElementSchema = (
  elementName: string,
  elementTitle: string,
  elementType: string,
  contentFields: SanityField[] = [],
  additionalMetadataFields: SanityField[] = [],
) => {
  const baseFields = [
    ...contentFields,

    {
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule: Rule) => rule.required(),
      fieldset: "titleFieldset",
      description: `Short title for the ${elementType} (required)`,
      options: {
        layout: "dropdown",
        list: [
          { title: "English", value: "en" },
          { title: "Spanish", value: "es" },
          { title: "French", value: "fr" },
          { title: "German", value: "de" },
          { title: "Japanese", value: "ja" },
          { title: "Chinese", value: "zh" },
        ],
      },
    },
    {
      name: "description",
      title: "Description",
      type: "localeString",
      validation: (rule: Rule) => rule.required(),
      fieldset: "descriptionFieldset",
      description: `Brief description of the ${elementType} content (required)`,
      options: {
        layout: "dropdown",
        list: [
          { title: "English", value: "en" },
          { title: "Spanish", value: "es" },
          { title: "French", value: "fr" },
          { title: "German", value: "de" },
          { title: "Japanese", value: "ja" },
          { title: "Chinese", value: "zh" },
        ],
      },
    },
    {
      name: "alternativeTitle",
      title: "Alternative Title",
      type: "localeString",
      fieldset: "alternativeTitleFieldset",
      description: `Optional alternative title for display`,
      options: {
        layout: "dropdown",
        list: [
          { title: "English", value: "en" },
          { title: "Spanish", value: "es" },
          { title: "French", value: "fr" },
          { title: "German", value: "de" },
          { title: "Japanese", value: "ja" },
          { title: "Chinese", value: "zh" },
        ],
      },
    },
    {
      name: "caption",
      title: "Caption",
      type: "localeText",
      fieldset: "captionFieldset",
      description: `Optional caption text to display below the ${elementType}`,
      options: {
        layout: "dropdown",
        list: [
          { title: "English", value: "en" },
          { title: "Spanish", value: "es" },
          { title: "French", value: "fr" },
          { title: "German", value: "de" },
          { title: "Japanese", value: "ja" },
          { title: "Chinese", value: "zh" },
        ],
      },
    },

    ...additionalMetadataFields,

    {
      name: "customId",
      title: "Custom ID",
      type: "string",
      validation: (rule: Rule) => rule.max(20),
      fieldset: "advanced",
      description: `Custom ID for linking or analytics (auto-generated from Sanity ID if empty)`,
    },
    {
      name: "debug",
      title: "Debug Mode",
      type: "boolean",
      description: "Flag for debugging visibility or test logging",
      initialValue: false,
      fieldset: "advanced",
    },
    {
      name: "computedFields",
      title: "Auto-generated Fields",
      type: "object",
      fieldset: "advanced",
      options: {
        elementType: elementType,
      },
      components: {
        input: GenericComputedFieldsInput,
      },
      description:
        "These fields are automatically computed based on your description",
      fields: [
        {
          name: "ariaLabel",
          title: "ARIA Label",
          type: "object",
          fields: [
            { name: "en", title: "English", type: "string" },
            { name: "es", title: "Spanish", type: "string" },
            { name: "fr", title: "French", type: "string" },
            { name: "de", title: "German", type: "string" },
            { name: "ja", title: "Japanese", type: "string" },
            { name: "zh", title: "Chinese", type: "string" },
          ],
        },
        {
          name: "altText",
          title: "Alt Text",
          type: "object",
          fields: [
            { name: "en", title: "English", type: "string" },
            { name: "es", title: "Spanish", type: "string" },
            { name: "fr", title: "French", type: "string" },
            { name: "de", title: "German", type: "string" },
            { name: "ja", title: "Japanese", type: "string" },
            { name: "zh", title: "Chinese", type: "string" },
          ],
        },
      ],
    },
  ];

  return {
    name: elementName,
    title: elementTitle,
    type: "document",
    fieldsets: [
      {
        name: "content",
        title: "Content",
        options: { collapsible: false, collapsed: false },
      },
      {
        name: "titleFieldset",
        title: "Title",
        options: { collapsible: false, collapsed: false },
      },
      {
        name: "descriptionFieldset",
        title: "Description",
        options: { collapsible: false, collapsed: false },
      },
      {
        name: "alternativeTitleFieldset",
        title: "Alternative Title",
        options: { collapsible: false, collapsed: false },
      },
      {
        name: "captionFieldset",
        title: "Caption",
        options: { collapsible: false, collapsed: false },
      },
      {
        name: "altTextFieldset",
        title: "Alt Text",
        options: { collapsible: false, collapsed: false },
      },
      {
        name: "advanced",
        title: "Advanced (Auto-generated)",
        options: { collapsible: true, collapsed: true },
      },
    ],
    fields: mapElementFields(baseFields, elementType),
    preview: createElementPreview({ elementType }),
  };
};
