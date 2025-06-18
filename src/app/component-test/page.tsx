import { client } from '@/_lib/handlers/sanity';
import { portfolioSectionComponentMap } from '@/_lib/handlers/componentHandler';
import React from 'react';

async function getTestPage() {
  // Fetch the first page document (or adjust query as needed)
  const query = `*[_type == "pageMeta"][0]{
    _id,
    title,
    subhead,
    sections[]{
      ...,
      image, // pass through all fields for section
      video,
      icon,
      avatar
    }
  }`;
  return await client.fetch(query);
}

export default async function ComponentTestPage() {
  const page = await getTestPage();
  if (!page) {
    return <main className="max-w-2xl mx-auto py-12"><h1>No test page found in Sanity.</h1></main>;
  }
  return (
    <main className="max-w-2xl mx-auto py-12 space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Sanity Component Test</h1>
      <h2 className="text-xl font-semibold mb-4">{page.title?.en || 'Untitled Page'}</h2>
      {page.sections?.length ? (
        page.sections.map((section: any) => {
          const SectionComponent = portfolioSectionComponentMap[section._type];
          if (!SectionComponent) return (
            <div key={section._key} className="p-4 border border-red-300 bg-red-50">Unknown section type: {section._type}</div>
          );
          return <SectionComponent key={section._key} {...section} />;
        })
      ) : (
        <div className="text-gray-500">No sections found.</div>
      )}
    </main>
  );
} 