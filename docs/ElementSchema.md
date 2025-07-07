# Element Schema System

## The Composable Foundation

Every element in The Glass House is built on a composable foundation. Think of it as a base class that gives you localization, casting capabilities, and automatic field generation. You extend it, add your specific fields, and you're done. No reinventing the wheel.

## Base Element Schema

All elements extend `createBaseElementSchema`. Here's what you get:

### Core Fields (Always There)

```typescript
// Basic (always visible)
title: glassLocaleString; // Required - don't skip this
description: glassLocaleString; // Required - describe what it does

// Content (collapsible)
caption: glassLocaleText; // Optional display caption
alternativeTitle: glassLocaleString; // Optional alt title

// Advanced (collapsible)
customId: string; // Custom ID for linking/analytics
debug: boolean; // Debug mode flag
computedFields: object; // Auto-generated accessibility
```

### Field Organization

Elements use fieldsets to keep things organized:

- **Basic**: Title, description (always visible)
- **Content**: Your specific fields, captions (collapsible)
- **Advanced**: Custom ID, debug mode, computed fields (collapsible)

## Creating a New Element

### Basic Structure

```typescript
import { createBaseElementSchema } from "./baseElementSchema";
import { createLocalizedStringField } from "../../utils/localizationUtils";

const myElement = createBaseElementSchema(
  "elementMyElement", // Schema name
  "My Element", // Display title
  "myElement", // Element type
  [
    // Your content fields
    createLocalizedStringField("content", "Content", "Main content"),
    // ... more fields
  ],
  [
    // Additional metadata
    { name: "metadata", type: "string" },
  ],
);
```

### Element Types

The system supports these types. Pick one:

- **Text**: `elementTextSingleLine`, `elementTextBlock`, `elementRichText`
- **Media**: `elementImage`, `elementVideo`, `elementAudio`, `elementSVG`, `element3D`
- **Interactive**: `elementButton`, `elementWidget`
- **Layout**: `elementDivider`, `elementCanvas`

## The Casting System

This is where it gets interesting. The casting system lets you position and style elements when they're used in compositions (modules, wings, scaffolds). Think of it as CSS-in-JS for your CMS.

### Casting Fields

Each element can have casting fields that control its appearance:

```typescript
export const elementMyElementCastingFields = [
  {
    name: "sizeAndPosition",
    type: "object",
    fields: [
      { name: "width", type: "string" },
      { name: "height", type: "string" },
      { name: "x", type: "string" },
      { name: "y", type: "string" },
      { name: "rotation", type: "number" },
      { name: "scale", type: "number" },
      { name: "alignment", type: "string" },
    ],
  },
  {
    name: "displayAndTransform",
    type: "object",
    fields: [
      { name: "opacity", type: "number" },
      { name: "zIndex", type: "number" },
      { name: "flipHorizontal", type: "boolean" },
      { name: "flipVertical", type: "boolean" },
    ],
  },
];
```

### Casting Registry

Register your casting fields so the system knows about them:

```typescript
export const elementCastingRegistry: Record<string, unknown[]> = {
  elementTextSingleLine: elementTextSingleLineCastingFields,
  elementImage: elementImageCastingFields,
  elementButton: elementButtonCastingFields,
  // Add yours here
};
```

### Cast Reference Objects

Elements can be referenced with casting in compositions:

```typescript
// Cast reference structure
{
  ref: { _type: "reference", to: [{ type: "elementImage" }] },
  casting: {
    sizeAndPosition: { width: "100%", height: "auto" },
    displayAndTransform: { opacity: 80, zIndex: 1 }
  }
}
```

## Field Generation Utilities

### Image Fields

```typescript
import { createImageFields } from "./baseElementSchema";

const imageFields = createImageFields(
  "image", // Field name
  "Image", // Title
  "Choose image source", // Description
  "content", // Fieldset
);
```

This gives you:

- `imageSource`: Radio (upload/external)
- `imageUpload`: File upload field
- `imageUrl`: External URL field

### SVG Fields

```typescript
import { createSvgFields } from "./baseElementSchema";

const svgFields = createSvgFields(
  "svg", // Field name
  "SVG", // Title
  "Enter SVG content", // Description
  "content", // Fieldset
);
```

This gives you:

- `svgSource`: Radio (upload/string)
- `svgFile`: File upload field
- `svgString`: Text input for SVG code

### Color and Style Fields

```typescript
import {
  createColorField,
  createRecolorField,
  createMediaTypeField,
} from "./baseElementSchema";

const colorField = createColorField("color", "Color", "Hex color code");
const recolorField = createRecolorField("recolor", "Recolor SVG");
const mediaTypeField = createMediaTypeField("mediaType", "Media Type");
```

## Element Examples

### Text Single Line Element

```typescript
const elementTextSingleLine = createBaseElementSchema(
  "elementTextSingleLine",
  "Single Line Text Element",
  "textSingleLine",
  [
    {
      name: "text",
      title: "Text Content",
      type: "glassLocaleString",
      validation: (rule) => rule.required(),
      fieldset: "content",
    },
    {
      name: "usage",
      title: "Usage",
      type: "string",
      options: {
        list: [
          { title: "General", value: "" },
          { title: "Hero Headline", value: "hero-headline" },
        ],
      },
    },
  ],
);
```

### Button Element

```typescript
const elementButton = createBaseElementSchema(
  "elementButton",
  "Button Element",
  "button",
  [
    // Content fields
    createLocalizedStringField("buttonText", "Button Text"),
    createButtonTypeField(),
    createMediaTypeField(),

    // Style fields
    { name: "variant", type: "string", options: { list: [...] } },
    { name: "size", type: "string", options: { list: [...] } },

    // Media fields (conditional)
    ...createSvgFields("svg", "SVG Icon"),
    ...createImageFields("image", "Image")
  ]
);
```

## Auto-Generated Fields

### Computed Fields

The system automatically generates accessibility fields:

```typescript
computedFields: {
  ariaLabel: glassLocaleString,    // From title/description
  altText: glassLocaleString,      // For media elements
  customId: string                 // Auto-generated if not provided
}
```

### Preview Configuration

Customize how your element appears in the CMS:

```typescript
base.preview = {
  select: {
    title: "text", // Primary display text
    subtitle: "usage", // Secondary text
    media: "imageUpload", // Preview image
  },
  prepare({ title, subtitle, media }) {
    return {
      title: title?.en || "Untitled",
      subtitle: subtitle || "Text Element",
      media,
    };
  },
};
```

## Validation

Elements use Zod schemas for API validation:

```typescript
export const TextSingleLineElementSchema = z.object({
  text: z.record(z.string()),
  usage: z.string().optional(),
  typography: z.record(z.any()).optional(),
  customId: z.string().optional(),
  debug: z.boolean().optional(),
  computedFields: z.record(z.any()).optional(),
  casting: z.record(z.any()).optional(),
});
```

## Best Practices

1. **Use appropriate field types** - Single line for titles, multi-line for descriptions
2. **Implement casting fields** - All elements should have casting capabilities
3. **Register in casting registry** - Add your element to `elementCastingRegistry`
4. **Create validation schema** - Define Zod schema for API validation
5. **Customize preview** - Make elements easy to identify in the CMS
6. **Use field generation utilities** - Leverage existing field creators for consistency

## Element Lifecycle

1. **Schema Definition** - Create element schema with base fields
2. **Casting Fields** - Define positioning and styling capabilities
3. **Registry Registration** - Add to casting registry
4. **Validation Schema** - Create Zod schema for API
5. **Preview Configuration** - Customize CMS display
6. **API Endpoint** - Create REST endpoint for CRUD operations

---

**The Element schema system gives you a consistent, extensible foundation. Extend the base, add your fields, implement casting, and you're done. No reinventing the wheel, just building on solid ground.**
