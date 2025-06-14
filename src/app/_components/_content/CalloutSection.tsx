import React from 'react';
import BlockRenderer from './BlockRenderer';
import { getColoredSvg } from '@/handlers/svgHandler';

interface CalloutSectionProps {
  title: { en: string };
  content: any[];
  icon: { _ref: string } | { _id: string; svgData: string; color?: string };
  backgroundColor: string;
}

const CalloutSection: React.FC<CalloutSectionProps> = ({ title, content, icon, backgroundColor }) => {
  return (
    <section className="my-4 p-4 rounded-lg" style={{ backgroundColor: `#${backgroundColor}` }}>
      <div className="flex items-center mb-2">
        {icon && 'svgData' in icon ? (
          <div
            className="w-6 h-6 mr-2"
            dangerouslySetInnerHTML={{ __html: getColoredSvg(icon.svgData, icon.color || "222") }}
          />
        ) : icon && '_ref' in icon ? (
          <div className="w-6 h-6 mr-2 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-500">{icon._ref}</span>
          </div>
        ) : null}
        <h3 className="font-semibold">{title.en}</h3>
      </div>
      <BlockRenderer blocks={content} />
    </section>
  );
};

export default CalloutSection; 