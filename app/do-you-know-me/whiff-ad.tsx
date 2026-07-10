"use client";

import Link from "next/link";
import { AnimatedWord, useWordCycle } from "@/app/components/cycling-word";

// A little whiff plug for this page. Reuses the homepage's flipping-words effect
// (cycling-word), reworded for here: "With whiff, meet your ___ ___."
// Activity + role advance together off one shared index, like the homepage line.
// Words are kept short so the line fits on one row on mobile.
const ACTIVITIES = [
  "gym",
  "pottery",
  "sunset walk",
  "trivia",
  "market",
  "board game",
  "karaoke",
  "brunch",
  "concert",
  "hiking",
];
const ROLES = [
  "buddy",
  "partner",
  "companion",
  "teammate",
  "plus-one",
  "rival",
  "buddy",
  "partner",
  "teammate",
  "companion",
];

export function WhiffAd() {
  const i = useWordCycle(ACTIVITIES.length, 1800);

  return (
    <aside className="mt-6 flex flex-col items-start gap-3 rounded-3xl bg-forest/5 px-5 py-4 ring-1 ring-forest/10 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5">
      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-sienna-hover sm:text-xs">
          the anti–dating app movement
        </p>
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-serif text-sm text-forest sm:gap-x-2 sm:text-xl">
          With whiff, meet your
          <span className="inline-flex items-center rounded-full bg-oat px-2.5 py-0.5 font-semibold ring-1 ring-forest/15 sm:px-3 sm:py-1">
            <AnimatedWord word={ACTIVITIES[i]} className="italic text-sienna" />
          </span>
          <AnimatedWord word={ROLES[i]} className="font-semibold" />
        </p>
      </div>
      <Link
        href="/"
        className="shrink-0 rounded-full bg-sienna px-6 py-2.5 font-serif text-sm italic tracking-wide text-oat transition-colors hover:bg-sienna-hover"
      >
        meet whiff →
      </Link>
    </aside>
  );
}
