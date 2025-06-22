import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
// TODO: Use new API route or shared client for settings fetching if needed.

/**
 * Generates dynamic metadata for the site using settings from Sanity.
 * This function is called at build time and on revalidation to ensure
 * the site's metadata (title, description, social images) is always up-to-date.
 *
 * @returns {Promise<Metadata>} A promise that resolves to the metadata object.
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch settings from the API route
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const res = await fetch(`${baseUrl}/api/settings?type=build`, {
      next: { revalidate: 60 },
    });
    const settings = await res.json();

    if (!settings) {
      return {
        title: "Portfolio",
        description: "My portfolio website",
      };
    }

    const { title, description } = settings.basicInfo;
    const faviconUrl = settings.basicInfo.favicon?.url;
    const ogImageUrl = settings.seo.ogImage?.url;

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
 * 4. Analytics: Tracks page views and user interactions for insights.
 * 5. SpeedInsights: Monitors and reports on page performance metrics.
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
