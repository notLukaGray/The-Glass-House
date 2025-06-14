import React from 'react';
import BlockRenderer from './BlockRenderer';

interface TextSectionProps {
  content: any[];
}

const TextSection: React.FC<TextSectionProps> = ({ content }) => {
  return (
    <section className="my-4">
      <BlockRenderer blocks={content} />
    </section>
  );
};

export default TextSection; 