import { client } from '@/_lib/handlers/sanity';
import { notFound, redirect } from 'next/navigation';
import PortfolioSectionRenderer from '@/app/_components/_content/PortfolioSectionRenderer';
import { getImageAsset, type ImageAsset } from '@/_lib/handlers/imageHandler';
import { getSvgAsset, type SvgAsset } from '@/_lib/handlers/svgHandler';
import { getVideoAsset, type VideoAsset } from '@/_lib/handlers/videoHandler';
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Suspense } from 'react';
import LoadingSkeleton from '@/app/_components/_ui/LoadingSkeleton';

interface ProjectMeta {
  _id: string;
  title: { en: string };
  subhead?: { en: string };
  colorTheme?: string;
  locked?: boolean;
  coverAsset?: { _ref: string };
  externalLink?: string;
  featured?: boolean;
  categories?: Array<{ _id: string; title: { en: string } }>;
  tags?: Array<{ _id: string; title: { en: string } }>;
  sections?: Array<Section>;
}

interface Section {
  _key: string;
  _type: string;
  content?: any[];
  leftContent?: any[];
  rightContent?: any[];
  leftAsset?: { _ref: string };
  rightAsset?: { _ref: string };
  quote?: string;
  attribution?: string;
  faqs?: Array<{ _key: string; question: string; answer: string }>;
  title?: { en: string };
  items?: any[];
  icon?: { _ref: string };
  label?: string;
  style?: string;
  image?: { _ref: string };
  fullBleed?: boolean;
  showCaption?: boolean;
  images?: Array<{ _ref: string }>;
  layout?: string;
  video?: { _ref: string };
  autoplay?: boolean;
  loop?: boolean;
  asset?: { _ref: string };
  heading?: { en: string };
  description?: { en: string };
  steps?: Array<{ _key: string; date: string; description: string }>;
  color?: string;
  size?: string;
  backgroundColor?: string;
  buttons?: Array<{ _key: string; label: string; icon?: string; style: string; url: string }>;
  avatar?: { _ref: string };
}

interface ResolvedSection extends Omit<Section, 'image' | 'images' | 'video' | 'avatar' | 'asset'> {
  image?: ImageAsset | null;
  images?: Array<ImageAsset | null>;
  video?: VideoAsset | null;
  avatar?: ImageAsset | null;
  asset?: ImageAsset | null;
}

export const revalidate = 0;

// TODO: Add authentication gate for locked portfolios
// This will be implemented later to protect locked portfolio pages

async function getPortfolio(slug: string): Promise<ProjectMeta | null> {
  const query = `*[_type == "projectMeta" && slug.current == $slug][0]{
    _id,
    title,
    subhead,
    colorTheme,
    locked,
    coverAsset,
    externalLink,
    featured,
    categories[]->,
    tags[]->,
    sections[]{
      _key,
      _type,
      content,
      leftContent,
      rightContent,
      leftAsset,
      rightAsset,
      quote,
      attribution,
      faqs[]{ _key, question, answer },
      title,
      items,
      icon,
      label,
      style,
      image,
      fullBleed,
      showCaption,
      images,
      layout,
      video,
      autoplay,
      loop,
      asset,
      heading,
      description,
      steps[]{ _key, date, description },
      color,
      size,
      backgroundColor,
      buttons[]{ _key, label, icon, style, url },
      heading,
      items,
      avatar
    }
  }`;

  return await client.fetch(query, { slug });
}

async function PortfolioHeader({ portfolio, coverImage }: { portfolio: ProjectMeta, coverImage: ImageAsset | null }) {
  return (
    <header className="mb-8">
      {coverImage && (
        <img
          src={coverImage.url}
          alt={coverImage.title?.en || portfolio.title?.en || 'Cover Image'}
          className="w-full max-h-96 object-cover rounded-lg mb-4"
        />
      )}
      <h1 className="text-4xl font-bold mb-2">{portfolio.title.en}</h1>
      {portfolio.subhead && (
        <p className="text-xl text-gray-600">{portfolio.subhead.en}</p>
      )}
    </header>
  );
}

async function PortfolioContent({ sections }: { sections: ResolvedSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <PortfolioSectionRenderer key={section._key} section={section} />
      ))}
    </div>
  );
}

export default async function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  // Show empty state if portfolio or sections are missing
  if (!portfolio || !portfolio.sections) {
    return (
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Portfolio Not Found</h1>
          <p className="text-xl text-gray-600">No portfolio data available for this slug.</p>
        </header>
      </main>
    );
  }

  // Require login for locked portfolios
  if (portfolio.locked) {
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect(`/login?callbackUrl=/portfolio/${slug}`);
    }
  }

  // Resolve cover image asset if present
  let coverImage: ImageAsset | null = null;
  if (portfolio.coverAsset?._ref) {
    coverImage = await getImageAsset({ id: portfolio.coverAsset._ref });
  }

  // Resolve all asset references in sections
  const sectionsWithAssets = await Promise.all(
    (portfolio.sections ?? []).map(async (section) => {
      if (section._type === 'imageSection' && section.image?._ref) {
        const imageAsset = await getImageAsset({ id: section.image._ref });
        return { ...section, image: imageAsset } as ResolvedSection;
      }
      if (section._type === 'gallerySection' && Array.isArray(section.images)) {
        const images = await Promise.all(
          section.images.map(async (img) =>
            img?._ref ? await getImageAsset({ id: img._ref }) : null
          )
        );
        return { ...section, images } as ResolvedSection;
      }
      if (section._type === 'videoSection' && section.video?._ref) {
        const videoAsset = await getVideoAsset({ id: section.video._ref });
        return { ...section, video: videoAsset } as ResolvedSection;
      }
      if (section._type === 'avatarSection' && section.avatar?._ref) {
        const avatarAsset = await getImageAsset({ id: section.avatar._ref });
        return { ...section, avatar: avatarAsset } as ResolvedSection;
      }
      if (section._type === 'processStepSection' && section.asset?._ref) {
        const assetImage = await getImageAsset({ id: section.asset._ref });
        return { ...section, asset: assetImage } as ResolvedSection;
      }
      return section as ResolvedSection;
    })
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSkeleton type="image" className="w-full max-h-96 mb-4" />}>
        <PortfolioHeader portfolio={portfolio} coverImage={coverImage} />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton type="gallery" />}>
        <PortfolioContent sections={sectionsWithAssets} />
      </Suspense>
    </main>
  );
} 