export interface LocaleString {
  en?: string;
  [key: string]: string | undefined;
}

export interface LocaleBlockContent {
  en?: any[];
  [key: string]: any[] | undefined;
}

export interface AssetReference {
  _ref: string;
  _type: 'reference';
}

export interface ImageAsset {
  _id: string;
  url: string;
  title?: LocaleString;
  altText?: LocaleString;
  description?: LocaleString;
}

export interface SvgAsset {
  _id: string;
  svgData: string;
  color?: string;
}

export interface VideoAsset {
  _id: string;
  url: string;
  poster?: string;
}

export interface BaseSection {
  _key: string;
  _type: string;
}

export interface ImageSection extends BaseSection {
  _type: 'imageSection';
  image?: ImageAsset;
  altText?: LocaleString;
  caption?: LocaleString;
  description?: LocaleString;
  linkUrl?: string;
  size?: string;
  aspectRatio?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  fullBleed?: boolean;
  alignment?: string;
  objectFit?: string;
  showCaption?: boolean;
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
}

export interface GallerySection extends BaseSection {
  _type: 'gallerySection';
  images?: ImageAsset[];
  showCaption?: boolean;
  altCaption?: LocaleString;
  layout?: 'grid' | 'carousel' | 'stacked';
}

export interface FaqSection extends BaseSection {
  _type: 'faqSection';
  faqs?: Array<{
    _key: string;
    question: LocaleString;
    answer: LocaleBlockContent;
  }>;
}

export interface QuoteSection extends BaseSection {
  _type: 'quoteSection';
  quote: LocaleString;
  attribution?: LocaleString;
}

export interface ProcessStepSection extends BaseSection {
  _type: 'processStepSection';
  title?: LocaleString;
  description?: LocaleString;
  asset?: ImageAsset;
  steps?: Array<{
    _key: string;
    date?: string;
    description?: LocaleString;
  }>;
}

export interface TwoColumnSection extends BaseSection {
  _type: 'twoColumnSection';
  leftContent?: LocaleBlockContent;
  rightContent?: LocaleBlockContent;
  leftAsset?: ImageAsset;
  rightAsset?: ImageAsset;
}

export interface CalloutSection extends BaseSection {
  _type: 'calloutSection';
  content: LocaleBlockContent;
  style?: string;
}

export interface DividerSection extends BaseSection {
  _type: 'dividerSection';
  style?: string;
  size?: string;
  color?: string;
}

export type Section = 
  | ImageSection 
  | GallerySection 
  | FaqSection 
  | QuoteSection 
  | ProcessStepSection 
  | TwoColumnSection 
  | CalloutSection 
  | DividerSection; 