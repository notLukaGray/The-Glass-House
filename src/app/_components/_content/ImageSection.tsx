"use client";

import React from 'react';

interface ImageSectionProps {
  image: { url: string; caption?: { en?: string } } | null;
  fullBleed: boolean;
  showCaption: boolean;
}

const ImageSection: React.FC<ImageSectionProps> = ({ image, fullBleed, showCaption }) => {
  return (
    <section className={`my-4 ${fullBleed ? 'w-full' : 'max-w-2xl mx-auto'}`}>
      {image?.url && <img src={image.url} alt="Image" className="w-full" />}
      {showCaption && image?.caption?.en && <p className="text-sm text-gray-500 mt-2">{image.caption.en}</p>}
    </section>
  );
};

export default ImageSection; 