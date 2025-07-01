# Glass Localization System - Simplified

## Overview

The Glass House system now uses **3 simple localization field types** that adapt to your Foundation settings. No more confusion with multiple overlapping field types!

## The 3 Field Types

### 1. `glassLocaleString` - Single Line Text

- **Use for**: Titles, labels, button text, short content
- **Example**: Page titles, navigation labels, alt text
- **Data structure**: `{ en: "Hello", es: "Hola" }`

### 2. `glassLocaleText` - Multi-Line Text

- **Use for**: Descriptions, captions, longer content
- **Example**: Page descriptions, image captions, meta descriptions
- **Data structure**: `{ en: "Long description...", es: "Descripción larga..." }`

### 3. `glassLocaleRichText` - Rich Text

- **Use for**: Formatted content, articles, complex text
- **Example**: Article content, detailed descriptions with formatting
- **Data structure**: `{ en: [{ _type: "block", children: [...] }], es: [...] }`

## How It Works

1. **Foundation-Driven**: Languages are configured in Foundation → Localization settings
2. **Dynamic Fields**: Add/remove languages without schema changes
3. **Unified Component**: All 3 field types use the same `GlassLocalizationInput` component
4. **Auto-Generation**: ARIA labels and alt text are automatically generated

## Usage in Schemas

```typescript
import {
  createLocalizedStringField,
  createLocalizedTextField,
  createLocalizedRichTextField
} from "../utils/localizationUtils";

// Single line text
createLocalizedStringField("title", "Title", "Page title", "main", (rule) => rule.required()),

// Multi-line text
createLocalizedTextField("description", "Description", "Page description", "main"),

// Rich text
createLocalizedRichTextField("content", "Content", "Article content", "content"),
```

## Frontend Usage

```typescript
import { getLocalizedContent } from "@/lib/frontend/helpers";

// Get localized content
const title = getLocalizedContent(element.title, "es", "en");
const description = getLocalizedContent(element.description, "es", "en");
```

## What Was Removed

We cleaned up the confusing mess of overlapping field types:

- ❌ `glassLocalization` (generic, unused)
- ❌ `localeString` (old, replaced)
- ❌ `localeText` (old, replaced)
- ❌ `dynamicLocaleString` (redundant)

## What We Have Now

- ✅ `glassLocaleString` - Single line text
- ✅ `glassLocaleText` - Multi-line text
- ✅ `glassLocaleRichText` - Rich text with formatting

**That's it! Just 3 field types for all your localization needs.**

---

**The Glass Localization system is now simple, consistent, and easy to understand.**
