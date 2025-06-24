"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { RelatedItem } from "@/types/content";

interface RelatedSectionProps {
  heading: { en?: string };
  items: RelatedItem[];
}

const RelatedSection: React.FC<RelatedSectionProps> = ({ heading, items }) => {
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
              {item.coverImage?.url ? (
                <Image
                  src={item.coverImage.url}
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
