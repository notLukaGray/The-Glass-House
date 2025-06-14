"use client";
import React from "react";
import { getColoredSvg } from "@/handlers/svgHandler";

export interface SkillItem {
  _key: string;
  name: { en: string };
  description: string;
  icon?: { _ref: string } | { _id: string; svgData: string; color?: string };
}

interface AboutSkillsProps {
  items: SkillItem[];
}

const AboutSkills: React.FC<AboutSkillsProps> = ({ items }) => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Skills</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(item => (
          <li key={item._key} className="bg-gray-100 rounded-lg p-4 flex gap-4 items-center">
            {/* SVG Icon (future-proof) */}
            {item.icon && 'svgData' in item.icon ? (
              <div
                className="w-8 h-8 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: getColoredSvg(item.icon.svgData, item.icon.color || "222") }}
              />
            ) : item.icon && '_ref' in item.icon ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-500">{item.icon._ref}</span>
              </div>
            ) : null}
            <div>
              <div className="font-semibold mb-1">{item.name.en}</div>
              <div className="text-sm text-gray-700">{item.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AboutSkills; 