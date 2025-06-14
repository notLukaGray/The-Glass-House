"use client";

import React from 'react';
import BlockRenderer from './BlockRenderer';

interface ProcessStepSectionProps {
  asset: { url: string } | null;
  heading: { en: string };
  description: any[];
}

const ProcessStepSection: React.FC<ProcessStepSectionProps> = ({ asset, heading, description }) => {
  return (
    <section className="my-4 flex gap-4 items-start">
      {asset?.url && <img src={asset.url} alt="Process Step" className="w-24 h-24 object-cover" />}
      <div>
        <h3 className="font-semibold">{heading.en}</h3>
        <BlockRenderer blocks={description} />
      </div>
    </section>
  );
};

export default ProcessStepSection; 