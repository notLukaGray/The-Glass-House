// Shared TypeScript interfaces for content components

// Block content interface for Sanity portable text
export interface BlockContent {
  _type: string;
  _key: string;
  style?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  children: BlockContentChild[];
  [key: string]: unknown;
}

// Child elements within block content
export interface BlockContentChild {
  _type: string;
  _key: string;
  text?: string;
  marks?: string[];
  [key: string]: unknown;
}

// Icon reference interface
export interface IconReference {
  _ref: string;
  _type: 'reference';
}

// Resolved icon interface
export interface ResolvedIcon {
  _id: string;
  svgData: string;
  color?: string;
}

// Union type for icon (can be reference or resolved)
export type IconAsset = IconReference | ResolvedIcon;

// Work experience item interface
export interface WorkExperienceItem {
  _key: string;
  company: { en: string };
  role: { en: string };
  startYear: string;
  endYear?: string;
  description: BlockContent[];
  icon?: IconAsset;
}

// Education item interface
export interface EducationItem {
  _key: string;
  institution: { en: string };
  degree: { en: string };
  field: { en: string };
  startYear: string;
  endYear?: string;
  description: BlockContent[];
  icon?: IconAsset;
}

// Software item interface
export interface SoftwareItem {
  _key: string;
  name: { en: string };
  description: BlockContent[];
  icon?: IconAsset;
}

// Skill item interface
export interface SkillItem {
  _key: string;
  name: { en: string };
  description: string;
  icon?: IconAsset;
}

// Process step interface
export interface ProcessStep {
  _key: string;
  title: { en: string };
  description: BlockContent[];
  icon?: IconAsset;
}

// FAQ item interface
export interface FaqItem {
  _key: string;
  question: string;
  answer: BlockContent[];
}

// Quote interface
export interface QuoteItem {
  _key: string;
  quote: BlockContent[];
  attribution?: string;
}

// Button interface
export interface Button {
  _key: string;
  label: string;
  icon?: string;
  style: string;
  url: string;
}

// Positioning interface
export interface Positioning {
  fullBleed?: boolean;
  size?: string;
  width?: string;
  maxWidth?: string;
  blockAlignment?: string;
}

// Effects interface
export interface Effects {
  backgroundColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  textColor?: string;
  fontFamily?: string;
}

// Advanced positioning interface
export interface PositioningAdvanced {
  margin?: string;
  padding?: string;
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
} 