import { notFound } from 'next/navigation';
import { getImageAsset, type ImageAsset } from '@/lib/handlers/clientHandlers';
import { getSvgAsset, type SvgAsset } from '@/lib/handlers/clientHandlers';
import { getVideoAsset, type VideoAsset } from '@/lib/handlers/clientHandlers';
import React, { Suspense } from 'react';
import { SettingsProvider } from '@/components/providers/SettingsProvider';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ComponentTestPageContentClient from '@/components/content/ComponentTestPageContentClient';
import PerformanceMonitorComponent from '@/components/ui/PerformanceMonitor';

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

async function getTestPage(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content/page/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as PageMeta;
  } catch (error) {
    console.error('Error fetching test page:', error);
    return null;
  }
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