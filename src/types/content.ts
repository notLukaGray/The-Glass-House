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

// Asset reference types
export interface AssetReference {
  _ref: string;
  _type: "reference";
}

export interface ImageReference extends AssetReference {
  _type: "reference";
}

export interface VideoReference extends AssetReference {
  _type: "reference";
}

export interface SvgReference extends AssetReference {
  _type: "reference";
}

export interface SocialReference extends AssetReference {
  _type: "reference";
}

// Resolved asset types
export interface ResolvedImageAsset {
  _id: string;
  _type: "assetPhoto";
  url: string;
  alt?: string;
  title?: { en: string };
  description?: { en: string };
  caption?: { en: string };
  _resolvedType: "image";
}

export interface ResolvedVideoAsset {
  _id: string;
  _type: "assetVideo";
  sourceType: "bunny" | "sanity" | "external";
  bunnyVideoUrl?: string;
  cdnDomain?: string;
  title?: { en: string };
  description?: { en: string };
  caption?: { en: string };
  _resolvedType: "video";
}

export interface ResolvedSvgAsset {
  _id: string;
  _type: "assetSVG";
  svgData: string;
  color?: string;
  title?: { en: string };
  description?: { en: string };
  caption?: { en: string };
  _resolvedType: "svg";
}

export interface ResolvedSocialAsset {
  _id: string;
  _type: "assetSocial";
  platform: string;
  url: string;
  title?: { en: string };
  description?: { en: string };
  caption?: { en: string };
  _resolvedType: "social";
}

// Union types for assets
export type ResolvedAsset =
  | ResolvedImageAsset
  | ResolvedVideoAsset
  | ResolvedSvgAsset
  | ResolvedSocialAsset;

// Content block with resolved assets
export interface ResolvedContentBlock {
  _type: string;
  _key: string;
  _ref?: string;
  _resolvedType?: "image" | "video" | "svg" | "social";
  // Include all properties from resolved assets
  url?: string;
  svgData?: string;
  sourceType?: "bunny" | "sanity" | "external";
  bunnyVideoUrl?: string;
  cdnDomain?: string;
  platform?: string;
  color?: string;
  alt?: string;
  title?: { en: string };
  description?: { en: string };
  caption?: { en: string };
  // Original block properties
  style?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  children?: BlockContentChild[];
  text?: string;
  marks?: string[];
  // Allow any other properties that might come from Sanity
  [key: string]: unknown;
}

// Section content types
export interface RelatedItem {
  _id: string;
  title?: { en: string };
  subhead?: { en: string };
  coverImage?: ImageReference & { url?: string };
}

export interface TextSectionContent {
  _key: string;
  _type: "textSection";
  content: ResolvedContentBlock[];
  positioning?: Positioning;
  effects?: Effects;
  positioningAdvanced?: PositioningAdvanced;
  textAlign?: string;
  size?: string;
  [key: string]: unknown;
}

export interface RelatedSectionContent {
  _key: string;
  _type: "relatedSection";
  heading: { en?: string };
  items: RelatedItem[];
  size?: string;
  [key: string]: unknown;
}

export interface ImageSectionContent {
  _key: string;
  _type: "imageSection";
  image?: ResolvedImageAsset;
  size?: string;
  [key: string]: unknown;
}

export interface VideoSectionContent {
  _key: string;
  _type: "videoSection";
  video?: ResolvedVideoAsset;
  size?: string;
  [key: string]: unknown;
}

export interface IconSectionContent {
  _key: string;
  _type: "iconSection";
  icon?: ResolvedSvgAsset;
  size?: string;
  [key: string]: unknown;
}

export interface AvatarSectionContent {
  _key: string;
  _type: "avatarSection";
  avatar?: ResolvedImageAsset;
  size?: string;
  [key: string]: unknown;
}

// Union type for all section content
export type SectionContent =
  | TextSectionContent
  | RelatedSectionContent
  | ImageSectionContent
  | VideoSectionContent
  | IconSectionContent
  | AvatarSectionContent;

// Base section interface
export interface BaseSection {
  _key: string;
  _type: string;
  size?: string;
  [key: string]: unknown;
}

// Resolved section interface
export interface ResolvedSection extends BaseSection {
  content?: ResolvedContentBlock[];
  items?: RelatedItem[];
  image?: ResolvedImageAsset;
  video?: ResolvedVideoAsset;
  icon?: ResolvedSvgAsset;
  avatar?: ResolvedImageAsset;
  heading?: { en?: string };
  positioning?: Positioning;
  effects?: Effects;
  positioningAdvanced?: PositioningAdvanced;
  textAlign?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showCaption?: boolean;
  altCaption?: { en?: string };
  altDescription?: { en?: string };
  caption?: { en?: string };
  linkUrl?: string;
  aspectRatio?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  fullBleed?: boolean;
  alignment?: string;
  objectFit?: string;
  titleDisplayMode?:
    | "none"
    | "below"
    | "overlay-top"
    | "overlay-bottom"
    | "overlay-center"
    | "hover";
  theme?: {
    overlayColor?: string;
    overlayOpacity?: number;
    textColor?: string;
    captionColor?: string;
    spacing?: {
      title?: string;
      caption?: string;
      padding?: string;
    };
  };
  advanced?: {
    marginTop?: string;
    marginBottom?: string;
    padding?: string;
    borderRadius?: string;
    boxShadow?: string;
    backgroundColor?: string;
    overlayColor?: string;
    overlayOpacity?: number;
    hoverEffect?: string;
    hideOnMobile?: boolean;
    hideOnDesktop?: boolean;
  };
  responsive?: boolean;
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
