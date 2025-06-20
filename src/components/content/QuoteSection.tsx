import React from 'react';
import BlockRenderer from './BlockRenderer';
import { BlockContent } from '@/types/content';

interface QuoteSectionProps {
  quote: BlockContent[];
  attribution: { en: string };
}

const QuoteSection: React.FC<QuoteSectionProps> = ({ quote, attribution }) => {
  return (
    <section className="my-4 border-l-4 border-gray-300 pl-4">
      <BlockRenderer blocks={quote} />
      <div className="text-sm text-gray-500 mt-2">— {attribution.en}</div>
    </section>
  );
};

export default QuoteSection; 