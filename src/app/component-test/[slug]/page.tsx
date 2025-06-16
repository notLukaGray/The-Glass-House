import { client } from '@/_lib/sanity';
import { portfolioSectionComponentMap } from '@/handlers/componentHandler';
import { notFound } from 'next/navigation';
import { getImageAsset } from '@/handlers/imageHandler';
import { getSvgAsset } from '@/handlers/svgHandler';
import { getVideoAsset } from '@/handlers/videoHandler';
import React from 'react';

export const revalidate = 0;

async function getTestPage(slug: string) {
  const query = `*[_type == "pageMeta" && slug.current == $slug][0]{
    _id,
    title,
    subhead,
    sections[]->{
      _id,
      order,
      content[] {
        ...,
        image,
        video,
        icon,
        avatar
      }
    }
  }`;
  return await client.fetch(query, { slug });
}

async function resolveSectionAssets(sectionObj: any) {
  // ImageSection
  if (sectionObj._type === 'imageSection' && sectionObj.image?._ref) {
    const imageAsset = await getImageAsset({ id: sectionObj.image._ref });
    return { ...sectionObj, image: imageAsset };
  }
  // AvatarSection
  if (sectionObj._type === 'avatarSection' && sectionObj.avatar?._ref) {
    const avatarAsset = await getImageAsset({ id: sectionObj.avatar._ref });
    return { ...sectionObj, avatar: avatarAsset };
  }
  // IconSection
  if (sectionObj._type === 'iconSection' && sectionObj.icon?._ref) {
    const iconAsset = await getSvgAsset({ id: sectionObj.icon._ref });
    return { ...sectionObj, icon: iconAsset };
  }
  // VideoSection
  if (sectionObj._type === 'videoSection' && sectionObj.video?._ref) {
    const videoAsset = await getVideoAsset({ id: sectionObj.video._ref });
    return { ...sectionObj, video: videoAsset };
  }
  // Add more section types as needed...
  return sectionObj;
}

export default async function ComponentTestPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const page = await getTestPage(slug);
  if (!page) {
    notFound();
  }
  // Flatten all section objects from all referenced sections
  const allSectionObjs = (page.sections || []).flatMap((section: any) => section.content || []);
  if (!allSectionObjs.length) {
    return null;
  }
  // Resolve all asset references in section objects
  const sectionsWithAssets = await Promise.all(
    allSectionObjs.map(resolveSectionAssets)
  );
  if (!sectionsWithAssets.length) {
    return null;
  }
  return (
    <div className="w-screen min-h-screen bg-black p-0 m-0">
      <main className="py-12 space-y-12">
        {sectionsWithAssets.map((section: any) => {
          const SectionComponent = portfolioSectionComponentMap[section._type as keyof typeof portfolioSectionComponentMap];
          if (!SectionComponent) return (
            <div key={section._key} className="p-4 border border-red-300 bg-red-50">Unknown section type: {section._type}</div>
          );
          return <SectionComponent key={section._key} {...section} size={section.size} />;
        })}
      </main>
    </div>
  );
} 