"use client";

import React from "react";
import Image from "next/image";

interface GallerySectionProps {
  images: Array<{
    url: string;
    caption?: { en?: string };
    altCaption?: { en?: string };
    altDescription?: { en?: string };
    description?: { en?: string };
    title?: { en?: string };
  }>;
  layout?: string;
  columns?: number;
  gap?: string;
  aspectRatio?: string;
  showCaptions?: boolean;
  // Accept any extra props (for flattening)
  [key: string]: unknown;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  images,
  showCaptions,
}) => {
  return (
    <section className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative">
          {image?.url && (
            <Image
              src={image.url}
              alt={`Gallery Image ${index + 1}`}
              width={600}
              height={192}
              className="w-full h-48 object-cover"
            />
          )}
          {showCaptions && image?.caption?.en && (
            <p className="text-sm text-gray-500 mt-2">{image.caption.en}</p>
          )}
        </div>
      ))}
    </section>
  );
};

export default GallerySection;
