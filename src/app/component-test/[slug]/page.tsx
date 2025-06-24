import { getImageAsset } from "@/lib/handlers/imageHandler";
import { getSvgAsset } from "@/lib/handlers/svgHandler";
import { getVideoAsset } from "@/lib/handlers/videoHandler";
import { getSocialAsset } from "@/lib/handlers/socialHandler";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { client as sanityClient } from "@/lib/handlers/sanity";
import PerformanceMonitorComponent from "@/components/features/PerformanceMonitor";
import React from "react";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ComponentTestPageContentClient from "@/components/content/ComponentTestPageContentClient";
import type {
  ResolvedSection,
  ResolvedContentBlock,
  RelatedItem,
  ImageReference,
  VideoReference,
  SvgReference,
} from "@/types/content";

interface Section {
  _key: string;
  _type: string;
  image?: ImageReference;
  video?: VideoReference;
  icon?: SvgReference;
  avatar?: ImageReference;
  content?: ResolvedContentBlock[];
  items?: RelatedItem[];
  size?: string;
  [key: string]: unknown;
}

export const revalidate = 0;

// Helper function to resolve assets within content blocks
async function resolveContentAssets(
  content: ResolvedContentBlock[],
): Promise<ResolvedContentBlock[]> {
  if (!content || !Array.isArray(content)) return content;

  return Promise.all(
    content.map(async (block) => {
      if (block._type === "asset" && typeof block._ref === "string") {
        try {
          // Try to resolve as different asset types
          const imageAsset = await getImageAsset({ id: block._ref });
          if (imageAsset) {
            return {
              ...block,
              ...imageAsset,
              _resolvedType: "image",
            } as ResolvedContentBlock;
          }

          const svgAsset = await getSvgAsset({ id: block._ref });
          if (svgAsset) {
            return {
              ...block,
              ...svgAsset,
              _resolvedType: "svg",
            } as ResolvedContentBlock;
          }

          const videoAsset = await getVideoAsset({ id: block._ref });
          if (videoAsset) {
            return {
              ...block,
              ...videoAsset,
              _resolvedType: "video",
            } as ResolvedContentBlock;
          }

          const socialAsset = await getSocialAsset({ id: block._ref });
          if (socialAsset) {
            return {
              ...block,
              ...socialAsset,
              _resolvedType: "social",
            } as ResolvedContentBlock;
          }
        } catch (error) {
          console.error("Error resolving asset:", error);
        }
      }
      return block;
    }),
  );
}

async function resolveSectionAssets(
  sectionObj: Section,
): Promise<ResolvedSection> {
  const baseSection = { ...sectionObj };
  delete baseSection.image;
  delete baseSection.video;
  delete baseSection.icon;
  delete baseSection.avatar;

  // Resolve section-level assets
  if (sectionObj._type === "imageSection" && sectionObj.image?._ref) {
    const imageAsset = await getImageAsset({ id: sectionObj.image._ref });
    if (imageAsset) {
      const resolvedImage = { ...imageAsset, _resolvedType: "image" as const };
      return { ...baseSection, image: resolvedImage } as ResolvedSection;
    }
    return baseSection as ResolvedSection;
  }
  if (sectionObj._type === "avatarSection" && sectionObj.avatar?._ref) {
    const avatarAsset = await getImageAsset({ id: sectionObj.avatar._ref });
    if (avatarAsset) {
      const resolvedAvatar = {
        ...avatarAsset,
        _resolvedType: "image" as const,
      };
      return { ...baseSection, avatar: resolvedAvatar } as ResolvedSection;
    }
    return baseSection as ResolvedSection;
  }
  if (sectionObj._type === "iconSection" && sectionObj.icon?._ref) {
    const iconAsset = await getSvgAsset({ id: sectionObj.icon._ref });
    if (iconAsset) {
      const resolvedIcon = { ...iconAsset, _resolvedType: "svg" as const };
      return { ...baseSection, icon: resolvedIcon } as ResolvedSection;
    }
    return baseSection as ResolvedSection;
  }
  if (sectionObj._type === "videoSection" && sectionObj.video?._ref) {
    const videoAsset = await getVideoAsset({ id: sectionObj.video._ref });
    if (videoAsset) {
      const resolvedVideo = { ...videoAsset, _resolvedType: "video" as const };
      return { ...baseSection, video: resolvedVideo } as ResolvedSection;
    }
    return baseSection as ResolvedSection;
  }

  // Resolve content-level assets for textSection
  if (sectionObj._type === "textSection" && sectionObj.content) {
    const resolvedContent = await resolveContentAssets(sectionObj.content);
    return { ...baseSection, content: resolvedContent } as ResolvedSection;
  }

  // Resolve items-level assets for relatedSection
  if (sectionObj._type === "relatedSection" && sectionObj.items) {
    const items = sectionObj.items as RelatedItem[];
    const resolvedItems = await Promise.all(
      items.map(async (item) => {
        if (item.coverImage?._ref) {
          const imageAsset = await getImageAsset({ id: item.coverImage._ref });
          return {
            ...item,
            coverImage: { ...item.coverImage, url: imageAsset?.url },
          };
        }
        return item;
      }),
    );
    return { ...baseSection, items: resolvedItems } as ResolvedSection;
  }

  return baseSection as ResolvedSection;
}

export default async function ComponentTestPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  // Fetch page content directly using the Sanity client
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
  const page = await sanityClient.fetch(query, { slug });

  if (!page) {
    notFound();
  }

  const allSectionObjs = (page.sections || []).flatMap(
    (section: { content?: unknown[] }) => section.content || [],
  );
  if (!allSectionObjs.length) {
    return null;
  }

  const sectionsWithAssets = await Promise.all(
    allSectionObjs.map(resolveSectionAssets),
  );

  if (!sectionsWithAssets.length) {
    return null;
  }

  return (
    <>
      <PerformanceMonitorComponent />
      <SettingsProvider>
        <div
          className="w-screen min-h-screen transition-colors duration-300"
          style={{ backgroundColor: "var(--color-background)" }}
        >
          <Suspense fallback={<LoadingSkeleton type="gallery" />}>
            <ComponentTestPageContentClient sections={sectionsWithAssets} />
          </Suspense>
        </div>
      </SettingsProvider>
    </>
  );
}
