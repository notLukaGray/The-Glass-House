import { client } from '@/_lib/sanity';
import { sectionComponentMap, iconKeyMap } from '@/handlers/componentHandler';
import type { ReactElement } from 'react';

export default async function AboutPage(): Promise<ReactElement> {
  // Batch fetch about page, sections, items, and SVGs in one GROQ query
  const aboutData: any = await client.fetch(`*[_type == "about"][0]{
    user,
    sections[]{
      ...,
      items[]{
        ...,
        icon->{
          _id,
          svgData,
          color
        },
        logo->{
          _id,
          svgData,
          color
        }
      }
    }
  }`);

  // No more post-fetch SVG resolution needed
  const sectionsWithSvg = aboutData.sections || [];

  return (
    <main className="min-h-screen p-8 bg-white text-black max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">About</h1>
      <div className="space-y-12">
        {sectionsWithSvg.map((section: any) => {
          const SectionComponent = sectionComponentMap[section._type as keyof typeof sectionComponentMap];
          if (!SectionComponent) return null;
          return <SectionComponent key={section._key} items={section.items} />;
        })}
      </div>
    </main>
  );
} 