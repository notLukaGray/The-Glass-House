import { createLazyComponent } from '@/lib/utils/performance';

// Lazy load all content components for better performance with tracking
const AboutWorkExperience = createLazyComponent(
  () => import("@/components/content/AboutWorkExperience").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "AboutWorkExperience"
);
const AboutEducation = createLazyComponent(
  () => import("@/components/content/AboutEducation").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "AboutEducation"
);
const AboutSoftware = createLazyComponent(
  () => import("@/components/content/AboutSoftware").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "AboutSoftware"
);
const AboutSkills = createLazyComponent(
  () => import("@/components/content/AboutSkills").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "AboutSkills"
);
const TextSection = createLazyComponent(
  () => import("@/components/content/TextSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "TextSection"
);
const TwoColumnSection = createLazyComponent(
  () => import("@/components/content/TwoColumnSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "TwoColumnSection"
);
const QuoteSection = createLazyComponent(
  () => import("@/components/content/QuoteSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "QuoteSection"
);
const FaqSection = createLazyComponent(
  () => import("@/components/content/FaqSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "FaqSection"
);
const ListSection = createLazyComponent(
  () => import("@/components/content/ListSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "ListSection"
);
const InsetSection = createLazyComponent(
  () => import("@/components/content/InsetSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "InsetSection"
);
const ImageSection = createLazyComponent(
  () => import("@/components/content/ImageSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "ImageSection"
);
const GallerySection = createLazyComponent(
  () => import("@/components/content/GallerySection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "GallerySection"
);
const VideoSection = createLazyComponent(
  () => import("@/components/content/VideoSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "VideoSection"
);
const ProcessStepSection = createLazyComponent(
  () => import("@/components/content/ProcessStepSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "ProcessStepSection"
);
const TimelineSection = createLazyComponent(
  () => import("@/components/content/TimelineSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "TimelineSection"
);
const DividerSection = createLazyComponent(
  () => import("@/components/content/DividerSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "DividerSection"
);
const CalloutSection = createLazyComponent(
  () => import("@/components/content/CalloutSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "CalloutSection"
);
const ButtonRowSection = createLazyComponent(
  () => import("@/components/content/ButtonRowSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "ButtonRowSection"
);
const RelatedSection = createLazyComponent(
  () => import("@/components/content/RelatedSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "RelatedSection"
);
const IconSection = createLazyComponent(
  () => import("@/components/content/IconSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "IconSection"
);
const AvatarSection = createLazyComponent(
  () => import("@/components/content/AvatarSection").then(m => ({ default: m.default as React.ComponentType<unknown> })),
  "AvatarSection"
);

export const sectionComponentMap = {
  workExperienceSection: AboutWorkExperience,
  educationSection: AboutEducation,
  softwareSection: AboutSoftware,
  skillsSection: AboutSkills,
};

export const iconKeyMap = {
  workExperienceSection: "icon",
  educationSection: "logo",
  softwareSection: "icon",
  skillsSection: "icon",
};

export const portfolioSectionComponentMap = {
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