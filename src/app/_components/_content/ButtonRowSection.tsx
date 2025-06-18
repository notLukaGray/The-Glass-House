import React from 'react';
import { getColoredSvg } from '@/_lib/handlers/svgHandler';

interface Button {
  _key: string;
  label: { en: string };
  icon: { _ref: string } | { _id: string; svgData: string; color?: string };
  style: 'primary' | 'secondary';
  url: string;
}

interface ButtonRowSectionProps {
  buttons: Button[];
}

const ButtonRowSection: React.FC<ButtonRowSectionProps> = ({ buttons }) => {
  return (
    <section className="my-4 flex gap-4">
      {buttons.map(button => (
        <a
          key={button._key}
          href={button.url}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            button.style === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          {button.icon && 'svgData' in button.icon ? (
            <div
              className="w-5 h-5"
              dangerouslySetInnerHTML={{ __html: getColoredSvg(button.icon.svgData, button.icon.color || "222") }}
            />
          ) : button.icon && '_ref' in button.icon ? (
            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-500">{button.icon._ref}</span>
            </div>
          ) : null}
          <span>{button.label.en}</span>
        </a>
      ))}
    </section>
  );
};

export default ButtonRowSection; 