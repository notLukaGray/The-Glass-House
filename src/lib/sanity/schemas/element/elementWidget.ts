import { createBaseElementSchema } from "./baseElementSchema";
import { Rule } from "@sanity/types";

const base = createBaseElementSchema(
  "elementWidget",
  "Widget Element",
  "widget",
  [
    // API Reference Objects (array)
    {
      name: "apiRefs",
      title: "API Integrations",
      type: "array",
      of: [
        { type: "githubApiRefObject" },
        // Future API objects can be added here:
        // { type: "weatherApiRefObject" },
        // { type: "socialApiRefObject" },
        // { type: "newsApiRefObject" },
      ],
      fieldset: "content",
      description: "Configure one or more API integrations for this widget",
      validation: (rule: Rule) => rule.min(1),
    },
    // Refresh Interval
    {
      name: "refreshInterval",
      title: "Refresh Interval (minutes)",
      type: "number",
      initialValue: 5,
      fieldset: "content",
      description: "How often to refresh the widget data",
      validation: (rule: Rule) => rule.min(1).max(60),
    },
  ],
  [],
);

// Remove alternativeTitle and caption
base.fields = base.fields.filter(
  (field) => field.name !== "alternativeTitle" && field.name !== "caption",
);

// Fieldsets
base.fieldsets = [
  {
    name: "basic",
    title: "Basic Information",
    options: { collapsible: false, collapsed: false },
  },
  {
    name: "content",
    title: "Widget Configuration",
    options: { collapsible: true, collapsed: true },
  },
  {
    name: "advanced",
    title: "Advanced",
    options: { collapsible: true, collapsed: true },
  },
];

// Assign fieldsets
base.fields = base.fields.map((field) => {
  if (field.name === "title" || field.name === "description") {
    return { ...field, fieldset: "basic" };
  }
  if (
    field.name === "customId" ||
    field.name === "debug" ||
    field.name === "computedFields"
  ) {
    return { ...field, fieldset: "advanced" };
  }
  return field;
});

base.preview = {
  select: {
    title: "title.en",
    alternativeTitle: "title.en",
    description: "description.en",
    subtitle: "description.en",
    media: "title.en",
  },
  prepare({
    title,
    ...rest
  }: {
    title?: string;
    alternativeTitle?: string;
    description?: string;
    subtitle?: string;
    media?: unknown;
    [key: string]: unknown;
  }) {
    // Find apiRefs in rest (Sanity passes all fields)
    const apiRefs = rest?.apiRefs;
    let apiSummary = "No APIs configured";
    if (Array.isArray(apiRefs) && apiRefs.length > 0) {
      apiSummary = apiRefs
        .map(
          (ref: {
            _type?: string;
            name?: string;
            userInfo?: { username?: string };
          }) => {
            if (ref._type === "githubApiRefObject") {
              const username = ref.userInfo?.username;
              return `GitHub${ref.name ? `: ${ref.name}` : ""}${
                username ? ` (${username})` : ""
              }`;
            }
            return ref.name || "Unknown API";
          },
        )
        .join(", ");
    }
    return {
      title: title || "Untitled Widget",
      subtitle: `APIs: ${apiSummary}`,
      media: undefined,
    };
  },
};

export default base;

export const elementWidgetCastingFields = [
  {
    name: "display",
    title: "Display",
    type: "object",
    fields: [
      {
        name: "opacity",
        title: "Opacity",
        type: "number",
        min: 0,
        max: 100,
        step: 1,
        initialValue: 100,
        description: "Opacity percentage (0-100)",
      },
      {
        name: "zIndex",
        title: "Z-Index",
        type: "number",
        initialValue: 0,
        description: "Stacking order",
      },
    ],
  },
  {
    name: "layout",
    title: "Layout",
    type: "object",
    fields: [
      {
        name: "width",
        title: "Width",
        type: "object",
        fields: [
          { name: "value", title: "Value", type: "number" },
          {
            name: "unit",
            title: "Unit",
            type: "string",
            options: {
              list: [
                { title: "px", value: "px" },
                { title: "%", value: "%" },
              ],
            },
            initialValue: "px",
          },
        ],
      },
      {
        name: "height",
        title: "Height",
        type: "object",
        fields: [
          { name: "value", title: "Value", type: "number" },
          {
            name: "unit",
            title: "Unit",
            type: "string",
            options: {
              list: [
                { title: "px", value: "px" },
                { title: "%", value: "%" },
              ],
            },
            initialValue: "px",
          },
        ],
      },
    ],
  },
];
