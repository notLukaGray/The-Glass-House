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
import TextSection from './TextSection';
import ListSection from './ListSection';
import InsetSection from './InsetSection';
import VideoSection from './VideoSection';
import TimelineSection from './TimelineSection';
import ButtonRowSection from './ButtonRowSection';
import RelatedSection from './RelatedSection';
import IconSection from './IconSection';
import AvatarSection from './AvatarSection';

const sectionComponentMap: Record<string, React.ComponentType<any>> = {
  textSection: TextSection,
  twoColumnSection: TwoColumnSection,
  quoteSection: QuoteSection,
  faqSection: FaqSection,
  listSection: ListSection,
  insetSection: InsetSection,
  imageSection: ImageSection,
  gallerySection: GallerySection,
  videoSection: VideoSection,
  processStepSection: ProcessStepSection,
  timelineSection: TimelineSection,
  dividerSection: DividerSection,
  calloutSection: CalloutSection,
  buttonRowSection: ButtonRowSection,
  relatedSection: RelatedSection,
  iconSection: IconSection,
  avatarSection: AvatarSection,
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