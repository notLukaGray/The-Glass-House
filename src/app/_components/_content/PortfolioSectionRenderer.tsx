import React from 'react';
import { Section } from '@/types/sanity';
import ImageSection from './ImageSection';
import GallerySection from './GallerySection';
import FaqSection from './FaqSection';
import QuoteSection from './QuoteSection';
import ProcessStepSection from './ProcessStepSection';
import TwoColumnSection from './TwoColumnSection';
import CalloutSection from './CalloutSection';
import DividerSection from './DividerSection';

const sectionComponentMap: Record<string, React.ComponentType<any>> = {
  imageSection: ImageSection,
  gallerySection: GallerySection,
  faqSection: FaqSection,
  quoteSection: QuoteSection,
  processStepSection: ProcessStepSection,
  twoColumnSection: TwoColumnSection,
  calloutSection: CalloutSection,
  dividerSection: DividerSection,
};

interface PortfolioSectionRendererProps {
  section: Section;
}

const PortfolioSectionRenderer: React.FC<PortfolioSectionRendererProps> = ({ section }) => {
  const Component = sectionComponentMap[section._type];
  if (!Component) {
    console.warn(`No component found for section type: ${section._type}`);
    return null;
  }
  return <Component {...section} />;
};

export default PortfolioSectionRenderer; 