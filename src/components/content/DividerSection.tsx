import React from "react";
import { getColoredSvg } from "@/lib/handlers/svgHandler";

interface DividerSectionProps {
  color: string;
  icon: { _ref: string } | { _id: string; svgData: string; color?: string };
  style: "line" | "dashed" | "dotted";
}

const DividerSection: React.FC<DividerSectionProps> = ({
  color,
  icon,
  style,
}) => {
  const getStyleClass = () => {
    switch (style) {
      case "line":
        return "border-t";
      case "dashed":
        return "border-t border-dashed";
      case "dotted":
        return "border-t border-dotted";
      default:
        return "border-t";
    }
  };

  return (
    <section className="my-4 flex items-center">
      <div
        className={`flex-grow ${getStyleClass()}`}
        style={{ borderColor: `#${color}` }}
      />
      {icon && "svgData" in icon ? (
        <div
          className="mx-4"
          dangerouslySetInnerHTML={{
            __html: getColoredSvg(icon.svgData, icon.color || color),
          }}
        />
      ) : icon && "_ref" in icon ? (
        <div className="mx-4 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-xs text-gray-500">{icon._ref}</span>
        </div>
      ) : null}
      <div
        className={`flex-grow ${getStyleClass()}`}
        style={{ borderColor: `#${color}` }}
      />
    </section>
  );
};

export default DividerSection;
