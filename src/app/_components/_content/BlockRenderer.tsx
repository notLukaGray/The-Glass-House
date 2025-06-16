import React from 'react';
import { PortableText } from '@portabletext/react';

interface BlockRendererProps {
  blocks: any[];
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  return <PortableText value={blocks} />;
};

export default BlockRenderer; 