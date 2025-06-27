# Localization System for Atomic Elements

## Overview

The atomic elements system now supports full localization using Sanity's `localeString` and `localeText` types. This allows you to create content in multiple languages while maintaining a clean, organized structure.

## Supported Languages

The system supports the following languages by default:

- **en** - English
- **es** - Español (Spanish)
- **fr** - Français (French)
- **de** - Deutsch (German)
- **ja** - 日本語 (Japanese)
- **zh** - 中文 (Chinese)

Additional languages can be easily added by updating the `SUPPORTED_LANGUAGES` configuration.

## Localized Fields

All atomic elements now use localized versions of these fields:

### Core Metadata Fields

- **title** (`localeString`) - Short title for the element (required)
- **description** (`localeString`) - Brief description for accessibility (required)
- **alternativeTitle** (`localeString`) - Optional alternative display title
- **caption** (`localeText`) - Optional caption text (supports longer content)

### Element-Specific Fields

- **altText** (`localeString`) - Alternative text for images (auto-generated from title if empty)

### Auto-Generated Fields

- **ariaLabel** (`localeString`) - Accessibility labels in all supported languages
- **customId** (`string`) - Custom identifier for linking and analytics

## Data Structure

Each localized field follows this structure:

```json
{
  "title": {
    "en": "Mountain Landscape",
    "es": "Paisaje Montañoso",
    "fr": "Paysage de Montagne",
    "de": "Berglandschaft",
    "ja": "山の風景",
    "zh": "山景"
  }
}
```

## Frontend Usage

### Basic Localization Helper

```typescript
import {
  getLocalizedText,
  getElementLocalizedMetadata,
} from "@/lib/sanity/utils/localization";

// Get a single localized field
const title = getLocalizedText(element.title, "es", "en");

// Get all metadata for an element
const metadata = getElementLocalizedMetadata(element, "es", "en");
console.log(metadata.title); // "Paisaje Montañoso"
console.log(metadata.description); // "Un impresionante paisaje montañoso..."
```

### React Component Example

```tsx
import { getLocalizedText } from "@/lib/sanity/utils/localization";

interface ImageElementProps {
  element: any;
  language?: string;
}

export const ImageElement: React.FC<ImageElementProps> = ({
  element,
  language = "en",
}) => {
  const title = getLocalizedText(element.title, language);
  const description = getLocalizedText(element.description, language);
  const altText = getLocalizedText(element.altText, language) || title;
  const caption = getLocalizedText(element.caption, language);
  const ariaLabel = getLocalizedText(element.ariaLabel, language);

  return (
    <figure>
      <img
        src={element.externalUrl || element.sanityImage?.asset?.url}
        alt={altText}
        aria-label={ariaLabel}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};
```

### Language Detection

```typescript
import {
  getAvailableLanguages,
  hasLanguageContent,
} from "@/lib/sanity/utils/localization";

// Check what languages are available
const availableLanguages = getAvailableLanguages(element.title);
console.log(availableLanguages); // ['en', 'es', 'fr', 'de', 'ja', 'zh']

// Check if content exists for a specific language
const hasSpanish = hasLanguageContent(element.title, "es");
console.log(hasSpanish); // true
```

## Studio Interface

In Sanity Studio, localized fields appear with language tabs:

1. **Primary Language** - Usually English (en)
2. **Secondary Languages** - Additional language tabs
3. **Auto-Generation** - ARIA labels are automatically generated for all supported languages

### Studio Features

- **Language Tabs**: Easy switching between languages
- **Required Fields**: Title and description are required in the primary language
- **Auto-Generated ARIA Labels**: Accessibility labels are computed for all languages
- **Fallback System**: If a language is missing, it falls back to English

## Creating New Elements

When creating new element types, use the base schema template:

```typescript
import { createBaseElementSchema } from "./baseElementSchema";

export const elementVideo = createBaseElementSchema(
  "elementVideo",
  "Video Element",
  "video",
  [
    // Your video-specific content fields
  ],
  [
    // Your video-specific metadata fields
  ],
);
```

The base schema automatically includes all localized fields and auto-generation features.

## Migration from Non-Localized

If you have existing elements without localization:

1. **Backup your data** before migration
2. **Update the schema** to use `localeString`/`localeText`
3. **Migrate existing content** by wrapping string values in language objects:

```json
// Before
{
  "title": "Mountain Landscape"
}

// After
{
  "title": {
    "en": "Mountain Landscape"
  }
}
```

## Best Practices

1. **Always provide English content** as the primary language
2. **Use consistent terminology** across languages
3. **Keep descriptions concise** for better accessibility
4. **Test with screen readers** to ensure ARIA labels work properly
5. **Consider cultural differences** when translating content

## Configuration

To add or modify supported languages, update the configuration files:

```typescript
// In autoGeneration.ts
export const ELEMENT_CONFIGS = {
  image: {
    // ... other config
    supportedLanguages: ["en", "es", "fr", "de", "ja", "zh", "it", "pt"],
  },
};

// In localization.ts
export const SUPPORTED_LANGUAGES = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
  it: "Italiano",
  pt: "Português",
};
```
