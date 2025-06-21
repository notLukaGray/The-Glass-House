import { notFound } from 'next/navigation';
import { getImageAssetServer, type ImageAsset } from '@/_lib/handlers/serverHandlers';
import { getSvgAssetServer, type SvgAsset } from '@/_lib/handlers/serverHandlers';
import { getVideoAssetServer, type VideoAsset } from '@/_lib/handlers/serverHandlers';
import React, { Suspense } from 'react';
import { SettingsProvider } from '@/components/providers/SettingsProvider';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ComponentTestPageContentClient from '@/components/content/ComponentTestPageContentClient';
import PerformanceMonitorComponent from '@/components/ui/PerformanceMonitor';
import { getPageContentServer } from '@/_lib/data/pageContent';

interface Section {
  _key: string;
  _type: string;
  image?: { _ref: string };
  video?: { _ref: string };
  icon?: { _ref: string };
  avatar?: { _ref: string };
  size?: string;
  [key: string]: unknown;
}

interface ResolvedSection {
  _key: string;
  _type: string;
  image?: ImageAsset | null;
  video?: VideoAsset | null;
  icon?: SvgAsset | null;
  avatar?: ImageAsset | null;
  size?: string;
  [key: string]: unknown;
}

export const revalidate = 0;

async function resolveSectionAssets(sectionObj: Section): Promise<ResolvedSection> {
  const baseSection = { ...sectionObj };
  delete baseSection.image;
  delete baseSection.video;
  delete baseSection.icon;
  delete baseSection.avatar;

  if (sectionObj._type === 'imageSection' && sectionObj.image?._ref) {
    const imageAsset = await getImageAssetServer({ id: sectionObj.image._ref });
    return { ...baseSection, image: imageAsset } as ResolvedSection;
  }
  if (sectionObj._type === 'avatarSection' && sectionObj.avatar?._ref) {
    const avatarAsset = await getImageAssetServer({ id: sectionObj.avatar._ref });
    return { ...baseSection, avatar: avatarAsset } as ResolvedSection;
  }
  if (sectionObj._type === 'iconSection' && sectionObj.icon?._ref) {
    const iconAsset = await getSvgAssetServer({ id: sectionObj.icon._ref });
    return { ...baseSection, icon: iconAsset } as ResolvedSection;
  }
  if (sectionObj._type === 'videoSection' && sectionObj.video?._ref) {
    const videoAsset = await getVideoAssetServer({ id: sectionObj.video._ref });
    return { ...baseSection, video: videoAsset } as ResolvedSection;
  }
  return baseSection as ResolvedSection;
}

export default async function ComponentTestPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const page = await getPageContentServer(slug);
  
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
    <>
      <PerformanceMonitorComponent />
      <SettingsProvider>
        <div className="w-screen min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--color-background)' }}>
          <Suspense fallback={<LoadingSkeleton type="gallery" />}>
            <ComponentTestPageContentClient sections={sectionsWithAssets} />
          </Suspense>
        </div>
      </SettingsProvider>
    </>
  );
} 