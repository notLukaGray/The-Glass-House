import React from "react";
import { sectionComponentMap } from "@/lib/handlers/componentHandler";
import type { ReactElement } from "react";

/**
 * About page component that displays information about the portfolio owner.
 * Fetches about data from the API and renders it using the component handler system.
 */
export default async function AboutPage(): Promise<ReactElement> {
  try {
    // Fetch about data from the new API route
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const res = await fetch(`${baseUrl}/api/content/about`, {
      next: { revalidate: 60 },
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
  } catch (error) {
    console.error("Error fetching about data:", error);
    return (
      <main className="min-h-screen p-8 bg-white text-black max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About</h1>
        <div className="text-center text-gray-600">
          <p>Unable to load about content at this time.</p>
          <p>Please try again later.</p>
        </div>
      </main>
    );
  }
}
