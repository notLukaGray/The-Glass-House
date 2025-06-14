"use client";

import React from 'react';
import VideoPlayer from '../_web/VideoPlayer';

interface VideoSectionProps {
  video: any; // VideoAsset type
  autoplay: boolean;
  loop: boolean;
  showCaption: boolean;
}

const VideoSection: React.FC<VideoSectionProps> = ({ video, autoplay, loop, showCaption }) => {
  return (
    <section className="my-4">
      {video && <VideoPlayer asset={video} className="w-full" />}
      {showCaption && video?.caption?.en && <p className="text-sm text-gray-500 mt-2">{video.caption.en}</p>}
    </section>
  );
};

export default VideoSection; 