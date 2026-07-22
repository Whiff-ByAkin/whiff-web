"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** A shared index that advances on an interval — lets two separate words
 *  (a pill + the word beside it) cycle in perfect sync. */
export function useWordCycle(length: number, interval = 2000) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % length), interval);
    return () => clearInterval(t);
  }, [reduce, length, interval]);

  return i;
}

/** One word, swapping in place: blurs and slides up out, blurs in from below. */
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
        initial={{ opacity: 0, y: 9, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -9, filter: "blur(6px)" }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className={`inline-block whitespace-nowrap ${className}`}
      >
        {word}
      </motion.span>
    </AnimatePresence>
  );
}
