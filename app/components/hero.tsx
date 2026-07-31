"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedWord, useWordCycle } from "./cycling-word";
import { ApplyCTA } from "@/app/components/invite-cta";

// **The headline cycles, and what it cycles is people.**
//
// It used to cycle activities — "a hiking buddy", "a chess rival" — because the
// product was a catalogue of things to join. Then it said "Six people. One night
// a week." which was worse: it reads as one evening with six strangers, the
// opposite of the thing being sold.
//
// What whiff does is introduce you to somebody who becomes a fixture. So the
// headline says that, the pill carries the range, and the word "whiff" stays out
// of it — the wordmark is already at the top of the page and saying it twice in
// one screen is the site talking about itself instead of to you.
const BECOMES = [
  "best friend",
  "gym partner",
  "chess rival",
  "running mate",
  "climbing mate",
  "trivia team",
  "walking crew",
  "favourite five",
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
      className="relative flex h-[100svh] flex-col items-center justify-center gap-[clamp(0.8rem,3.5vw,1.5rem)] px-6 pb-16 pt-20 text-center md:px-10"
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
          className="h-[min(clamp(5.5rem,21vh,14rem),34vw)] w-auto select-none"
          draggable={false}
        />
      </motion.div>

      {/* **One line, always.** It's something somebody says in one breath, and
          any break at all turns it into a slogan — so it never wraps and the
          type scales with the viewport instead. That caps how long the pill's
          words can be: the whole sentence has to fit a narrow phone, which is
          why none of them run past about fourteen characters.

          Everything below it scales with the same viewport unit, at smaller
          coefficients. Fixed sizes underneath a fluid headline invert the
          hierarchy on a small phone — the headline shrinks to fit and the
          supporting line, sitting at a flat 16px, ends up bigger than it. */}
      <motion.h1
        {...R(0.1)}
        className="whitespace-nowrap font-display text-[clamp(0.95rem,3.6vw,2.5rem)] font-semibold leading-[1.2] tracking-tight text-ink"
      >
        Let me introduce you to your new <BecomesPill />
      </motion.h1>

      <div className="flex flex-col items-center gap-[clamp(0.7rem,3vw,1.25rem)]">
        <motion.div {...R(0.22)}>
          <SomeoneLine />
        </motion.div>

        <motion.div {...R(0.32)}>
          <ApplyCTA />
        </motion.div>

        <motion.p
          {...R(0.42)}
          className="font-body text-[clamp(0.78rem,2.9vw,1.25rem)] italic text-ink-soft"
          style={{ transform: "rotate(-2deg)" }}
        >
          this is not a dating app.
        </motion.p>
      </div>
    </section>
  );
}

// The flipping word lives in the pill, the way it always has — it's the one
// element on the page that reads as a thing you could tap, which is what makes
// the eye go to it and notice it changing.
function BecomesPill() {
  const i = useWordCycle(BECOMES.length, 2100);
  return (
    <span className="inline-flex items-baseline whitespace-nowrap rounded-full border border-espresso/20 bg-espresso/[0.07] px-[0.5em] py-[0.1em] align-baseline font-semibold text-espresso">
      <AnimatedWord word={BECOMES[i]} />
    </span>
  );
}

// The mechanic, once, under the promise — because "your new best friend" is a
// claim and this is the sentence that makes it a plausible one.
function SomeoneLine() {
  return (
    <p className="max-w-[24rem] text-balance font-display text-[clamp(0.72rem,2.6vw,1.125rem)] text-ink-soft">
      The same five people, once every week, doing the activity{" "}
      <span className="font-semibold text-espresso">YOU</span> love.
    </p>
  );
}
