"use client";

import React from "react";
import Image from "next/image";
import BlockRenderer from "./BlockRenderer";
import { BlockContent } from "@/types/content";

interface TwoColumnSectionProps {
  leftContent: BlockContent[];
  rightContent: BlockContent[];
  leftAsset: { url: string } | null;
  rightAsset: { url: string } | null;
}

const TwoColumnSection: React.FC<TwoColumnSectionProps> = ({
  leftContent,
  rightContent,
  leftAsset,
  rightAsset,
}) => {
  return (
    <section className="my-4 grid grid-cols-2 gap-4">
      <div>
        <BlockRenderer blocks={leftContent} />
        {leftAsset?.url && (
          <Image
            src={leftAsset.url}
            alt="Left Asset"
            width={400}
            height={300}
            className="mt-2 w-full h-auto"
          />
        )}
      </div>
      <div>
        <BlockRenderer blocks={rightContent} />
        {rightAsset?.url && (
          <Image
            src={rightAsset.url}
            alt="Right Asset"
            width={400}
            height={300}
            className="mt-2 w-full h-auto"
          />
        )}
      </div>
    </section>
  );
};

export default TwoColumnSection;
