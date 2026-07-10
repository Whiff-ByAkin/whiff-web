"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Contact } from "./contact";
import { NAV_PILL_CLASS } from "./info-dialog";

// The "Click Me" pill nags for attention in bursts: a quick shake that rings
// down from fast → medium → slow (see the .attention-wiggle keyframes), then
// holds perfectly still for a random beat — 5s, 10s, or 20s — before doing it
// again. The randomness keeps it from becoming predictable wallpaper the eye
// learns to ignore.
const PAUSES = [5000, 10000, 20000];
const FIRST_DELAY = 1600;

export function Header() {
  const [wiggling, setWiggling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    timer.current = setTimeout(() => setWiggling(true), FIRST_DELAY);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // One shake burst just finished: sit still, then queue the next one after a
  // random pause so the rhythm never settles into something ignorable. Guard on
  // the animation name so the always-on pulse ring can't be mistaken for it.
  function handleAnimationEnd(event: React.AnimationEvent<HTMLAnchorElement>) {
    if (event.animationName !== "attention-wiggle") return;
    setWiggling(false);
    const pause = PAUSES[Math.floor(Math.random() * PAUSES.length)];
    timer.current = setTimeout(() => setWiggling(true), pause);
  }

  return (
    <header className="fade-up fixed top-0 inset-x-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between">
      <Link href="/" aria-label="whiff home" className="group inline-flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny logo asset, no responsive optimization needed */}
        <img
          src="/whiff-wordmark.png"
          alt="whiff"
          width={303}
          height={145}
          className="h-7 w-auto md:h-8 transition-transform duration-200 group-hover:scale-105"
        />
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-2">
        <Link
          href="/blog"
          aria-label="Click me: read real dating app stories"
          onAnimationEnd={handleAnimationEnd}
          className={`${NAV_PILL_CLASS} attention-cta !border-sienna/25 !bg-sienna !text-oat hover:!bg-sienna-hover ${
            wiggling ? "attention-wiggle" : ""
          }`}
        >
          Click Me
        </Link>
        <Contact />
      </nav>
    </header>
  );
}
