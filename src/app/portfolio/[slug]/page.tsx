import { client } from '@/_lib/sanity';
import { notFound, redirect } from 'next/navigation';
import PortfolioSectionRenderer from '@/app/_components/_content/PortfolioSectionRenderer';
import { getImageAsset } from '@/handlers/imageHandler';
import { getSvgAsset } from '@/handlers/svgHandler';
import { getVideoAsset } from '@/handlers/videoHandler';
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { 
  ProjectMeta, 
  ImageSection, 
  GallerySection, 
  VideoSection,
  AvatarSection,
  ProcessStepSection,
  ImageAsset,
  VideoAsset,
  SvgAsset
} from '@/_lib/sanity';

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

  return await client.fetch<ProjectMeta>(query, { slug });
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
      // ImageSection
      if (section._type === 'imageSection' && (section as ImageSection).image?._ref) {
        const imageAsset = await getImageAsset({ id: (section as ImageSection).image._ref });
        return { ...section, image: imageAsset };
      }
      // GallerySection
      if (section._type === 'gallerySection' && Array.isArray((section as GallerySection).images)) {
        const images = await Promise.all(
          (section as GallerySection).images.map(async (img) =>
            img?._ref ? await getImageAsset({ id: img._ref }) : null
          )
        );
        return { ...section, images };
      }
      // VideoSection
      if (section._type === 'videoSection' && (section as VideoSection).video?._ref) {
        const videoAsset = await getVideoAsset({ id: (section as VideoSection).video._ref });
        return { ...section, video: videoAsset };
      }
      // AvatarSection
      if (section._type === 'avatarSection' && (section as AvatarSection).avatar?._ref) {
        const avatarAsset = await getImageAsset({ id: (section as AvatarSection).avatar._ref });
        return { ...section, avatar: avatarAsset };
      }
      // ProcessStepSection
      if (section._type === 'processStepSection' && (section as ProcessStepSection).asset?._ref) {
        const assetImage = await getImageAsset({ id: (section as ProcessStepSection).asset._ref });
        return { ...section, asset: assetImage };
      }
      return section;
    })
  );

  return (
    <main className="container mx-auto px-4 py-8">
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

      <div className="space-y-8">
        {sectionsWithAssets.map((section) => (
          <PortfolioSectionRenderer key={section._key} section={section} />
        ))}
      </div>
    </main>
  );
} 