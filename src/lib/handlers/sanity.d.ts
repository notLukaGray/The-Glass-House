import { PortableTextBlock } from "@portabletext/types";

export interface LocaleString {
  _type: "localeString";
  en: string;
}

export interface SanityReference {
  _type: "reference";
  _ref: string;
}

export interface SanityImage {
  _type: "image";
  asset: SanityReference;
}

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface PageSection {
  _key: string;
  _type: string;
}

export interface ImageSection extends PageSection {
  _type: "imageSection";
  image: SanityReference;
  title?: LocaleString;
  caption?: LocaleString;
  altText?: LocaleString;
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

export interface TextSection extends PageSection {
  _type: "textSection";
  content: PortableTextBlock[];
}

export interface TwoColumnSection extends PageSection {
  _type: "twoColumnSection";
  leftContent: PortableTextBlock[];
  rightContent: PortableTextBlock[];
  leftAsset?: SanityReference;
  rightAsset?: SanityReference;
}

export interface VideoSection extends PageSection {
  _type: "videoSection";
  video: SanityReference;
  title?: LocaleString;
  altText?: LocaleString;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
}

export interface GallerySection extends PageSection {
  _type: "gallerySection";
  images: SanityReference[];
  showCaption?: boolean;
  altCaption?: LocaleString;
  layout?: "grid" | "carousel" | "stacked";
}

export interface FaqSection extends PageSection {
  _type: "faqSection";
  faqs: Array<{
    _key: string;
    question: LocaleString;
    answer: PortableTextBlock[];
  }>;
}

export interface AvatarSection extends PageSection {
  _type: "avatarSection";
  avatar: SanityReference;
  label?: LocaleString;
}

export interface ProcessStepSection extends PageSection {
  _type: "processStepSection";
  asset: SanityReference;
  heading: LocaleString;
  description: PortableTextBlock[];
}

export interface ProjectMeta extends SanityDocument {
  _type: "projectMeta";
  title: LocaleString;
  subhead?: LocaleString;
  slug: { current: string };
  colorTheme?: string;
  locked?: boolean;
  coverAsset?: SanityReference;
  externalLink?: string;
  featured?: boolean;
  categories?: Array<{ _id: string; title: LocaleString }>;
  tags?: Array<{ _id: string; title: LocaleString }>;
  sections: Array<
    | ImageSection
    | TextSection
    | TwoColumnSection
    | VideoSection
    | GallerySection
    | FaqSection
    | AvatarSection
    | ProcessStepSection
  >;
}

export interface PageMeta extends SanityDocument {
  _type: "pageMeta";
  title: LocaleString;
  subhead?: LocaleString;
  slug: { current: string };
  publishedAt: string;
  locked?: boolean;
  coverAsset?: SanityReference;
  gallery?: SanityReference[];
  order?: number;
  colorTheme?: string;
  seo?: {
    title?: LocaleString;
    description?: LocaleString;
    keywords?: string[];
  };
  sections: Array<
    | ImageSection
    | TextSection
    | TwoColumnSection
    | VideoSection
    | GallerySection
    | FaqSection
    | AvatarSection
    | ProcessStepSection
  >;
}

// Asset types
export interface ImageAsset {
  _id: string;
  _type: "assetPhoto";
  url: string;
  title?: LocaleString;
  description?: LocaleString;
  caption?: LocaleString;
}

export interface VideoAsset {
  _id: string;
  _type: "assetVideo";
  url: string;
  title?: LocaleString;
  description?: LocaleString;
}

export interface SvgAsset {
  _id: string;
  _type: "assetSVG";
  svgData: string;
  title?: LocaleString;
  description?: LocaleString;
  color?: string;
}
