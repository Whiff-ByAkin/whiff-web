"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./home-scene.module.css";

type DataConnection = EventTarget & { saveData?: boolean };

/** A static first paint, enhanced with motion only when the visitor can use it. */
export function HomeScene() {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [entered, setEntered] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: DataConnection }).connection;
    const syncPreference = () => {
      const allowed = !preference.matches && !connection?.saveData;
      setMotionAllowed(allowed);
      if (!allowed) { setRevealed(false); setEntered(false); }
      else if (frame.current) {
        const bounds = frame.current.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < window.innerHeight) setEntered(true);
      }
    };
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncPreference();
    syncVisibility();
    preference.addEventListener("change", syncPreference);
    connection?.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
      setInView(visible);
      if (visible && !preference.matches && !connection?.saveData) setEntered(true);
    }, { threshold: 0.1 });
    if (frame.current) observer.observe(frame.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", syncPreference);
      connection?.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  const available = motionAllowed && entered && !failed;
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let cancelled = false;
    if (available && inView && pageVisible && !userPaused) {
      void element.play().catch(() => {
        // Low-power mode and autoplay restrictions leave the poster usable.
        if (!cancelled) setPlaying(false);
      });
    } else {
      element.pause();
    }
    return () => { cancelled = true; element.pause(); };
  }, [available, inView, pageVisible, userPaused, attempt]);

  return (
    <div ref={frame} className={styles.scene} data-home-scene data-motion={playing ? "playing" : "still"}>
      <Image
        src="/generated/four-chairs.webp"
        alt="Four handmade chairs in blue, yellow, terracotta, and sage gathered around a small table."
        width={1200}
        height={896}
        sizes="(max-width: 760px) 420px, 45vw"
        preload
        className={styles.poster}
        style={{ opacity: available && revealed ? 0 : 1 }}
      />
      {available && <>
        <video
          ref={video}
          className={styles.video}
          style={{ opacity: revealed ? 1 : 0 }}
          src="/generated/four-chairs-loop.mp4"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => { setPlaying(true); setRevealed(true); }}
          onPause={() => setPlaying(false)}
          onError={() => { setFailed(true); setPlaying(false); }}
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => {
            if (playing) {
              setUserPaused(true);
              video.current?.pause();
            } else {
              setUserPaused(false);
              setAttempt(value => value + 1);
              // Use this gesture directly when a browser has blocked autoplay.
              void video.current?.play().catch(() => setPlaying(false));
            }
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {playing ? <><path d="M5 3v10" /><path d="M11 3v10" /></> : <path d="m5 3 8 5-8 5V3Z" />}
          </svg>
          {playing ? "Pause motion" : "Play motion"}
        </button>
      </>}
    </div>
  );
}
