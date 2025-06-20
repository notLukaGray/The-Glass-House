import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { 
  SiteSettings, 
  SanitySettingsResponse, 
  DEFAULT_SETTINGS,
  SettingsValidationResult 
} from '@/types/settings';

// Server-side Sanity client (can use private env vars)
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || '',
  apiVersion: process.env.SANITY_API_VERSION || '2023-05-03',
  useCdn: true,
});

/**
 * Validates settings data and returns validation result
 */
function validateSettings(data: SanitySettingsResponse): SettingsValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required fields
  if (!data.basicInfo?.title?.en) {
    errors.push('Basic info title is required');
  }
  if (!data.basicInfo?.description?.en) {
    errors.push('Basic info description is required');
  }

  // Validate theme colors
  if (data.theme?.lightMode?.colors) {
    const colors = data.theme.lightMode.colors;
    if (!colors.primary || !colors.background || !colors.text) {
      errors.push('Light mode colors are incomplete');
    }
  }

  if (data.theme?.darkMode?.colors) {
    const colors = data.theme.darkMode.colors;
    if (!colors.primary || !colors.background || !colors.text) {
      errors.push('Dark mode colors are incomplete');
    }
  }

  // Check for warnings
  if (!data.seo?.metaTitle?.en) {
    warnings.push('SEO meta title is missing');
  }
  if (!data.seo?.metaDescription?.en) {
    warnings.push('SEO meta description is missing');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Merges Sanity response with default settings
 */
function mergeWithDefaults(data: SanitySettingsResponse): SiteSettings {
  return {
    basicInfo: {
      title: data.basicInfo?.title || DEFAULT_SETTINGS.basicInfo.title,
      description: data.basicInfo?.description || DEFAULT_SETTINGS.basicInfo.description,
      favicon: data.basicInfo?.favicon || DEFAULT_SETTINGS.basicInfo.favicon,
      logo: data.basicInfo?.logo || DEFAULT_SETTINGS.basicInfo.logo,
    },
    theme: {
      defaultMode: data.theme?.defaultMode || DEFAULT_SETTINGS.theme.defaultMode,
      lightMode: {
        colors: {
          ...DEFAULT_SETTINGS.theme.lightMode.colors,
          ...data.theme?.lightMode?.colors,
        },
        overlays: {
          ...DEFAULT_SETTINGS.theme.lightMode.overlays,
          ...data.theme?.lightMode?.overlays,
        },
      },
      darkMode: {
        colors: {
          ...DEFAULT_SETTINGS.theme.darkMode.colors,
          ...data.theme?.darkMode?.colors,
        },
        overlays: {
          ...DEFAULT_SETTINGS.theme.darkMode.overlays,
          ...data.theme?.darkMode?.overlays,
        },
      },
      typography: {
        ...DEFAULT_SETTINGS.theme.typography,
        ...data.theme?.typography,
      },
      spacing: {
        ...DEFAULT_SETTINGS.theme.spacing,
        ...data.theme?.spacing,
      },
    },
    seo: {
      metaTitle: data.seo?.metaTitle || DEFAULT_SETTINGS.seo.metaTitle,
      metaDescription: data.seo?.metaDescription || DEFAULT_SETTINGS.seo.metaDescription,
      ogImage: data.seo?.ogImage || DEFAULT_SETTINGS.seo.ogImage,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'runtime';

    let query: string;
    
    if (type === 'build') {
      query = `*[_type == "siteSettings"][0] {
        "basicInfo": {
          "title": basicInfo.title,
          "description": basicInfo.description,
          "favicon": basicInfo.favicon,
          "logo": basicInfo.logo
        },
        "theme": {
          "defaultMode": theme.defaultMode,
          "typography": {
            "headingFont": theme.typography.headingFont,
            "bodyFont": theme.typography.bodyFont
          }
        },
        "seo": {
          "metaTitle": seo.metaTitle,
          "metaDescription": seo.metaDescription,
          "ogImage": seo.ogImage
        }
      }`;
    } else {
      query = `*[_type == "siteSettings"][0] {
        "theme": {
          "defaultMode": theme.defaultMode,
          "lightMode": {
            "colors": theme.lightMode.colors,
            "overlays": theme.lightMode.overlays
          },
          "darkMode": {
            "colors": theme.darkMode.colors,
            "overlays": theme.darkMode.overlays
          },
          "typography": theme.typography,
          "spacing": theme.spacing
        }
      }`;
    }

    const data: SanitySettingsResponse = await client.fetch(query);
    const validation = validateSettings(data);
    
    if (!validation.isValid) {
      console.warn('Settings validation failed:', validation.errors);
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    const settings = mergeWithDefaults(data);
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
} 