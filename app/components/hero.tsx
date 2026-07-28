"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedWord, useWordCycle } from "./cycling-word";
import { ApplyCTA } from "@/app/components/invite-cta";

// "a [ACTIVITY] [ROLE]" — the two lists cycle in sync by index, so the pill
// (the activity) and the word beside it (who that activity makes of someone)
// swap together: "a hiking buddy" → "a chess rival" → "a tennis partner".
// Deliberately not "find your ___": that is the exact phrasing every dating,
// friends and meetup app in this category uses. The line instantiates the
// headline's "someone" instead of instructing anyone to go looking.
const ACTIVITIES = [
  "hiking",
  "cycling",
  "running",
  "climbing",
  "chess",
  "tennis",
  "trivia",
  "bouldering",
];
const ROLES = [
  "buddy",
  "crew",
  "mate",
  "partner",
  "rival",
  "partner",
  "team",
  "partner",
];

// Each element gets its own delay and a spring-like ease, so the entrance never
// reads as one uniform fade (a classic AI-slop tell).
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export function Hero() {
  const reduce = useReducedMotion();
  const R = reduce ? () => ({}) : reveal;

  return (
    <section
      aria-label="What whiff is"
      className="relative flex h-[100svh] flex-col items-center justify-center gap-6 px-6 pb-16 pt-20 text-center md:px-10"
    >
      {/* the mascot carries the warmth the paragraphs used to. alt is empty
          because the headline right below says everything it says. */}
      <motion.div {...R(0)}>
        <Image
          src="/whiff-mascot.png"
          alt=""
          width={515}
          height={560}
          loading="eager"
          fetchPriority="high"
          className="h-[clamp(8rem,21vh,14rem)] w-auto select-none"
          draggable={false}
        />
      </motion.div>

      {/* the whole pitch, in two beats */}
      <motion.h1
        {...R(0.1)}
        className="font-display text-[clamp(1.9rem,5.4vw,3.4rem)] font-semibold leading-[1.08] tracking-tight text-ink"
      >
        <span className="block">Something you love doing.</span>
        <span className="block">Someone to do it with.</span>
      </motion.h1>

      <div className="flex flex-col items-center gap-5">
        <motion.div {...R(0.22)}>
          <SomeoneLine />
        </motion.div>

        <motion.div {...R(0.32)}>
          <ApplyCTA />
        </motion.div>

        <motion.p
          {...R(0.42)}
          className="font-body text-lg italic text-ink-soft sm:text-xl"
          style={{ transform: "rotate(-2deg)" }}
        >
          this is not a dating app.
        </motion.p>
      </div>
    </section>
  );
}

function SomeoneLine() {
  const i = useWordCycle(ACTIVITIES.length, 1900);
  return (
    <p className="flex items-center gap-2 whitespace-nowrap font-display text-base text-ink-soft sm:text-lg">
      a
      <span className="inline-flex items-center rounded-full border border-espresso/20 bg-espresso/[0.07] px-3.5 py-1.5 font-semibold text-espresso">
        <AnimatedWord word={ACTIVITIES[i]} />
      </span>
      <AnimatedWord word={ROLES[i]} className="font-semibold text-ink" />
    </p>
  );
}
