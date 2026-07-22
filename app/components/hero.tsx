"use client";

import { motion, useReducedMotion } from "motion/react";
import { AnimatedWord, useWordCycle } from "./cycling-word";
import { ConnectionArc } from "./connection-arc";
import {ApplyCTA} from "@/app/components/invite-cta";

// "Find your [ACTIVITY] [ROLE]" — the two lists cycle in sync by index, so the
// pill (the activity) and the word beside it (who they are to you, through that
// activity) swap together: "hiking buddy" → "chess rival" → "tennis partner".
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
      className="relative flex h-[100svh] flex-col items-center justify-center gap-5 px-6 pb-16 pt-20 text-center sm:gap-6 md:px-10"
    >
      {/* eyebrow */}
      <motion.div {...R(0)} className="flex items-center gap-2">
        <span className="h-px w-6 bg-ink/20" aria-hidden="true" />
        <p className="font-display text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft">
          our statement
        </p>
        <span className="h-px w-6 bg-ink/20" aria-hidden="true" />
      </motion.div>

      {/* the headline — the movement */}
      <motion.h1
        {...R(0.08)}
        className="text-balance font-display text-[clamp(2.5rem,7vw,4.2rem)] font-semibold leading-[1.02] tracking-tight text-ink"
      >
        Activities first. People second.
      </motion.h1>

      {/* the promise, with a hand-drawn rust underline under "out the door" */}
      <motion.p
        {...R(0.16)}
        className="max-w-xl text-balance font-display text-[clamp(1.05rem,3.4vw,1.45rem)] font-medium leading-snug text-ink"
      >
        Let whiff get you{" "}
        <span className="relative inline-block">
          out the door
          <span
            aria-hidden="true"
            className="underline-draw absolute -bottom-0.5 left-0 h-[0.14em] w-full rounded-full bg-rust"
          />
        </span>{" "}
        to do something you love, with someone who loves it too.
      </motion.p>

      {/* the statement — three beats, the last one the emotional payoff */}
      <motion.div
        {...R(0.24)}
        className="flex max-w-xl flex-col gap-2.5 text-[15px] leading-relaxed text-ink-soft sm:text-base"
      >
        <p>
          Other apps start with a stranger and hope a connection happens. whiff
          starts with something you already want to do.
        </p>
        <p>Show up for the activity. Meet the people who belong there.</p>
        <p className="font-display font-medium text-ink">
          Real connection. What humans are made for, without the profiles.
        </p>
      </motion.div>

      {/* the signature: whiff drawing the line between two people */}
      <motion.div {...R(0.34)} className="py-1">
        <ConnectionArc />
      </motion.div>

      {/* the find-your line + the ask */}
      <div className="flex flex-col items-center gap-4">
        <motion.div {...R(0.46)}>
          <FindYourLine />
        </motion.div>

        <motion.div {...R(0.56)}>
          <ApplyCTA />
        </motion.div>

        <motion.p
          {...R(0.64)}
          className="font-body text-lg italic text-ink-soft sm:text-xl"
          style={{ transform: "rotate(-2deg)" }}
        >
          this is not a dating app.
        </motion.p>
      </div>
    </section>
  );
}

function FindYourLine() {
  const i = useWordCycle(ACTIVITIES.length, 1900);
  return (
    <p className="flex items-center gap-2 whitespace-nowrap font-display text-base text-ink sm:text-lg">
      Find your
      <span className="inline-flex items-center rounded-full border border-rust/25 bg-rust/10 px-3.5 py-1.5 font-semibold text-rust">
        <AnimatedWord word={ACTIVITIES[i]} />
      </span>
      <AnimatedWord word={ROLES[i]} className="font-semibold" />
    </p>
  );
}
