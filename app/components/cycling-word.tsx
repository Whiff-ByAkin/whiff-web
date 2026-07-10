"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** Drives a shared index that advances on an interval — lets two separate
 * words (e.g. a pill + the text beside it) cycle in sync. */
export function useWordCycle(length: number, interval = 2200) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % length), interval);
    return () => clearInterval(t);
  }, [reduce, length, interval]);

  return i;
}

/** Animates a single word swapping in place. */
export function AnimatedWord({
  word,
  className = "",
}: {
  word: string;
  className?: string;
}) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={word}
        initial={{ opacity: 0, y: 8, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(5px)" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`inline-block whitespace-nowrap ${className}`}
      >
        {word}
      </motion.span>
    </AnimatePresence>
  );
}

/** Swaps through a list of words in place, e.g. "Meet your ___." */
export function CyclingWord({
  words,
  interval = 2200,
}: {
  words: string[];
  interval?: number;
}) {
  const i = useWordCycle(words.length, interval);
  return <AnimatedWord word={words[i]} className="italic text-sienna" />;
}
