# Glass Localization System

## The Foundation-Driven Approach

Look, traditional CMS localization is a mess. You add a language, you update schemas, you break existing content. Not here. The Glass House uses a **foundation-driven system** that dynamically generates language fields based on your Foundation settings. Add Spanish? Boom, all your fields get Spanish versions. Remove French? Gone. No schema changes, no migrations, no headaches.

## The Three Field Types (That's It)

### `glassLocaleString` - Single Line

**For**: Titles, labels, button text  
**Data**: `{ en: "Hello", es: "Hola" }`  
**Use it**: When you need one line of text. Don't overthink it.

### `glassLocaleText` - Multi-Line

**For**: Descriptions, captions, longer content  
**Data**: `{ en: "Long description...", es: "Descripción larga..." }`  
**Use it**: When you need paragraphs. Still simple.

### `glassLocaleRichText` - Rich Text

**For**: Formatted content, articles  
**Data**: `{ en: [{ _type: "block", children: [...] }], es: [...] }`  
**Use it**: When you need formatting. Portable Text under the hood.

## How It Actually Works

1. **Foundation Config**: Languages live in Foundation → Localization
2. **Dynamic Fields**: System reads your config, generates fields on the fly
3. **Unified Component**: All three types use `GlassLocalizationInput` - one component, three behaviors
4. **Auto-Generation**: ARIA labels, alt text - all computed automatically

## Schema Implementation

### Creating Fields

```typescript
import {
  createLocalizedStringField,
  createLocalizedTextField,
  createLocalizedRichTextField
} from "../utils/localizationUtils";

// Single line - required
createLocalizedStringField("title", "Title", "Page title", "main", (rule) => rule.required()),

// Multi-line - optional
createLocalizedTextField("description", "Description", "Page description", "main"),

// Rich text - for content
createLocalizedRichTextField("content", "Content", "Article content", "content"),
```

### Field Structure

Each field is just an object with language codes as keys:

```typescript
// Simple
{
  en: "Welcome to our site",
  es: "Bienvenido a nuestro sitio"
}

// Rich text (Portable Text)
{
  en: [
    {
      _type: "block",
      children: [{ _type: "span", text: "Rich content" }]
    }
  ],
  es: [
    {
      _type: "block",
      children: [{ _type: "span", text: "Contenido rico" }]
    }
  ]
}
```

## Frontend Usage

### Getting Content

```typescript
import { getLocalizedContent } from "@/lib/frontend/helpers";

// Get with fallback
const title = getLocalizedContent(element.title, "es", "en");
const description = getLocalizedContent(element.description, "es", "en");
```

The helper handles language matching, fallbacks, and null safety. Don't write your own.

## Foundation Configuration

Languages are configured in Foundation → Localization:

```typescript
{
  additionalLanguages: [
    {
      code: "es",
      name: "Spanish",
      enabled: true,
      direction: "ltr",
    },
    {
      code: "fr",
      name: "French",
      enabled: true,
      direction: "ltr",
    },
  ];
}
```

Add languages here, they appear everywhere. Remove them, they disappear. It's that simple.

## Auto-Generated Fields

The system computes these automatically:

- **ARIA Labels**: From titles and descriptions
- **Alt Text**: For media elements
- **Custom IDs**: From Sanity IDs if not provided

You don't manage these. They just work.

## Migration from the Old Mess

We cleaned up the overlapping field types that were causing confusion:

**Gone**: `glassLocalization`, `localeString`, `localeText`, `dynamicLocaleString`  
**Here**: `glassLocaleString`, `glassLocaleText`, `glassLocaleRichText`

Three field types. That's it. Deal with it.

## Best Practices

1. **English is base** - Always required, always fallback
2. **Keep it concise** - Single-line fields should be single lines
3. **Use the right type** - Don't use rich text for labels
4. **Test with multiple languages** - Your UI needs to handle different text lengths
5. **RTL support** - The system handles it, you just need to test it

## Component Customization

The `GlassLocalizationInput` component accepts options:

```typescript
{
  type: "glassLocaleString",
  components: { input: GlassLocalizationInput },
  options: {
    fieldType: "string", // "string" | "text" | "richText"
    richTextOptions: {
      styles: [...],
      marks: {...}
    }
  }
}
```

But honestly, the defaults work for 99% of cases.

---

**The Glass Localization system eliminates the complexity of traditional CMS localization. Three field types, foundation-driven, auto-generated accessibility. Build your content, not your localization system.**
