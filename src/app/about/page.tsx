import React from "react";
import { sectionComponentMap } from "@/lib/handlers/componentHandler";
import type { ReactElement } from "react";
import { getAboutDataServer } from "@/_lib/data/about";

export default async function AboutPage(): Promise<ReactElement> {
  const aboutData = await getAboutDataServer();

  if (!aboutData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-red-600">Failed to load about data.</h1>
      </main>
    );
  }

  // No more post-fetch SVG resolution needed
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
}
