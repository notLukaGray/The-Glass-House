"use client";
import React, { useEffect, useState } from 'react';
import { PortableText, PortableTextComponents, PortableTextComponentProps } from '@portabletext/react';
import { getImageAsset } from '@/handlers/imageHandler';
import { getSvgAsset } from '@/handlers/svgHandler';
import { getVideoAsset } from '@/handlers/videoHandler';
import { getSocialAsset } from '@/handlers/socialHandler';

// Add type definitions for block content
interface BlockContent {
  _type: string;
  style?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  children: any[];
  [key: string]: any;
}

interface TextSectionProps {
  content: BlockContent[];
  positioning?: {
    fullBleed?: boolean;
    size?: string;
    width?: string;
    maxWidth?: string;
    blockAlignment?: string;
  };
  effects?: {
    backgroundColor?: string;
    borderRadius?: string;
    boxShadow?: string;
  };
  positioningAdvanced?: {
    margin?: string;
    padding?: string;
    hideOnMobile?: boolean;
    hideOnDesktop?: boolean;
  };
  textAlign?: string;
  // Accept any extra props (for flattening)
  [key: string]: any;
}

// Add type definitions for resolved assets
interface ResolvedAsset {
  _type: string;
  _ref: string;
  _resolvedType: 'image' | 'svg' | 'video' | 'social';
  url?: string;
  svgData?: string;
  cdnSdUrl?: string;
  description?: { en: string };
  name?: string;
  title?: { en: string };
  [key: string]: any;
}

// Utility to sanitize strings (remove invisible/non-printable characters)
function sanitizeString(str: string | undefined): string | undefined {
  return typeof str === 'string' ? str.replace(/[\u200B-\u200D\uFEFF\u202A-\u202E\u2060-\u206F\u00A0\u180E\u2000-\u200A]/g, '').trim() : str;
}

function getSizeClass(size?: string) {
  switch (size) {
    case 'small': return 'max-w-xs';
    case 'medium': return 'max-w-md';
    case 'large': return 'max-w-lg';
    case 'full': return 'w-full';
    default: return '';
  }
}

function getBlockAlignmentClass(alignment?: string) {
  switch (alignment) {
    case 'left': return 'mx-0';
    case 'center': return 'mx-auto';
    case 'right': return 'ml-auto';
    default: return '';
  }
}

function getBoxShadowClass(boxShadow?: string) {
  switch (boxShadow) {
    case 'sm': return 'shadow-sm';
    case 'md': return 'shadow-md';
    case 'lg': return 'shadow-lg';
    case 'xl': return 'shadow-xl';
    case '2xl': return 'shadow-2xl';
    case '3xl': return 'shadow-3xl';
    case '4xl': return 'shadow-4xl';
    case '5xl': return 'shadow-5xl';
    default: return '';
  }
}

function getBorderRadiusClass(borderRadius?: string) {
  switch (borderRadius) {
    case 'sm': return 'rounded-sm';
    case 'md': return 'rounded-md';
    case 'lg': return 'rounded-lg';
    case 'xl': return 'rounded-xl';
    case 'full': return 'rounded-full';
    default: return '';
  }
}

function getTextAlignClass(textAlign?: string) {
  switch (textAlign) {
    case 'center': return 'text-center';
    case 'right': return 'text-right';
    case 'justify': return 'text-justify';
    default: return 'text-left';
  }
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }: PortableTextComponentProps<BlockContent>) => <p className="mb-4">{children}</p>,
    h1: ({ children }: PortableTextComponentProps<BlockContent>) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
    h2: ({ children }: PortableTextComponentProps<BlockContent>) => <h2 className="text-3xl font-bold mb-3">{children}</h2>,
    h3: ({ children }: PortableTextComponentProps<BlockContent>) => <h3 className="text-2xl font-bold mb-2">{children}</h3>,
    h4: ({ children }: PortableTextComponentProps<BlockContent>) => <h4 className="text-xl font-bold mb-2">{children}</h4>,
    blockquote: ({ children }: PortableTextComponentProps<BlockContent>) => <blockquote className="border-l-4 border-gray-300 pl-4 italic">{children}</blockquote>,
    default: ({ children }: PortableTextComponentProps<BlockContent>) => <p className="mb-4">{children}</p>,
  },
  marks: {
    underline: ({ children }) => <u>{children}</u>,
    color: ({ children, value }) => {
      const hex = value?.color?.hex || '#000';
      return <span style={{ color: hex }}>{children}</span>;
    },
    // Add more marks as needed
  },
  types: {
    asset: ({ value }) => {
      if (!value || !value._ref) return null;
      if (value._resolvedType === 'image') {
        return <img src={value.url} alt={value.description?.en || ''} style={{ maxWidth: '100%' }} />;
      }
      if (value._resolvedType === 'svg') {
        return <span dangerouslySetInnerHTML={{ __html: value.svgData }} />;
      }
      if (value._resolvedType === 'video') {
        return <video src={value.cdnSdUrl} controls style={{ maxWidth: '100%' }} />;
      }
      if (value._resolvedType === 'social') {
        return <a href={value.url} target="_blank" rel="noopener noreferrer">{value.name}</a>;
      }
      return <span style={{ color: 'red' }}>[Unknown asset type]</span>;
    },
    assetSVG: ({ value }) => {
      return <span dangerouslySetInnerHTML={{ __html: value.svgData }} />;
    },
    assetPhoto: ({ value }) => {
      return <img src={value.url} alt={value.description?.en || ''} style={{ maxWidth: '100%' }} />;
    },
    assetVideo: ({ value }) => {
      return <video src={value.cdnSdUrl} controls style={{ maxWidth: '100%' }} />;
    },
    asset3d: ({ value }) => {
      return <span>[3D Asset: {value.title?.en || 'Untitled'}]</span>;
    },
  },
};

// Pre-resolve assets before rendering
async function resolveAssets(blocks: any[]): Promise<ResolvedAsset[]> {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return [];
  
  const resolvedBlocks = await Promise.all(
    blocks.map(async block => {
      if (block._type === 'asset' && block._ref) {
        try {
          const imageAsset = await getImageAsset({ id: block._ref });
          if (imageAsset) return { ...block, ...imageAsset, _resolvedType: 'image' };
          
          const svgAsset = await getSvgAsset({ id: block._ref });
          if (svgAsset) return { ...block, ...svgAsset, _resolvedType: 'svg' };
          
          const videoAsset = await getVideoAsset({ id: block._ref });
          if (videoAsset) return { ...block, ...videoAsset, _resolvedType: 'video' };
          
          const socialAsset = await getSocialAsset({ id: block._ref, type: 'website' });
          if (socialAsset) return { ...block, ...socialAsset, _resolvedType: 'social' };
        } catch (error) {
          console.error('Error resolving asset:', error);
        }
      }
      return block;
    })
  );
  
  return resolvedBlocks;
}

const TextSection: React.FC<TextSectionProps> = (props) => {
  // Debug log for textAlign and all props
  console.log('TextSection textAlign:', props.textAlign, props);

  // Flatten nested fields into top-level props
  const {
    positioning = {},
    effects = {},
    positioningAdvanced = {},
    textAlign, // section-wide alignment
    ...rest
  } = props;
  const flatProps = {
    ...rest,
    ...positioning,
    ...effects,
    ...positioningAdvanced,
  };

  const [resolvedContent, setResolvedContent] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    const loadContent = async () => {
      if (!props.content || !Array.isArray(props.content) || props.content.length === 0) {
        if (isMounted) setResolvedContent([]);
        return;
      }
      
      const resolved = await resolveAssets(props.content);
      if (isMounted) setResolvedContent(resolved);
    };
    
    loadContent();
    
    return () => {
      isMounted = false;
    };
  }, [props.content]);

  if (!resolvedContent.length) return null;

  // Sanitize all relevant string props
  const size = sanitizeString(flatProps.size);
  const width = sanitizeString(flatProps.width);
  const maxWidth = sanitizeString(flatProps.maxWidth);
  const blockAlignment = sanitizeString(flatProps.blockAlignment);
  const backgroundColor = sanitizeString(flatProps.backgroundColor);
  const borderRadius = sanitizeString(flatProps.borderRadius);
  const boxShadow = sanitizeString(flatProps.boxShadow);
  const margin = sanitizeString(flatProps.margin);
  const padding = sanitizeString(flatProps.padding);
  const sanitizedTextAlign = sanitizeString(textAlign);

  // Responsive visibility
  let visibilityClass = '';
  if (flatProps.hideOnMobile) visibilityClass += ' hidden sm:block';
  if (flatProps.hideOnDesktop) visibilityClass += ' block sm:hidden';

  // --- Container style and classes ---
  const containerStyle: React.CSSProperties = {
    width: width || (flatProps.fullBleed ? '100vw' : undefined),
    maxWidth: width ? undefined : maxWidth || undefined,
    margin: margin,
    padding: padding,
    backgroundColor: backgroundColor,
    borderRadius: borderRadius,
  };

  // Size class (if no explicit width)
  const sizeClass = !width && !flatProps.fullBleed ? getSizeClass(size) : '';

  // --- Shared classes ---
  const sharedClasses = [
    getBlockAlignmentClass(blockAlignment),
    getBoxShadowClass(boxShadow),
    getBorderRadiusClass(borderRadius),
    visibilityClass,
  ].filter(Boolean).join(' ');

  // --- Section-wide text alignment for all blocks ---
  const blockComponents: PortableTextComponents = {
    block: {
      normal: ({ children }: PortableTextComponentProps<BlockContent>) => <p className={`mb-4 ${getTextAlignClass(sanitizedTextAlign)}`}>{children}</p>,
      h1: ({ children }: PortableTextComponentProps<BlockContent>) => <h1 className={`text-4xl font-bold mb-4 ${getTextAlignClass(sanitizedTextAlign)}`}>{children}</h1>,
      h2: ({ children }: PortableTextComponentProps<BlockContent>) => <h2 className={`text-3xl font-bold mb-3 ${getTextAlignClass(sanitizedTextAlign)}`}>{children}</h2>,
      h3: ({ children }: PortableTextComponentProps<BlockContent>) => <h3 className={`text-2xl font-bold mb-2 ${getTextAlignClass(sanitizedTextAlign)}`}>{children}</h3>,
      h4: ({ children }: PortableTextComponentProps<BlockContent>) => <h4 className={`text-xl font-bold mb-2 ${getTextAlignClass(sanitizedTextAlign)}`}>{children}</h4>,
      blockquote: ({ children }: PortableTextComponentProps<BlockContent>) => <blockquote className={`border-l-4 border-gray-300 pl-4 italic ${getTextAlignClass(sanitizedTextAlign)}`}>{children}</blockquote>,
      default: ({ children }: PortableTextComponentProps<BlockContent>) => <p className={`mb-4 ${getTextAlignClass(sanitizedTextAlign)}`}>{children}</p>,
    },
    marks: components.marks,
    types: components.types,
  };

  return (
    <div className={`flex ${flatProps.fullBleed ? 'w-full' : ''} ${visibilityClass}`} style={containerStyle}>
      <section className={`${sizeClass} ${sharedClasses}`} style={{ width: width || (!flatProps.fullBleed && size ? undefined : '100%') }}>
        <PortableText value={resolvedContent} components={blockComponents} />
      </section>
    </div>
  );
};

export default TextSection; 