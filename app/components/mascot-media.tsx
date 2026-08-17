"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const CLIPS = [
  { id: "wave", src: "/whiff-mascot-wave.mp4" },
  { id: "pebble", src: "/whiff-mascot-pebble.mp4" },
] as const;

type MascotClip = (typeof CLIPS)[number];

/**
 * The still is the complete server and first-client render. A clip is chosen
 * after hydration and stored in a ref, so unrelated hero state changes cannot
 * reshuffle it or start a second download.
 */
export function MascotMedia() {
  const choice = useRef<MascotClip | null>(null);
  const [clip, setClip] = useState<MascotClip | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const syncMotionPreference = () => {
      if (motionPreference.matches) {
        setClip(null);
        setVideoReady(false);
        return;
      }

      choice.current ??=
        CLIPS[Math.random() < 0.5 ? 0 : 1];
      setClip(choice.current);
    };

    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);

    return () => {
      motionPreference.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  const activeClip = videoFailed ? null : clip;

  return (
    <div
      className="hero-mascot-media select-none"
      data-mascot-clip={activeClip?.id ?? "still"}
    >
      <Image
        src="/whiff-mascot-wave.png"
        alt=""
        width={397}
        height={900}
        loading="eager"
        fetchPriority="high"
        className="hero-mascot-still"
        data-video-ready={activeClip && videoReady ? "true" : "false"}
        draggable={false}
      />

      {activeClip ? (
        <video
          key={activeClip.id}
          src={activeClip.src}
          poster="/whiff-mascot-wave.png"
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          data-ready={videoReady ? "true" : "false"}
          data-variant={activeClip.id}
          className="hero-mascot-video"
          onLoadedData={() => setVideoReady(true)}
          onError={() => {
            setVideoReady(false);
            setVideoFailed(true);
          }}
        >
          Your browser does not support the video tag.
        </video>
      ) : null}
    </div>
  );
}
