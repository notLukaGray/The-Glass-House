"use client";
import React from "react";
import { getColoredSvg } from "@/_lib/handlers/svgHandler";

export interface WorkExperienceItem {
  _key: string;
  company: { en: string };
  role: { en: string };
  startYear: string;
  endYear?: string;
  description: any[];
  icon?: { _ref: string } | { _id: string; svgData: string; color?: string };
}

interface AboutWorkExperienceProps {
  items: WorkExperienceItem[];
}

const AboutWorkExperience: React.FC<AboutWorkExperienceProps> = ({ items }) => (
  <section>
    <h2 className="text-xl font-bold mb-4">Work Experience</h2>
    <ul className="space-y-6">
      {items.map(item => (
        <li key={item._key} className="flex gap-4 items-start">
          {/* SVG Icon */}
          {item.icon && 'svgData' in item.icon ? (
            <div
              className="w-12 h-12 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: getColoredSvg(item.icon.svgData, item.icon.color || "222") }}
            />
          ) : item.icon && '_ref' in item.icon ? (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-500">{item.icon._ref}</span>
            </div>
          ) : null}
          <div>
            <div className="font-semibold">{item.company.en}</div>
            <div className="text-sm text-gray-500">{item.role.en}</div>
            <div className="text-xs text-gray-400 mb-1">
              {item.startYear} - {item.endYear || 'Present'}
            </div>
            <div className="text-sm text-gray-700">
              {/* Render description as plain text for now */}
              {item.description && item.description.map(block =>
                block.children?.map((span: any) => span.text).join(' ')
              ).join(' ')}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default AboutWorkExperience; 