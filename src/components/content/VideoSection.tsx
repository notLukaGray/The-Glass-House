"use client";

import React from 'react';
import VideoPlayer from '../ui/VideoPlayer';
import { VideoAsset } from '@/lib/handlers/clientHandlers';

interface VideoSectionProps {
  video: VideoAsset;
  autoplay: boolean;
  loop: boolean;
  showCaption: boolean;
  altCaption?: { en?: string };
  altDescription?: { en?: string };
  caption?: { en?: string };
  linkUrl?: string;
  size?: string;
  aspectRatio?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  fullBleed?: boolean;
  alignment?: string;
  objectFit?: string;
  titleDisplayMode?: 'none' | 'below' | 'overlay-top' | 'overlay-bottom' | 'overlay-center' | 'hover';
  // Theme
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
  // Accept any extra props (for flattening)
  [key: string]: unknown;
}

const VideoSection: React.FC<VideoSectionProps> = ({ video, showCaption }) => {
  if (!video) return null;
  return (
    <section className="my-8">
      <VideoPlayer asset={video} className="aspect-video" />
      {showCaption && video.caption?.en && (
        <p className="mt-2 text-gray-600 text-center">{video.caption.en}</p>
      )}
    </section>
  );
};

export default VideoSection; 