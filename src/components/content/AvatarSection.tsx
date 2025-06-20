"use client";

import React from 'react';
import Image from 'next/image';

interface AvatarSectionProps {
  avatar: { url: string } | null;
  heading?: { en?: string };
  description?: { en?: string };
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ avatar, heading, description }) => {
  return (
    <section className="my-4 flex gap-4 items-start">
      {avatar?.url && (
        <Image
          src={avatar.url}
          alt={heading?.en || ""}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover"
        />
      )}
      <div>
        <h3 className="font-semibold">{heading?.en || ""}</h3>
        {description?.en && <p className="text-gray-600">{description.en}</p>}
      </div>
    </section>
  );
};

export default AvatarSection; 