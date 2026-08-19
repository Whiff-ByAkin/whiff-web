"use client";

import { useEffect, useRef } from "react";

const MASCOT_PLAYBACK_RATE = 0.75;

/**
 * The video poster keeps the first render and any playback failure visually
 * stable. Reduced-motion preference pauses the same media at its first frame.
 */
export function MascotMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const syncPlayback = () => {
      const video = videoRef.current;
      if (!video) return;

      if (motionPreference.matches) {
        video.pause();
        video.currentTime = 0;
        return;
      }

      video.playbackRate = MASCOT_PLAYBACK_RATE;
      void video.play().catch(() => {
        // The poster remains visible if a browser declines autoplay.
      });
    };

    syncPlayback();
    motionPreference.addEventListener("change", syncPlayback);
    return () => motionPreference.removeEventListener("change", syncPlayback);
  }, []);

  return (
    <div className="hero-mascot-media select-none">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/whiff-mascot.png"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        className="hero-mascot-video"
      >
        <source src="/whiff-mascot.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
