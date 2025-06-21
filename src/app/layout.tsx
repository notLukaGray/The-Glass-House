import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { getSettingsServer } from "@/_lib/data/settings";

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettingsServer();
    
    if (!settings) {
      return {
        title: "Portfolio",
        description: "My portfolio website",
      };
    }

    const title = settings.basicInfo.title.en;
    const description = settings.basicInfo.description.en;
    const faviconUrl = settings.basicInfo.favicon.url;
    const ogImageUrl = settings.seo.ogImage.url;
    const baseUrl = settings._baseUrl || process.env.NEXT_PUBLIC_BASE_URL || '';
    
    // Helper function to construct absolute URLs
    const makeAbsoluteUrl = (url: string | undefined) => {
      if (!url) return undefined;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url; // Already absolute
      }
      if (baseUrl) {
        return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
      }
      return url; // Return as-is if no base URL
    };
    
    const absoluteFaviconUrl = makeAbsoluteUrl(faviconUrl);
    const absoluteOgImageUrl = makeAbsoluteUrl(ogImageUrl);
    
    return {
      title,
      description,
      icons: absoluteFaviconUrl ? {
        icon: absoluteFaviconUrl,
        shortcut: absoluteFaviconUrl,
        apple: absoluteFaviconUrl,
      } : undefined,
      openGraph: {
        title: settings.seo.metaTitle.en,
        description: settings.seo.metaDescription.en,
        images: absoluteOgImageUrl ? [absoluteOgImageUrl] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: settings.seo.metaTitle.en,
        description: settings.seo.metaDescription.en,
        images: absoluteOgImageUrl ? [absoluteOgImageUrl] : undefined,
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return {
      title: "Portfolio",
      description: "My portfolio website",
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
