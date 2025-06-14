"use client";

import React from 'react';

interface GallerySectionProps {
  images: Array<{ url: string; caption?: { en?: string } } | null>;
  showCaption: boolean;
}

const GallerySection: React.FC<GallerySectionProps> = ({ images, showCaption }) => {
  return (
    <section className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative">
          {image?.url && <img src={image.url} alt={`Gallery Image ${index + 1}`} className="w-full h-48 object-cover" />}
          {showCaption && image?.caption?.en && (
            <p className="text-sm text-gray-500 mt-2">{image.caption.en}</p>
          )}
        </div>
      ))}
    </section>
  );
};

export default GallerySection; 