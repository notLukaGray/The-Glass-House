import React from 'react';
import BlockRenderer from './BlockRenderer';
import { getColoredSvg } from '@/_lib/handlers/svgHandler';

interface InsetSectionProps {
  content: any[];
  icon: { _ref: string } | { _id: string; svgData: string; color?: string };
  label: { en: string };
  style: 'code' | 'info' | 'warning' | 'success' | 'custom';
}

const InsetSection: React.FC<InsetSectionProps> = ({ content, icon, label, style }) => {
  const getStyleClass = () => {
    switch (style) {
      case 'code': return 'bg-gray-100 border-l-4 border-gray-500';
      case 'info': return 'bg-blue-100 border-l-4 border-blue-500';
      case 'warning': return 'bg-yellow-100 border-l-4 border-yellow-500';
      case 'success': return 'bg-green-100 border-l-4 border-green-500';
      case 'custom': return 'bg-gray-100 border-l-4 border-gray-500';
      default: return 'bg-gray-100 border-l-4 border-gray-500';
    }
  };

  return (
    <section className={`my-4 p-4 ${getStyleClass()}`}>
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
        <span className="font-semibold">{label.en}</span>
      </div>
      <BlockRenderer blocks={content} />
    </section>
  );
};

export default InsetSection; 