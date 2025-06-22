import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getSettingsServer } from "@/_lib/data/settings";

/**
 * Generates dynamic metadata for the site using settings from Sanity.
 * This function is called at build time and on revalidation to ensure
 * the site's metadata (title, description, social images) is always up-to-date.
 *
 * @returns {Promise<Metadata>} A promise that resolves to the metadata object.
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetches global site settings from the server-side cache or directly from Sanity.
    const settings = await getSettingsServer();

    // Fallback metadata if settings can't be fetched.
    // This prevents build errors and ensures the site is still accessible.
    if (!settings) {
      return {
        title: "Portfolio",
        description: "My portfolio website",
      };
    }

    const { title, description } = settings.basicInfo;
    const faviconUrl = settings.basicInfo.favicon?.url;
    const ogImageUrl = settings.seo.ogImage?.url;
    const baseUrl = settings._baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "";

    // Helper function to construct absolute URLs
    const makeAbsoluteUrl = (url: string | undefined) => {
      if (!url) return undefined;
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url; // Already absolute
      }
      if (baseUrl) {
        return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
      }
      return url; // Return as-is if no base URL
    };

    const absoluteFaviconUrl = makeAbsoluteUrl(faviconUrl);
    const absoluteOgImageUrl = makeAbsoluteUrl(ogImageUrl);

    return {
      title: title.en,
      description: description.en,
      icons: absoluteFaviconUrl
        ? {
            icon: absoluteFaviconUrl,
            shortcut: absoluteFaviconUrl,
            apple: absoluteFaviconUrl,
          }
        : undefined,
      openGraph: {
        title: settings.seo.metaTitle.en,
        description: settings.seo.metaDescription.en,
        images: absoluteOgImageUrl ? [absoluteOgImageUrl] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: settings.seo.metaTitle.en,
        description: settings.seo.metaDescription.en,
        images: absoluteOgImageUrl ? [absoluteOgImageUrl] : undefined,
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    // Return safe defaults on error.
    return {
      title: "Portfolio",
      description: "My portfolio website",
    };
  }
}

/**
 * The root layout component for the entire application.
 * It sets up the basic HTML structure and wraps all pages with essential providers.
 *
 * The order of providers is important:
 * 1. ErrorBoundary: Catches any React rendering errors from its children.
 * 2. SessionProviderWrapper: Provides NextAuth session context to the app.
 * 3. SettingsProvider: Fetches and provides global site settings (theme, etc.).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <SessionProviderWrapper>
            <SettingsProvider>{children}</SettingsProvider>
          </SessionProviderWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
