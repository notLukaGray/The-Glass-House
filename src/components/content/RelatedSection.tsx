"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageAsset } from '@/lib/handlers/clientHandlers';

interface RelatedSectionProps {
  heading: { en?: string };
  items: Array<{
    _id: string;
    title?: { en?: string };
    subhead?: { en?: string };
    coverImage?: { _ref: string };
  }>;
}

const RelatedSection: React.FC<RelatedSectionProps> = ({ heading, items }) => {
  const [imageUrls, setImageUrls] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const fetchImages = async () => {
      const urls: Record<string, string> = {};
      for (const item of items) {
        if (item.coverImage) {
          const imageAsset = await getImageAsset({ id: item.coverImage._ref });
          if (imageAsset) urls[item._id] = imageAsset.url;
        }
      }
      setImageUrls(urls);
    };
    fetchImages();
  }, [items]);

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">{heading?.en || "Related"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <Link 
            key={item._id || index}
            href={`/portfolio/${item._id}`}
            className="group"
          >
            <div className="relative aspect-video mb-2 overflow-hidden">
              {imageUrls[item._id] ? (
                <Image 
                  src={imageUrls[item._id]} 
                  alt={item.title?.en || "Related item"}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
            </div>
            <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
              {item.title?.en || "Untitled"}
            </h3>
            {item.subhead?.en && (
              <p className="text-sm text-gray-600">{item.subhead.en}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedSection; 