"use client";

import React from 'react';

interface IconSectionProps {
  icon: { svgData: string } | null;
  heading?: { en?: string };
  description?: { en?: string };
}

const IconSection: React.FC<IconSectionProps> = ({ icon, heading, description }) => {
  return (
    <section className="my-4 flex gap-4 items-start">
      {icon?.svgData && (
        <div 
          className="w-12 h-12"
          dangerouslySetInnerHTML={{ __html: icon.svgData }}
        />
      )}
      <div>
        <h3 className="font-semibold">{heading?.en || ""}</h3>
        {description?.en && <p className="text-gray-600">{description.en}</p>}
      </div>
    </section>
  );
};

export default IconSection; 