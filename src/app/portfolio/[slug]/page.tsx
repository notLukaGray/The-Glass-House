"use server";

import { client } from '@/_lib/sanity';
import { notFound } from 'next/navigation';
import PortfolioSectionRenderer from '@/app/_components/_content/PortfolioSectionRenderer';
import { getImageAsset } from '@/handlers/imageHandler';
import { getSvgAsset } from '@/handlers/svgHandler';
import { getVideoAsset } from '@/handlers/videoHandler';

// TODO: Add authentication gate for locked portfolios
// This will be implemented later to protect locked portfolio pages

async function getPortfolio(slug: string) {
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

  const portfolio = await client.fetch(query, { slug });
  return portfolio;
}

export default async function PortfolioPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) {
    notFound();
  }

  // TODO: Add authentication check for locked portfolios
  // if (portfolio.locked) {
  //   // Redirect to login or show auth gate
  // }

  // Resolve cover image asset if present
  let coverImage = null;
  if (portfolio.coverAsset?._ref) {
    coverImage = await getImageAsset({ id: portfolio.coverAsset._ref });
  }

  // Resolve all asset references in sections
  const sectionsWithAssets = await Promise.all(
    portfolio.sections.map(async (section: any) => {
      // ImageSection
      if (section._type === 'imageSection' && section.image?._ref) {
        const imageAsset = await getImageAsset({ id: section.image._ref });
        return { ...section, image: imageAsset };
      }
      // GallerySection
      if (section._type === 'gallerySection' && Array.isArray(section.images)) {
        const images = await Promise.all(
          section.images.map(async (img: any) =>
            img?._ref ? await getImageAsset({ id: img._ref }) : null
          )
        );
        return { ...section, images };
      }
      // AvatarSection
      if (section._type === 'avatarSection' && section.avatar?._ref) {
        const avatarAsset = await getImageAsset({ id: section.avatar._ref });
        return { ...section, avatar: avatarAsset };
      }
      // ProcessStepSection
      if (section._type === 'processStepSection' && section.asset?._ref) {
        const assetImage = await getImageAsset({ id: section.asset._ref });
        return { ...section, asset: assetImage };
      }
      // TwoColumnSection
      if (section._type === 'twoColumnSection') {
        let leftAsset = section.leftAsset;
        let rightAsset = section.rightAsset;
        if (leftAsset?._ref) leftAsset = await getImageAsset({ id: leftAsset._ref });
        if (rightAsset?._ref) rightAsset = await getImageAsset({ id: rightAsset._ref });
        return { ...section, leftAsset, rightAsset };
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
      // RelatedSection (cover images for related items)
      if (section._type === 'relatedSection' && Array.isArray(section.items)) {
        const items = await Promise.all(
          section.items.map(async (item: any) => {
            if (item.coverImage?._ref) {
              const coverImage = await getImageAsset({ id: item.coverImage._ref });
              return { ...item, coverImage };
            }
            return item;
          })
        );
        return { ...section, items };
      }
      // Add more section types as needed...
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
        {sectionsWithAssets.map((section: any) => (
          <PortfolioSectionRenderer key={section._key} section={section} />
        ))}
      </div>
    </main>
  );
} 