"use client";

import { useEffect, useRef, useState } from "react";
import { VideoAsset } from "@/lib/handlers/videoHandler";

interface BackgroundVideoProps {
  video: VideoAsset;
  className?: string;
  quality?: string;
  overlay?: React.ReactNode;
  overlayOpacity?: number;
}

export default function BackgroundVideo({
  video,
  className = "",
  quality = "720p",
  overlay,
  overlayOpacity = 0.3,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || video.sourceType !== "bunny" || !video.bunnyVideoUrl) {
      setHasError(true);
      return;
    }

    // Extract video info from the Direct Play URL
    const urlParts = video.bunnyVideoUrl.split("/");
    const videoGuid = urlParts[urlParts.length - 1];
    const libraryId = urlParts[urlParts.length - 2];

    if (!videoGuid || !libraryId) {
      setHasError(true);
      return;
    }

    // Try to get CDN domain from the video asset if available
    let cdnDomain = video.cdnDomain;

    if (!cdnDomain) {
      // Fallback: extract from the Direct Play URL HTML
      const extractCdnDomain = async () => {
        try {
          if (!video.bunnyVideoUrl) {
            setHasError(true);
            return;
          }

          const response = await fetch(video.bunnyVideoUrl);
          const html = await response.text();
          const cdnMatch = html.match(/https:\/\/[^\/]*\.b-cdn\.net/);
          cdnDomain = cdnMatch ? cdnMatch[0] : null;

          if (cdnDomain) {
            const directUrl = `${cdnDomain}/${videoGuid}/play_${quality}.mp4`;
            videoElement.src = directUrl;
            videoElement.load();
          } else {
            setHasError(true);
          }
        } catch (error) {
          console.warn("Failed to extract CDN domain:", error);
          setHasError(true);
        }
      };

      extractCdnDomain();
    } else {
      // Use the CDN domain from the video asset
      const directUrl = `${cdnDomain}/${videoGuid}/play_${quality}.mp4`;
      videoElement.src = directUrl;
      videoElement.load();
    }

    const handleLoadedData = () => setIsLoaded(true);
    const handleError = () => setHasError(true);

    videoElement.addEventListener("loadeddata", handleLoadedData);
    videoElement.addEventListener("error", handleError);

    return () => {
      videoElement.removeEventListener("loadeddata", handleLoadedData);
      videoElement.removeEventListener("error", handleError);
    };
  }, [video, quality]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isLoaded) return;

    // Try to play the video
    const playVideo = async () => {
      try {
        await videoElement.play();
      } catch (error) {
        console.warn(
          "Autoplay failed, video will play on user interaction:",
          error,
        );
      }
    };

    playVideo();
  }, [isLoaded]);

  if (hasError || video.sourceType !== "bunny") {
    return (
      <div
        className={`relative w-full h-full bg-gray-900 flex items-center justify-center ${className}`}
      >
        <p className="text-gray-400">Video not available</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      {overlay && (
        <div
          className="absolute inset-0 z-10"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        >
          {overlay}
        </div>
      )}
    </div>
  );
}
