import React from 'react';
import { sectionComponentMap } from '@/lib/handlers/componentHandler';
import type { ReactElement } from 'react';

export default async function AboutPage(): Promise<ReactElement> {
  // Fetch about data from API route
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content/about`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    return (
      <main className="min-h-screen p-8 bg-white text-black max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About</h1>
        <p className="text-red-600 text-center">Failed to load about data.</p>
      </main>
    );
  }
  
  const aboutData = await response.json();

  // No more post-fetch SVG resolution needed
  const sectionsWithSvg = aboutData.sections || [];

  return (
    <main className="min-h-screen p-8 bg-white text-black max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">About</h1>
      <div className="space-y-12">
        {sectionsWithSvg.map((section: { _key: string; _type: string; items?: unknown }) => {
          const SectionComponent = sectionComponentMap[section._type as keyof typeof sectionComponentMap];
          if (!SectionComponent) return null;
          return <SectionComponent key={section._key} {...(section as Record<string, unknown>)} />;
        })}
      </div>
    </main>
  );
} 