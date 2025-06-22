"use client";

import React from "react";
import Image from "next/image";
import BlockRenderer from "./BlockRenderer";
import { BlockContent } from "@/types/content";

interface ProcessStepSectionProps {
  asset: { url: string } | null;
  heading: { en: string };
  description: BlockContent[];
}

const ProcessStepSection: React.FC<ProcessStepSectionProps> = ({
  asset,
  heading,
  description,
}) => {
  return (
    <section className="my-4 flex gap-4 items-start">
      {asset?.url && (
        <Image
          src={asset.url}
          alt="Process Step"
          width={96}
          height={96}
          className="w-24 h-24 object-cover"
        />
      )}
      <div>
        <h3 className="font-semibold">{heading.en}</h3>
        <BlockRenderer blocks={description} />
      </div>
    </section>
  );
};

export default ProcessStepSection;
