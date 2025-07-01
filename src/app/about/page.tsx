import React from "react";
import { sectionComponentMap } from "@/lib/handlers/componentHandler";
import type { ReactElement } from "react";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

// Force dynamic rendering to prevent build-time fetch errors
export const dynamic = "force-dynamic";

export default async function AboutPage(): Promise<ReactElement> {
  try {
    // Fetch about data from the new API route
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/content/about`, {
      cache: "no-store", // Disable caching for dynamic content
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch about data: ${res.status}`);
    }

    const aboutData = await res.json();
    const sectionsWithSvg = aboutData.sections || [];

    return (
      <main className="min-h-screen p-8 bg-white text-black max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About</h1>
        <div className="space-y-12">
          {sectionsWithSvg.map(
            (section: { _key: string; _type: string; items?: unknown }) => {
              const SectionComponent =
                sectionComponentMap[
                  section._type as keyof typeof sectionComponentMap
                ];
              if (!SectionComponent) return null;
              return (
                <SectionComponent
                  key={section._key}
                  {...(section as Record<string, unknown>)}
                />
              );
            },
          )}
        </div>
      </main>
    );
  } catch {
    return (
      <main className="min-h-screen p-8 bg-white text-black max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>
          Sorry, we couldn&apos;t load the about page. Please try again later.
        </p>
      </main>
    );
  }
}
