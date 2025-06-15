import { client } from '@/_lib/sanity';
import { portfolioSectionComponentMap } from '@/handlers/componentHandler';
import { notFound } from 'next/navigation';
import { getImageAsset } from '@/handlers/imageHandler';
import { getSvgAsset } from '@/handlers/svgHandler';
import { getVideoAsset } from '@/handlers/videoHandler';
import React from 'react';

async function getTestPage(slug: string) {
  const query = `*[_type == "pageMeta" && slug.current == $slug][0]{
    _id,
    title,
    subhead,
    sections[]{
      ...,
      image,
      video,
      icon,
      avatar
    }
  }`;
  return await client.fetch(query, { slug });
}

async function resolveSectionAssets(section: any) {
  // ImageSection
  if (section._type === 'imageSection' && section.image?._ref) {
    const imageAsset = await getImageAsset({ id: section.image._ref });
    return { ...section, image: imageAsset };
  }
  // AvatarSection
  if (section._type === 'avatarSection' && section.avatar?._ref) {
    const avatarAsset = await getImageAsset({ id: section.avatar._ref });
    return { ...section, avatar: avatarAsset };
  }
  // IconSection
  if (section._type === 'iconSection' && section.icon?._ref) {
    const iconAsset = await getSvgAsset({ id: section.icon._ref });
    return { ...section, icon: iconAsset };
  }
  // VideoSection
  if (section._type === 'videoSection' && section.video?._ref) {
    const videoAsset = await getVideoAsset({ id: section.video._ref });
    return { ...section, video: videoAsset };
  }
  // Add more section types as needed...
  return section;
}

export default async function ComponentTestPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const page = await getTestPage(slug);
  if (!page) {
    notFound();
  }
  // Resolve all asset references in sections
  const sectionsWithAssets = await Promise.all(
    (page.sections || []).map(resolveSectionAssets)
  );
  return (
    <main className="max-w-2xl mx-auto py-12 space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Sanity Component Test</h1>
      <h2 className="text-xl font-semibold mb-4">{page.title?.en || 'Untitled Page'}</h2>
      {sectionsWithAssets.length ? (
        sectionsWithAssets.map((section: any) => {
          const SectionComponent = portfolioSectionComponentMap[section._type as keyof typeof portfolioSectionComponentMap];
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