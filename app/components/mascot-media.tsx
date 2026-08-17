"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const CLIPS = [
  { id: "wave", src: "/whiff-mascot-wave.mp4" },
  { id: "pebble", src: "/whiff-mascot-pebble.mp4" },
] as const;

type MascotClip = (typeof CLIPS)[number];
type PlaybackPhase = "first" | "restarting" | "second" | "finished" | "failed";

/**
 * The still is the complete server and first-client render. A clip is chosen
 * after hydration and stored in a ref, so unrelated hero state changes cannot
 * reshuffle it or start a second download.
 */
export function MascotMedia() {
  const choice = useRef<MascotClip | null>(null);
  const playbackPhase = useRef<PlaybackPhase>("first");
  const [clip, setClip] = useState<MascotClip | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [completedPlays, setCompletedPlays] = useState(0);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const syncMotionPreference = () => {
      playbackPhase.current = "first";
      setCompletedPlays(0);
      setFinished(false);
      setVideoFailed(false);
      setVideoReady(false);

      if (motionPreference.matches) {
        setClip(null);
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
  const videoVisible = Boolean(activeClip && videoReady && !finished);

  function handlePlaybackFailure() {
    playbackPhase.current = "failed";
    setCompletedPlays(0);
    setFinished(true);
    setVideoReady(false);
    setVideoFailed(true);
  }

  function handleEnded(event: React.SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget;

    if (playbackPhase.current === "first") {
      // Set the guard before seeking: an extra `ended` dispatched by a browser
      // during the restart cannot be mistaken for the end of play two.
      playbackPhase.current = "restarting";
      setCompletedPlays(1);

      try {
        video.currentTime = 0;
        void video.play().then(
          () => {
            if (playbackPhase.current === "restarting") {
              playbackPhase.current = "second";
            }
          },
          handlePlaybackFailure,
        );
      } catch {
        handlePlaybackFailure();
      }
      return;
    }

    if (playbackPhase.current === "second") {
      playbackPhase.current = "finished";
      setCompletedPlays(2);
      setFinished(true);
      setVideoReady(false);
    }
  }

  return (
    <div
      className="hero-mascot-media select-none"
      data-mascot-clip={activeClip?.id ?? "still"}
      data-mascot-state={
        videoFailed
          ? "error"
          : finished
            ? "final"
            : activeClip
              ? videoReady
                ? "playing"
                : "loading"
              : "still"
      }
      data-completed-plays={completedPlays}
    >
      <Image
        src="/whiff-mascot-finale.png"
        alt=""
        width={400}
        height={718}
        loading="eager"
        fetchPriority="high"
        className="hero-mascot-still"
        data-video-ready={videoVisible ? "true" : "false"}
        draggable={false}
      />

      {activeClip ? (
        <video
          key={activeClip.id}
          src={activeClip.src}
          poster="/whiff-mascot-finale.png"
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          data-ready={videoVisible ? "true" : "false"}
          data-variant={activeClip.id}
          className="hero-mascot-video"
          onPlaying={() => {
            setVideoReady(true);
            if (playbackPhase.current === "restarting") {
              playbackPhase.current = "second";
            }
          }}
          onEnded={handleEnded}
          onError={handlePlaybackFailure}
        >
          Your browser does not support the video tag.
        </video>
      ) : null}
    </div>
  );
}
