import React from "react";
import { PortableText } from "@portabletext/react";
import { BlockContent } from "@/types/content";

interface BlockRendererProps {
  blocks: BlockContent[];
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  return <PortableText value={blocks} />;
};

export default BlockRenderer;
