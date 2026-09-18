"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./mascot-motion.module.css";

/** A static first paint; optional video loads only in view, with motion consent. */
export function MascotMotion({ videoSrc, className = "" }: { videoSrc?: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [canMove, setCanMove] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!videoSrc || !root.current) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const update = () => {
      const enabled = inView && !preference.matches;
      setCanMove(enabled);
      if (!enabled) { video.current?.pause(); setPlaying(false); }
    };
    const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; update(); });
    observer.observe(root.current);
    preference.addEventListener("change", update);
    return () => { observer.disconnect(); preference.removeEventListener("change", update); };
  }, [videoSrc]);

  const showVideo = videoSrc && canMove && !failed;
  return <div ref={root} className={`${styles.mascot} ${className}`}>
    {showVideo ? <><video ref={video} src={videoSrc} poster="/whiff-mascot.png" muted playsInline autoPlay loop preload="none" aria-label="Whiff’s mascot giving a friendly wave" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} /><button type="button" onClick={() => { if (playing) video.current?.pause(); else void video.current?.play().catch(() => setPlaying(false)); }} aria-label={playing ? "Pause mascot animation" : "Play mascot animation"}>{playing ? "Pause" : "Play"}</button></> : <Image src="/whiff-mascot.png" alt="Whiff’s friendly little mascot" width={2160} height={3870} sizes="90px" />}
  </div>;
}
