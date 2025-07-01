import React from "react";
import {
  createBaseElementSchema,
  createMediaTypeField,
  createSvgField,
  createImageFields,
  createColorField,
  createRecolorField,
} from "./baseElementSchema";
import { processSvg } from "../../../utils/svgUtils";
import { Rule } from "@sanity/types";
import { GlassLocalizationInput } from "../../components/GlassLocalizationInput";
import { GenericComputedFieldsInput } from "../../components/GenericComputedFieldsInput";
import {
  sizeAndPositionFields,
  displayAndTransformFields,
} from "../objects/sharedCastingFields";

const createButtonTypeField = (
  fieldName: string = "buttonType",
  title: string = "Button Type",
  description?: string,
  fieldset: string = "style",
  buttonTypes: Array<{ title: string; value: string }> = [
    { title: "Link Button", value: "link" },
    { title: "Form Submit", value: "submit" },
    { title: "JavaScript Action", value: "action" },
    { title: "Visual Only", value: "visual" },
  ],
) => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: buttonTypes,
    layout: "radio",
  },
  validation: (rule: Rule) => rule.required(),
  fieldset,
  description: description || "Choose how the button behaves when clicked",
});

const createButtonVariantField = (
  fieldName: string = "variant",
  title: string = "Button Variant",
  description?: string,
  fieldset: string = "style",
  variants: Array<{ title: string; value: string }> = [
    { title: "Primary", value: "primary" },
    { title: "Secondary", value: "secondary" },
    { title: "Outline", value: "outline" },
    { title: "Ghost", value: "ghost" },
    { title: "Danger", value: "danger" },
  ],
) => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: variants,
    layout: "radio",
  },
  validation: (rule: Rule) => rule.required(),
  fieldset,
  description: description || "Choose the visual style of the button",
  initialValue: "primary",
});

const createButtonSizeField = (
  fieldName: string = "size",
  title: string = "Button Size",
  description?: string,
  fieldset: string = "style",
  sizes: Array<{ title: string; value: string }> = [
    { title: "Small", value: "sm" },
    { title: "Medium", value: "md" },
    { title: "Large", value: "lg" },
  ],
) => ({
  name: fieldName,
  title,
  type: "string",
  options: {
    list: sizes,
    layout: "radio",
  },
  validation: (rule: Rule) => rule.required(),
  fieldset,
  description: description || "Choose the size of the button",
  initialValue: "md",
});

const base = createBaseElementSchema(
  "elementButton",
  "Button Element",
  "button",
  [
    {
      name: "usage",
      title: "Usage",
      type: "string",
      options: {
        list: [
          { title: "General", value: "" },
          { title: "Hero CTA", value: "hero-cta" },
        ],
      },
      fieldset: "content",
      description:
        "What this button element is used for (helps with organization)",
    },
    {
      name: "contentType",
      title: "Button Content Type",
      type: "string",
      options: {
        list: [
          { title: "Text Only", value: "text" },
          { title: "Visual Only", value: "visual" },
          { title: "Visual + Text", value: "visualText" },
        ],
        layout: "radio",
      },
      validation: (rule: Rule) => rule.required(),
      fieldset: "content",
      description: "Choose what content to display on the button",
    },
    createMediaTypeField(
      "mediaType",
      "Media Type",
      "Choose the type of media to display",
      "content",
    ),
    {
      name: "buttonText",
      title: "Button Text",
      type: "glassLocalization",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { contentType } = context.document || {};
            if (
              (contentType === "text" || contentType === "visualText") &&
              !value
            ) {
              return "Button text is required for this content type";
            }
            return true;
          },
        ),
      fieldset: "content",
      description: "Text to display on the button",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent &&
        typeof parent === "object" &&
        !["text", "visualText"].includes(
          (parent as Record<string, unknown>).contentType as string,
        ),
    },
    createSvgField(
      "svgIcon",
      "SVG Icon",
      "SVG icon identifier or path",
      "content",
    ),
    createColorField(
      "svgColor",
      "SVG Color",
      "Hex color code (without #) to apply to the SVG icon",
      "content",
    ),
    createRecolorField(
      "svgRecolor",
      "Recolor SVG",
      "Apply the color to the SVG (unchecked preserves original colors)",
      "content",
    ),
    ...createImageFields(
      "image",
      "Image",
      "Choose how to provide the image",
      "content",
    ),
  ],
  [
    createButtonTypeField(),
    {
      name: "url",
      title: "Link URL",
      type: "url",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent &&
        typeof parent === "object" &&
        (parent as Record<string, unknown>).buttonType !== "link",
      fieldset: "style",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { buttonType } = context.document || {};
            if (buttonType === "link" && !value) {
              return "URL is required for link buttons";
            }
            if (
              value &&
              typeof value === "string" &&
              !value.match(/^https?:\/\//)
            ) {
              return "URL must start with http:// or https://";
            }
            return true;
          },
        ),
    },
    {
      name: "actionId",
      title: "Action Identifier",
      type: "string",
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent &&
        typeof parent === "object" &&
        (parent as Record<string, unknown>).buttonType !== "action",
      fieldset: "style",
      validation: (rule: Rule) =>
        rule.custom(
          (value: unknown, context: { document?: Record<string, unknown> }) => {
            const { buttonType } = context.document || {};
            if (buttonType === "action" && !value) {
              return "Action identifier is required for action buttons";
            }
            return true;
          },
        ),
    },
    createButtonVariantField(),
    createButtonSizeField(),
    {
      name: "fullWidth",
      title: "Full Width",
      type: "boolean",
      description: "Make the button span the full width of its container",
      initialValue: false,
      fieldset: "style",
    },
    {
      name: "disabled",
      title: "Disabled",
      type: "boolean",
      description:
        "Disable the button (for form validation or conditional logic)",
      initialValue: false,
      fieldset: "style",
    },
  ],
);

base.fieldsets = [
  ...base.fieldsets,
  {
    name: "style",
    title: "Style",
    options: { collapsible: true, collapsed: true },
  },
];

// Remove alternative title and caption fields for button element
base.fields = base.fields.filter(
  (field) => field.name !== "alternativeTitle" && field.name !== "caption",
);

// Convert fields to use correct localization types and update computed fields
base.fields = base.fields.map((field) => {
  if (
    field.name === "title" ||
    field.name === "description" ||
    field.name === "buttonText"
  ) {
    return {
      ...field,
      type: "glassLocaleString",
      components: { input: GlassLocalizationInput },
      options: {
        fieldType: "string",
      },
      description: field.description,
    };
  }
  if (field.name === "computedFields") {
    return {
      ...field,
      components: { input: GenericComputedFieldsInput },
      options: {
        elementType: "button",
      },
    };
  }
  return field;
});

// Add conditional logic for media type and related fields
base.fields = base.fields.map((field) => {
  if (field.name === "mediaType") {
    return {
      ...field,
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        parent &&
        typeof parent === "object" &&
        !["visual", "visualText"].includes(
          (parent as Record<string, unknown>).contentType as string,
        ),
    };
  }
  if (field.name === "svgIcon") {
    return {
      ...field,
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        (parent &&
          typeof parent === "object" &&
          (parent as Record<string, unknown>).contentType !== "visual" &&
          (parent as Record<string, unknown>).contentType !== "visualText") ||
        (parent as Record<string, unknown>).mediaType !== "svg",
    };
  }
  if (field.name === "svgColor") {
    return {
      ...field,
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        (parent &&
          typeof parent === "object" &&
          (parent as Record<string, unknown>).contentType !== "visual" &&
          (parent as Record<string, unknown>).contentType !== "visualText") ||
        (parent as Record<string, unknown>).mediaType !== "svg",
    };
  }
  if (field.name === "svgRecolor") {
    return {
      ...field,
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        (parent &&
          typeof parent === "object" &&
          (parent as Record<string, unknown>).contentType !== "visual" &&
          (parent as Record<string, unknown>).contentType !== "visualText") ||
        (parent as Record<string, unknown>).mediaType !== "svg",
    };
  }
  if (
    field.name === "imageSource" ||
    field.name === "imageUpload" ||
    field.name === "imageUrl"
  ) {
    return {
      ...field,
      hidden: ({ parent }: { parent: Record<string, unknown> }) =>
        (parent &&
          typeof parent === "object" &&
          (parent as Record<string, unknown>).contentType !== "visual" &&
          (parent as Record<string, unknown>).contentType !== "visualText") ||
        (parent as Record<string, unknown>).mediaType !== "image",
    };
  }
  return field;
});

base.preview = {
  select: {
    title: "title",
    alternativeTitle: "alternativeTitle",
    description: "description",
    subtitle: "contentType",
    media: "variant",
    svgIcon: "svgIcon",
  } as unknown as typeof base.preview.select,
  prepare(selection: Record<string, unknown>) {
    const { title, alternativeTitle, description, subtitle, media, svgIcon } =
      selection as {
        title?: Record<string, string>;
        alternativeTitle?: Record<string, string>;
        description?: Record<string, string>;
        subtitle?: string;
        media?: string;
        svgIcon?: string;
      };

    // Get the best available title content with fallback
    const displayTitle =
      title?.en ||
      title?.es ||
      Object.values(title || {}).find((val) => val?.trim()) ||
      alternativeTitle?.en ||
      alternativeTitle?.es ||
      Object.values(alternativeTitle || {}).find((val) => val?.trim()) ||
      description?.en ||
      description?.es ||
      Object.values(description || {}).find((val) => val?.trim()) ||
      "Untitled Button";

    const buttonInfo = [];
    if (subtitle) buttonInfo.push(subtitle);
    if (media) buttonInfo.push(media);

    const displaySubtitle =
      buttonInfo.length > 0
        ? `Button (${buttonInfo.join(", ")})`
        : "Button Element";

    // Create media element - try SVG first, then fallback to button preview
    let displayMedia: React.ReactElement;

    if (svgIcon && svgIcon.trim().startsWith("<svg")) {
      try {
        // Process SVG with recolor control
        const processedSvg = processSvg(svgIcon);

        displayMedia = React.createElement("div", {
          style: {
            width: 40,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: "6px",
          },
          dangerouslySetInnerHTML: { __html: processedSvg },
        });
      } catch {
        // Fallback to button preview if SVG rendering fails
        displayMedia = React.createElement(
          "div",
          {
            style: {
              width: 40,
              height: 24,
              // @luka: remember we need theming here - these colors should come from theme system
              backgroundColor:
                media === "primary"
                  ? "#582973"
                  : media === "secondary"
                    ? "#FFFFFF"
                    : media === "outline"
                      ? "transparent"
                      : media === "ghost"
                        ? "transparent"
                        : media === "danger"
                          ? "#E813A4"
                          : "#582973",
              border: media === "outline" ? "2px solid #582973" : "none",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color:
                media === "outline" || media === "ghost"
                  ? "#582973"
                  : media === "secondary"
                    ? "#09020D"
                    : "#FFFFFF",
              fontSize: "12px",
              fontWeight: "bold",
            },
          },
          "BTN",
        );
      }
    } else {
      // Default button preview
      displayMedia = React.createElement(
        "div",
        {
          style: {
            width: 40,
            height: 24,
            // @luka: remember we need theming here - these colors should come from theme system
            backgroundColor:
              media === "primary"
                ? "#582973"
                : media === "secondary"
                  ? "#FFFFFF"
                  : media === "outline"
                    ? "transparent"
                    : media === "ghost"
                      ? "transparent"
                      : media === "danger"
                        ? "#E813A4"
                        : "#582973",
            border: media === "outline" ? "2px solid #582973" : "none",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color:
              media === "outline" || media === "ghost"
                ? "#582973"
                : media === "secondary"
                  ? "#09020D"
                  : "#FFFFFF",
            fontSize: "12px",
            fontWeight: "bold",
          },
        },
        "BTN",
      );
    }

    return {
      title: displayTitle,
      subtitle: displaySubtitle,
      media: displayMedia,
    };
  },
};

export const elementButtonCastingFields = [
  { name: "sizeAndPosition", type: "object", fields: sizeAndPositionFields },
  {
    name: "displayAndTransform",
    type: "object",
    fields: displayAndTransformFields,
  },
];

export default base;
