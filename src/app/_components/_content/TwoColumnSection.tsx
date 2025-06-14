"use client";

import React from 'react';
import BlockRenderer from './BlockRenderer';

interface TwoColumnSectionProps {
  leftContent: any[];
  rightContent: any[];
  leftAsset: { url: string } | null;
  rightAsset: { url: string } | null;
}

const TwoColumnSection: React.FC<TwoColumnSectionProps> = ({ leftContent, rightContent, leftAsset, rightAsset }) => {
  return (
    <section className="my-4 grid grid-cols-2 gap-4">
      <div>
        <BlockRenderer blocks={leftContent} />
        {leftAsset?.url && <img src={leftAsset.url} alt="Left Asset" className="mt-2" />}
      </div>
      <div>
        <BlockRenderer blocks={rightContent} />
        {rightAsset?.url && <img src={rightAsset.url} alt="Right Asset" className="mt-2" />}
      </div>
    </section>
  );
};

export default TwoColumnSection; 