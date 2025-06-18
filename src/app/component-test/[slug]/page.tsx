import { client } from '@/_lib/handlers/sanity';
import { portfolioSectionComponentMap } from '@/_lib/handlers/componentHandler';
import { notFound } from 'next/navigation';
import { getImageAsset, type ImageAsset } from '@/_lib/handlers/imageHandler';
import { getSvgAsset, type SvgAsset } from '@/_lib/handlers/svgHandler';
import { getVideoAsset, type VideoAsset } from '@/_lib/handlers/videoHandler';
import React, { Suspense } from 'react';
import { SettingsProvider } from '@/app/_components/_providers/SettingsProvider';
import LoadingSkeleton from '@/app/_components/_ui/LoadingSkeleton';
import PortfolioSectionRenderer from '@/app/_components/_content/PortfolioSectionRenderer';

interface PageMeta {
  _id: string;
  title?: { en: string };
  subhead?: { en: string };
  sections?: Array<{
    _id: string;
    order: number;
    content: Array<Section>;
  }>;
}

interface Section {
  _key: string;
  _type: string;
  image?: { _ref: string };
  video?: { _ref: string };
  icon?: { _ref: string };
  avatar?: { _ref: string };
  size?: string;
  [key: string]: any;
}

interface ResolvedSection {
  _key: string;
  _type: string;
  image?: ImageAsset | null;
  video?: VideoAsset | null;
  icon?: SvgAsset | null;
  avatar?: ImageAsset | null;
  size?: string;
  [key: string]: any;
}

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
  return await client.fetch(query, { slug }) as PageMeta;
}

async function resolveSectionAssets(sectionObj: Section): Promise<ResolvedSection> {
  const baseSection = { ...sectionObj };
  delete baseSection.image;
  delete baseSection.video;
  delete baseSection.icon;
  delete baseSection.avatar;

  if (sectionObj._type === 'imageSection' && sectionObj.image?._ref) {
    const imageAsset = await getImageAsset({ id: sectionObj.image._ref });
    return { ...baseSection, image: imageAsset } as ResolvedSection;
  }
  if (sectionObj._type === 'avatarSection' && sectionObj.avatar?._ref) {
    const avatarAsset = await getImageAsset({ id: sectionObj.avatar._ref });
    return { ...baseSection, avatar: avatarAsset } as ResolvedSection;
  }
  if (sectionObj._type === 'iconSection' && sectionObj.icon?._ref) {
    const iconAsset = await getSvgAsset({ id: sectionObj.icon._ref });
    return { ...baseSection, icon: iconAsset } as ResolvedSection;
  }
  if (sectionObj._type === 'videoSection' && sectionObj.video?._ref) {
    const videoAsset = await getVideoAsset({ id: sectionObj.video._ref });
    return { ...baseSection, video: videoAsset } as ResolvedSection;
  }
  return baseSection as ResolvedSection;
}

async function PageContent({ sections }: { sections: ResolvedSection[] }) {
  return (
    <main className="py-12 space-y-12" style={{ color: 'var(--color-text)' }}>
      {sections.map((section) => (
        <PortfolioSectionRenderer key={section._key} section={section} />
      ))}
    </main>
  );
}

export default async function ComponentTestPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const page = await getTestPage(slug);
  
  if (!page) {
    notFound();
  }

  const allSectionObjs = (page.sections || []).flatMap((section) => section.content || []);
  if (!allSectionObjs.length) {
    return null;
  }

  const sectionsWithAssets = await Promise.all(
    allSectionObjs.map(resolveSectionAssets)
  );

  if (!sectionsWithAssets.length) {
    return null;
  }

  return (
    <SettingsProvider>
      <div className="w-screen min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--color-background)' }}>
        <Suspense fallback={<LoadingSkeleton type="gallery" />}>
          <PageContent sections={sectionsWithAssets} />
        </Suspense>
      </div>
    </SettingsProvider>
  );
} 