"use client";
import React from "react";
import { getColoredSvg } from "@/lib/handlers/svgHandler";
import { WorkExperienceItem } from "@/types/content";

interface AboutWorkExperienceProps {
  items: WorkExperienceItem[];
}

// Extract plain text from block content
function extractTextFromBlocks(
  blocks: WorkExperienceItem["description"],
): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      if (block._type === "block" && block.children) {
        return block.children
          .map((child: { text?: string }) => child.text || "")
          .join("");
      }
      return "";
    })
    .join(" ");
}

const AboutWorkExperience: React.FC<AboutWorkExperienceProps> = ({ items }) => (
  <section>
    <h2 className="text-xl font-bold mb-4">Work Experience</h2>
    <ul className="space-y-6">
      {items.map((item) => (
        <li key={item._key} className="flex gap-4 items-start">
          {/* SVG Icon */}
          {item.icon && "svgData" in item.icon ? (
            <div
              className="w-12 h-12 flex items-center justify-center"
              dangerouslySetInnerHTML={{
                __html: getColoredSvg(
                  item.icon.svgData,
                  item.icon.color || "222",
                ),
              }}
            />
          ) : item.icon && "_ref" in item.icon ? (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-500">{item.icon._ref}</span>
            </div>
          ) : null}
          <div>
            <div className="font-semibold">{item.company.en}</div>
            <div className="text-sm text-gray-500">{item.role.en}</div>
            <div className="text-xs text-gray-400 mb-1">
              {item.startYear} - {item.endYear || "Present"}
            </div>
            <div className="text-sm text-gray-700">
              {extractTextFromBlocks(item.description)}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default AboutWorkExperience;
