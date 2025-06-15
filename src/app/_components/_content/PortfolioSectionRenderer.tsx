import React from 'react';
import { portfolioSectionComponentMap } from '@/handlers/componentHandler';

interface Section {
  _key: string;
  _type: string;
  [key: string]: any;
}

interface PortfolioSectionRendererProps {
  section: Section;
}

// Add index signature to allow string keys
const sectionMap: { [key: string]: React.FC<any> } = portfolioSectionComponentMap;

const PortfolioSectionRenderer: React.FC<PortfolioSectionRendererProps> = ({ section }) => {
  const SectionComponent = sectionMap[section._type];
  if (!SectionComponent) {
    console.warn(`Unknown section type: ${section._type}`);
    return null;
  }
  return <SectionComponent {...section} />;
};

export default PortfolioSectionRenderer; 