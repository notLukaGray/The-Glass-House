"use client";

import React from 'react';

interface ImageSectionProps {
  image: {
    url: string;
    caption?: { en?: string };
    altText?: { en?: string };
    description?: { en?: string };
  } | null;
  altText?: { en?: string };
  caption?: { en?: string };
  description?: { en?: string };
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
  // Advanced
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

function getSizeClass(size?: string) {
  switch (size) {
    case 'small': return 'max-w-xs';
    case 'medium': return 'max-w-md';
    case 'large': return 'max-w-lg';
    case 'full': return 'w-full';
    default: return '';
  }
}

function getAlignmentClass(alignment?: string) {
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

function getObjectFitClass(objectFit?: string) {
  switch (objectFit) {
    case 'cover': return 'object-cover';
    case 'contain': return 'object-contain';
    case 'fill': return 'object-fill';
    case 'none': return 'object-none';
    case 'scale-down': return 'object-scale-down';
    default: return '';
  }
}

function getAspectRatioClass(aspectRatio?: string) {
  switch (aspectRatio) {
    case '16:9': return 'aspect-[16/9]';
    case '4:3': return 'aspect-[4/3]';
    case '1:1': return 'aspect-square';
    case '3:4': return 'aspect-[3/4]';
    case '9:16': return 'aspect-[9/16]';
    default: return '';
  }
}

const ImageSection: React.FC<ImageSectionProps> = ({
  image,
  altText,
  caption,
  description,
  linkUrl,
  size,
  aspectRatio,
  width,
  height,
  maxWidth,
  fullBleed,
  alignment,
  objectFit,
  showCaption,
  advanced,
}) => {
  // Responsive visibility
  let visibilityClass = '';
  if (advanced?.hideOnMobile) visibilityClass += ' hidden sm:block';
  if (advanced?.hideOnDesktop) visibilityClass += ' block sm:hidden';

  // Compose style
  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
    maxWidth: maxWidth || undefined,
    marginTop: advanced?.marginTop,
    marginBottom: advanced?.marginBottom,
    padding: advanced?.padding,
    backgroundColor: advanced?.backgroundColor,
    borderRadius: advanced?.borderRadius,
    position: advanced?.overlayColor ? 'relative' : undefined,
  };

  // Overlay style
  const overlayStyle: React.CSSProperties = advanced?.overlayColor
    ? {
        backgroundColor: advanced.overlayColor,
        opacity: advanced.overlayOpacity ?? 0.5,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        borderRadius: style.borderRadius,
      }
    : {};

  // Compose image class
  const imgClass = [
    'w-full h-full',
    getSizeClass(size),
    getAlignmentClass(alignment),
    getBoxShadowClass(advanced?.boxShadow),
    getBorderRadiusClass(advanced?.borderRadius),
    getObjectFitClass(objectFit),
    fullBleed ? 'w-full' : '',
    advanced?.hoverEffect === 'zoom' ? 'transition-transform duration-300 hover:scale-105' : '',
    advanced?.hoverEffect === 'shadow' ? 'hover:shadow-lg' : '',
    advanced?.hoverEffect === 'colorShift' ? 'hover:brightness-75' : '',
    advanced?.hoverEffect === 'blur' ? 'hover:blur-sm' : '',
    visibilityClass,
  ].join(' ');

  // Prefer asset's fields, fallback to section overrides
  const finalCaption = image?.caption?.en || caption?.en;
  const finalAlt = image?.altText?.en || altText?.en || '';
  const finalDescription = image?.description?.en || description?.en;

  // Image element with overlay and aspect ratio
  const imgElement = image?.url ? (
    <div className={[getAspectRatioClass(aspectRatio), 'relative w-full'].join(' ')} style={{ ...style }}>
      <img
        src={image.url}
        alt={finalAlt}
        className={imgClass}
        style={{ borderRadius: style.borderRadius }}
      />
      {advanced?.overlayColor && <div style={overlayStyle} />}
    </div>
  ) : null;

  const content = linkUrl ? (
    <a href={linkUrl} target="_blank" rel="noopener noreferrer">
      {imgElement}
    </a>
  ) : (
    imgElement
  );

  return (
    <div className={`my-4 ${fullBleed ? 'w-full' : 'max-w-2xl mx-auto'}`} style={{ backgroundColor: advanced?.backgroundColor }}>
      <section>
        {content}
        {(showCaption || finalCaption) && (
          <p className="text-sm text-gray-500 mt-2">{finalCaption}</p>
        )}
        {finalDescription && (
          <p className="text-xs text-gray-400 mt-1">{finalDescription}</p>
        )}
      </section>
    </div>
  );
};

export default ImageSection; 