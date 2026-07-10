"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

// A thin reading-progress line pinned to the top of the page. Spring-smoothed
// so it glides rather than snaps as you scroll.
export function ScrollProgress() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-forest/75"
    />
  );
}
