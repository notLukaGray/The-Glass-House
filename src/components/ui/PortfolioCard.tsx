"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageAsset } from '@/lib/handlers/clientHandlers';

interface PortfolioPreview {
  _id: string;
  title: { en: string };
  subhead: { en: string };
  slug: { current: string };
  coverAsset: { _ref: string };
  featured: boolean;
  locked: boolean;
  categories: Array<{ _id: string; title: { en: string } }>;
  tags: Array<{ _id: string; title: { en: string } }>;
}

interface PortfolioCardProps {
  portfolio: PortfolioPreview;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio }) => {
  const [coverImage, setCoverImage] = React.useState<{ url: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadImage = async () => {
      if (portfolio.coverAsset) {
        try {
          const imageAsset = await getImageAsset({ id: portfolio.coverAsset._ref });
          setCoverImage(imageAsset);
        } catch (error) {
          console.error('Error loading portfolio image:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [portfolio.coverAsset]);

  return (
    <Link
      href={`/portfolio/${portfolio.slug.current}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : coverImage && typeof coverImage.url === 'string' ? (
          <Image
            src={coverImage.url}
            alt={portfolio.title.en}
            width={400}
            height={225}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        {portfolio.locked && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded shadow">Locked</span>
        )}
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {portfolio.title.en}
        </h2>
        {portfolio.subhead && (
          <p className="text-gray-600 mb-4">{portfolio.subhead.en}</p>
        )}
        
        <div className="flex flex-wrap gap-2">
          {portfolio.categories?.map((category) => (
            <span
              key={category._id}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
            >
              {category.title.en}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default PortfolioCard; 