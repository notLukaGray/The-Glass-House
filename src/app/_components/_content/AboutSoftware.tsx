"use client";

import React from "react";
import { getColoredSvg } from "@/_lib/handlers/svgHandler";

export interface SoftwareItem {
  _key: string;
  name: { en: string };
  icon?: { _ref: string } | { _id: string; svgData: string; color?: string };
}

interface AboutSoftwareProps {
  items: SoftwareItem[];
}

const AboutSoftware: React.FC<AboutSoftwareProps> = ({ items }) => {
  return (
  <section>
    <h2 className="text-xl font-bold mb-4">Software</h2>
    <ul className="flex flex-wrap gap-6">
      {items.map(item => (
        <li key={item._key} className="flex flex-col items-center w-24">
            {/* SVG Icon */}
            {item.icon && 'svgData' in item.icon ? (
              <div
                className="w-12 h-12 flex items-center justify-center mb-2"
                dangerouslySetInnerHTML={{ __html: getColoredSvg(item.icon.svgData, item.icon.color || "222") }}
              />
            ) : item.icon && '_ref' in item.icon ? (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              <span className="text-xs text-gray-500">{item.icon._ref}</span>
            </div>
            ) : null}
          <div className="text-center text-sm font-medium">{item.name.en}</div>
        </li>
      ))}
    </ul>
  </section>
);
};

export default AboutSoftware; 