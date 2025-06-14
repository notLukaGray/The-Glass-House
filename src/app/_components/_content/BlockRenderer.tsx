import React from 'react';

interface Block {
  _key: string;
  _type: string;
  children?: { _key: string; _type: string; marks: string[]; text: string }[];
  markDefs?: any[];
  style?: string;
}

interface BlockRendererProps {
  blocks: Block[];
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  return (
    <div>
      {blocks.map(block => (
        <div key={block._key} className={block.style || 'normal'}>
          {block.children?.map(child => (
            <span key={child._key}>{child.text}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BlockRenderer; 