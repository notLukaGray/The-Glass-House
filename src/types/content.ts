export interface BlockContent {
  _type: string;
  _key: string;
  style?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  children: BlockContentChild[];
  [key: string]: unknown;
}

export interface BlockContentChild {
  _type: string;
  _key: string;
  text?: string;
  marks?: string[];
  [key: string]: unknown;
}

export interface IconReference {
  _ref: string;
  _type: "reference";
}

export interface ResolvedIcon {
  _id: string;
  svgData: string;
  color?: string;
}

export type IconAsset = IconReference | ResolvedIcon;

export interface WorkExperienceItem {
  _key: string;
  company: { en: string };
  role: { en: string };
  startYear: string;
  endYear?: string;
  description: BlockContent[];
  icon?: IconAsset;
}

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

export interface SoftwareItem {
  _key: string;
  name: { en: string };
  description: BlockContent[];
  icon?: IconAsset;
}

export interface SkillItem {
  _key: string;
  name: { en: string };
  description: string;
  icon?: IconAsset;
}

export interface ProcessStep {
  _key: string;
  title: { en: string };
  description: BlockContent[];
  icon?: IconAsset;
}

export interface FaqItem {
  _key: string;
  question: string;
  answer: BlockContent[];
}

export interface QuoteItem {
  _key: string;
  quote: BlockContent[];
  attribution?: string;
}

export interface Button {
  _key: string;
  label: string;
  icon?: string;
  style: string;
  url: string;
}

export interface Positioning {
  fullBleed?: boolean;
  size?: string;
  width?: string;
  maxWidth?: string;
  blockAlignment?: string;
}

export interface Effects {
  backgroundColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  textColor?: string;
  fontFamily?: string;
}

export interface PositioningAdvanced {
  margin?: string;
  padding?: string;
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
}
