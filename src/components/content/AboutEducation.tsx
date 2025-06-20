import React from "react";
import { getColoredSvg } from "@/lib/handlers/clientHandlers";
import { EducationItem } from "@/types/content";

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
            <div className="font-semibold">{item.institution.en}</div>
            <div className="text-sm text-gray-500">{item.degree.en} in {item.field.en}</div>
            <div className="text-xs text-gray-400 mb-1">
              {item.startYear} - {item.endYear || 'Present'}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </section>
);
};

export default AboutEducation; 