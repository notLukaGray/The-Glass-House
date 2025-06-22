import React, { Suspense } from "react";
import { portfolioSectionComponentMap } from "@/lib/handlers/componentHandler";
import type { ResolvedSection } from "@/lib/types/portfolio";

interface PortfolioSectionRendererProps {
  section: ResolvedSection;
}

// Loading fallback component
const SectionLoadingFallback: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// Error boundary component
const SectionErrorFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
    <h3 className="text-red-800 font-medium mb-2">Error loading section</h3>
    {error && <p className="text-red-600 text-sm">{error.message}</p>}
  </div>
);

const PortfolioSectionRenderer: React.FC<PortfolioSectionRendererProps> = ({
  section,
}) => {
  const SectionComponent = (
    portfolioSectionComponentMap as Record<string, React.ComponentType<unknown>>
  )[String(section._type)];

  if (!SectionComponent) {
    console.warn(`Unknown section type: ${section._type}`);
    return <SectionErrorFallback />;
  }

  return (
    <Suspense fallback={<SectionLoadingFallback />}>
      <SectionComponent {...(section as Record<string, unknown>)} />
    </Suspense>
  );
};

export default PortfolioSectionRenderer;
