"use client";

import { useEffect, useRef, useState } from "react";
import { VideoAsset, getVideoSources } from "@/handlers/videoHandler";

interface VideoPlayerProps {
  asset: VideoAsset;
  className?: string;
}

export default function VideoPlayer({ asset, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const sources = getVideoSources(asset);
  // Find 2K (1080p) as default if available
  const default2k = sources.find(s => s.quality === '1080p');
  const [currentQuality, setCurrentQuality] = useState(default2k ? default2k.quality : (sources[0]?.quality || ""));
  const [sourceUrl, setSourceUrl] = useState<string>(default2k ? default2k.src : (sources[0]?.src || ""));

  useEffect(() => {
    if (sources.length > 0) {
      const default2k = sources.find(s => s.quality === '1080p');
      setCurrentQuality(default2k ? default2k.quality : sources[0].quality);
      setSourceUrl(default2k ? default2k.src : sources[0].src);
    }
  }, [asset]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    // Set initial values
    setCurrentTime(video.currentTime);
    setDuration(video.duration);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [sourceUrl]);

  useEffect(() => {
    if (isPlaying || currentTime > 0) {
      setShowPoster(false);
    } else {
      setShowPoster(true);
    }
  }, [isPlaying, currentTime]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    // Do not setCurrentTime here; let timeupdate event handle it
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
    if (!isMuted && volume === 0) {
      setVolume(0.5);
      video.volume = 0.5;
    }
  };

  const handleQualityChange = (quality: string) => {
    const source = sources.find(s => s.quality === quality);
    if (source) {
      const video = videoRef.current;
      const wasPlaying = video && !video.paused;
      const currentTime = video?.currentTime || 0;
      setSourceUrl(source.src);
      setCurrentQuality(quality);
      setShowPoster(false); // Hide poster during quality switch
      if (video) {
        video.src = source.src;
        video.load();
        // Use a one-time loadedmetadata handler
        const onLoadedMetadata = () => {
          video.currentTime = currentTime;
          if (wasPlaying) {
            video.play();
          }
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
        video.addEventListener('loadedmetadata', onLoadedMetadata);
      }
    }
    setShowQualityMenu(false);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) {
      video.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`relative group max-w-4xl mx-auto ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full bg-black rounded-lg"
        src={sourceUrl}
        poster={showPoster ? asset.poster : undefined}
        controls={false}
        tabIndex={0}
      />
      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 flex items-center gap-4 rounded-b-lg z-10">
        {/* Play/Pause */}
        <button onClick={togglePlay} className="text-white focus:outline-none" aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5,3 19,12 5,21"/></svg>
          )}
        </button>
        {/* Seek Bar */}
        <span className="text-white text-xs w-10 text-right">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={currentTime}
          onChange={handleSeek}
          onInput={handleSeek}
          className="flex-1 h-1 bg-gray-600 rounded-full appearance-none volume-slider"
          aria-label="Seek"
        />
        <span className="text-white text-xs w-10">{formatTime(duration)}</span>
        {/* Volume */}
        <button onClick={toggleMute} className="text-white focus:outline-none" aria-label={isMuted ? "Unmute" : "Mute"}>
          {isMuted || volume === 0 ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1,1 23,23" /><path d="M9 9v6h4l5 5V4l-5 5H9z" /></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="9 9 9 15 13 15 18 20 18 4 13 9 9 9" /></svg>
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 mx-2 volume-slider"
          aria-label="Volume"
          ref={volumeRef}
        />
        {/* Quality Button */}
        {sources.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="text-white border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none"
              aria-label="Quality"
            >
              {currentQuality}
              <svg className="inline ml-1 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showQualityMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-black/90 rounded shadow-lg py-2 min-w-[80px] z-20">
                {sources.map(s => (
                  <button
                    key={s.quality}
                    onClick={() => handleQualityChange(s.quality)}
                    className={`w-full px-4 py-1 text-left text-xs hover:bg-white/10 ${currentQuality === s.quality ? 'text-white' : 'text-gray-400'}`}
                  >
                    {s.quality}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Fullscreen */}
        <button onClick={toggleFullscreen} className="text-white ml-2 focus:outline-none" aria-label="Fullscreen">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8V4a1 1 0 0 1 1-1h4M20 8V4a1 1 0 0 0-1-1h-4M4 16v4a1 1 0 0 0 1 1h4M20 16v4a1 1 0 0 1-1 1h-4"/></svg>
        </button>
      </div>
    </div>
  );
}

