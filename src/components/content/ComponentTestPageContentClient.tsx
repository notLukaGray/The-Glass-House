"use client";

import React from "react";
import { usePerformanceMonitor } from "@/lib/utils/performance";
import PortfolioSectionRenderer from "./PortfolioSectionRenderer";

interface ResolvedSection {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

interface ComponentTestPageContentClientProps {
  sections: ResolvedSection[];
}

const ComponentTestPageContentClient: React.FC<
  ComponentTestPageContentClientProps
> = ({ sections }) => {
  usePerformanceMonitor("ComponentTestPageContent");

  return (
    <main className="py-12 space-y-12" style={{ color: "var(--color-text)" }}>
      {sections.map((section) => (
        <PortfolioSectionRenderer key={section._key} section={section} />
      ))}
    </main>
  );
};

export default ComponentTestPageContentClient;
