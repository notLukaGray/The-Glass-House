"use client";

import { VideoAsset } from "@/lib/handlers/videoHandler";

interface VideoPlayerProps {
  video: VideoAsset;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  responsive?: boolean;
}

export default function VideoPlayer({
  video,
  className = "",
  autoplay,
  loop,
  muted,
  responsive,
}: VideoPlayerProps) {
  if (video.sourceType === "bunny" && video.bunnyVideoUrl) {
    // Extract library ID and video GUID from the Direct Play URL
    const urlParts = video.bunnyVideoUrl.split("/");
    const videoGuid = urlParts[urlParts.length - 1];
    const libraryId = urlParts[urlParts.length - 2];

    if (videoGuid && libraryId) {
      const baseUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoGuid}`;
      const params = new URLSearchParams({
        autoplay: autoplay ? "true" : "false",
        loop: loop ? "true" : "false",
        muted: muted ? "true" : "false",
        preload: "true",
        responsive: responsive ? "true" : "false",
      });

      const iframeUrl = `${baseUrl}?${params.toString()}`;

      return (
        <div className={`relative w-full ${className}`}>
          <iframe
            src={iframeUrl}
            loading="lazy"
            style={{ border: "none" }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            className={`w-full ${responsive ? "aspect-video" : "h-full"}`}
          />
        </div>
      );
    }
  }

  // Fallback for other video types or invalid Bunny URLs
  return (
    <div
      className={`relative w-full bg-gray-100 flex items-center justify-center ${className}`}
    >
      <p className="text-gray-500">Video not available</p>
    </div>
  );
}
