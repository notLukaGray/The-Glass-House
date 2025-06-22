/**
 * Shared TypeScript interfaces for content components
 *
 * This file defines the core data structures used throughout the application
 * for managing content from Sanity CMS. These interfaces ensure type safety
 * and provide clear contracts for data exchange between the CMS and frontend.
 */

/**
 * Block content interface for Sanity portable text.
 * Represents rich text content blocks that can contain various styling
 * and formatting options. This is the foundation for all text content
 * in the application.
 */
export interface BlockContent {
  _type: string;
  _key: string;
  style?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  children: BlockContentChild[];
  [key: string]: unknown;
}

/**
 * Child elements within block content.
 * Represents individual text elements within a block, including
 * inline formatting and marks for styling.
 */
export interface BlockContentChild {
  _type: string;
  _key: string;
  text?: string;
  marks?: string[];
  [key: string]: unknown;
}

/**
 * Icon reference interface.
 * Represents a reference to an icon asset in Sanity before resolution.
 * Used when the icon data hasn't been fetched yet.
 */
export interface IconReference {
  _ref: string;
  _type: "reference";
}

/**
 * Resolved icon interface.
 * Represents a fully resolved icon asset with SVG data and styling.
 * Used after the icon reference has been fetched and processed.
 */
export interface ResolvedIcon {
  _id: string;
  svgData: string;
  color?: string;
}

/**
 * Union type for icon assets.
 * Can be either a reference (before resolution) or a resolved icon
 * (after fetching from Sanity). This allows for flexible icon handling
 * throughout the application.
 */
export type IconAsset = IconReference | ResolvedIcon;

/**
 * Work experience item interface.
 * Defines the structure for individual work experience entries,
 * including company information, role details, and associated content.
 */
export interface WorkExperienceItem {
  _key: string;
  company: { en: string };
  role: { en: string };
  startYear: string;
  endYear?: string;
  description: BlockContent[];
  icon?: IconAsset;
}

/**
 * Education item interface.
 * Defines the structure for individual education entries,
 * including institution details, degree information, and associated content.
 */
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

/**
 * Software item interface.
 * Defines the structure for software/tool entries,
 * including name, description, and associated icon.
 */
export interface SoftwareItem {
  _key: string;
  name: { en: string };
  description: BlockContent[];
  icon?: IconAsset;
}

/**
 * Skill item interface.
 * Defines the structure for individual skill entries,
 * including name, description, and associated icon.
 */
export interface SkillItem {
  _key: string;
  name: { en: string };
  description: string;
  icon?: IconAsset;
}

/**
 * Process step interface.
 * Defines the structure for individual process steps,
 * including title, description, and associated icon.
 */
export interface ProcessStep {
  _key: string;
  title: { en: string };
  description: BlockContent[];
  icon?: IconAsset;
}

/**
 * FAQ item interface.
 * Defines the structure for FAQ entries,
 * including question and answer content.
 */
export interface FaqItem {
  _key: string;
  question: string;
  answer: BlockContent[];
}

/**
 * Quote interface.
 * Defines the structure for quote content,
 * including the quote text and optional attribution.
 */
export interface QuoteItem {
  _key: string;
  quote: BlockContent[];
  attribution?: string;
}

/**
 * Button interface.
 * Defines the structure for button components,
 * including label, styling, and navigation properties.
 */
export interface Button {
  _key: string;
  label: string;
  icon?: string;
  style: string;
  url: string;
}

/**
 * Positioning interface.
 * Defines basic positioning and layout properties
 * for content components and sections.
 */
export interface Positioning {
  fullBleed?: boolean;
  size?: string;
  width?: string;
  maxWidth?: string;
  blockAlignment?: string;
}

/**
 * Effects interface.
 * Defines visual effects and styling properties
 * for content components and sections.
 */
export interface Effects {
  backgroundColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  textColor?: string;
  fontFamily?: string;
}

/**
 * Advanced positioning interface.
 * Defines advanced positioning and responsive behavior
 * properties for content components and sections.
 */
export interface PositioningAdvanced {
  margin?: string;
  padding?: string;
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
}
