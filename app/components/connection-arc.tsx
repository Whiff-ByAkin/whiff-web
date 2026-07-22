"use client";

import { motion, useReducedMotion } from "motion/react";

// The signature: two dots — two people, each with their own AI — and the arc
// whiff draws between them. The path draws itself on entrance, then a light
// travels across it, over and over: the introduction being made. This is the
// one motion nobody else's site has, and it *is* the product in a glance.
export function ConnectionArc() {
  const reduce = useReducedMotion() ?? false;
  const arc = "M22 40 Q110 2 198 40";

  return (
    <svg
      viewBox="0 0 220 56"
      width="220"
      height="56"
      fill="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      {/* the faint full arc, always present so the shape reads even mid-draw */}
      <path d={arc} stroke="var(--color-line)" strokeWidth="2" strokeLinecap="round" />

      {/* the rust arc that draws itself on */}
      {reduce ? (
        <path d={arc} stroke="var(--color-rust)" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <motion.path
          d={arc}
          stroke="var(--color-rust)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      )}

      {/* the two people */}
      <Endpoint cx={22} cy={40} reduce={reduce} delay={0} />
      <Endpoint cx={198} cy={40} reduce={reduce} delay={0.9} />

      {/* the light traveling the arc — the introduction, on repeat */}
      {!reduce && (
        <circle r="3.5" fill="#fff" stroke="var(--color-rust)" strokeWidth="1.5">
          <animateMotion dur="3.4s" repeatCount="indefinite" path={arc} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
          <animate attributeName="opacity" dur="3.4s" repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.12;0.88;1" />
        </circle>
      )}
    </svg>
  );
}

function Endpoint({
  cx,
  cy,
  reduce,
  delay,
}: {
  cx: number;
  cy: number;
  reduce: boolean;
  delay: number;
}) {
  return (
    <g>
      {!reduce && (
        <motion.circle
          cx={cx}
          cy={cy}
          r="9"
          fill="var(--color-rust)"
          initial={{ opacity: 0.35, scale: 0.9 }}
          animate={{ opacity: [0.3, 0, 0.3], scale: [0.9, 1.7, 0.9] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      )}
      <circle cx={cx} cy={cy} r="5.5" fill="var(--color-card)" stroke="var(--color-rust)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="2" fill="var(--color-rust)" />
    </g>
  );
}
