import React from "react";
import { getColoredSvg } from "@/_lib/handlers/svgHandler";

export interface EducationItem {
  _key: string;
  institution: { en: string };
  degree: { en: string };
  field: { en: string };
  startYear: string;
  endYear: string;
  logo?: { _ref: string } | { _id: string; svgData: string; color?: string };
}

interface AboutEducationProps {
  items: EducationItem[];
}

const AboutEducation: React.FC<AboutEducationProps> = ({ items }) => {
  return (
  <section>
    <h2 className="text-xl font-bold mb-4">Education</h2>
    <ul className="space-y-6">
      {items.map(item => (
        <li key={item._key} className="flex gap-4 items-start">
            {/* SVG Logo */}
            {item.logo && 'svgData' in item.logo ? (
              <div
                className="w-12 h-12 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: getColoredSvg(item.logo.svgData, item.logo.color || "222") }}
              />
            ) : item.logo && '_ref' in item.logo ? (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-500">{item.logo._ref}</span>
            </div>
            ) : null}
          <div>
            <div className="font-semibold">{item.institution.en}</div>
            <div className="text-sm text-gray-500">{item.degree.en} in {item.field.en}</div>
            <div className="text-xs text-gray-400 mb-1">
              {item.startYear} - {item.endYear}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </section>
);
};

export default AboutEducation; 