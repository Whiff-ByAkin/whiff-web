"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/* The circle, formed rather than drawn.
 *
 * Six places. Five taken, one still an outline — the empty seat.
 *
 * ── The gathering ────────────────────────────────────────────────────────
 * The dots do not start as a circle. They start scattered to the edges of the
 * page — above, below, both sides, both corners — and travel inward to take
 * their places. The circle is something that *happens*, and it happens in the
 * first two seconds of the page, which is the one thing whiff actually does.
 *
 * ── The dark ─────────────────────────────────────────────────────────────
 * And it happens in the dark. The page opens as a black field with six lights
 * travelling across it; when the last one lands, the circle releases and light
 * spreads out from it to reveal the site. So the circle is not an ornament on
 * the page — it is where the page comes from.
 *
 * The dark field is `.dawn` in globals.css and is deliberately plain CSS: it
 * has to be correct in the first paint (a JS veil would flash the lit page for
 * the length of hydration) and it has to open even if the bundle never lands.
 * It lives here, inside the ring, purely so it is centred on the ring for free
 * — no measuring, no resize listener, no second source of truth for where the
 * light comes from. SETTLED is handed to it as a custom property.
 *
 * Earlier versions rotated a finished ring at constant speed. A rigid body
 * turning at constant angular velocity is, to anyone who has used a computer,
 * a loading spinner — so the hero's first word was "wait", which is precisely
 * the feeling whiff exists to remove.
 *
 * Once they have settled, a single light circulates the ring, brightening each
 * place as it passes: something is still out there looking for the sixth. Reach
 * for the button and the empty seat fills and the light stops — the circle is
 * closed, so nothing is still searching.
 *
 * ── Why no animation library ─────────────────────────────────────────────
 * Rive would add a ~200KB WASM runtime and Lottie keeps a requestAnimationFrame
 * ticker alive for the life of the page. For one hero ornament, both are a
 * straight Core Web Vitals tax. Everything here is transform and opacity.
 */

const COUNT = 6;
const EMPTY = 5; // the place being held

/** Where each place travels in from, in viewport units so they genuinely begin
 *  at the edges of the page rather than just outside the ring. Index order
 *  walks clockwise from 12 o'clock, so each dot comes from roughly the
 *  direction its seat faces — nothing crosses the mascot on its way in. */
const ORIGINS = [
  { x: "2vw", y: "-46vh" }, // 12 o'clock — from above
  { x: "44vw", y: "-30vh" }, // 2  — top right
  { x: "46vw", y: "32vh" }, // 4  — bottom right
  { x: "-3vw", y: "46vh" }, // 6  — from below
  { x: "-46vw", y: "32vh" }, // 8  — bottom left
  { x: "-44vw", y: "-30vh" }, // 10 — top left, the empty seat
];

/** Seconds for the light to complete one lap, once the circle exists. */
const LAP = 7;
/** How long a place stays bright as the light passes it. */
const TICK = 0.9;

/** The gathering: when the first dot starts moving, and the gap between each.
 *  SETTLED is when the last one has arrived — everything else waits for it,
 *  including the dawn, which is why these numbers are tighter than they were.
 *  Two and a bit seconds of a circle assembling is a pleasant flourish; two and
 *  a bit seconds of a black screen is a visitor deciding the site is broken. */
const START = 0.25;
const STAGGER = 0.11;
const TRAVEL = 1;
const SETTLED = START + STAGGER * (COUNT - 1) + TRAVEL;

// Espresso palette, inlined because these are animated values rather than
// classes — Tailwind cannot interpolate a CSS variable through a keyframe.
const LATTE = "#d8b9a3";
const LATTE_EDGE = "#c9a68e";
const ESPRESSO = "#6b4a38";

export function CircleHalo({
  filled = false,
  children,
}: {
  filled?: boolean;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  /* The dawn is a one-time event, so it gets torn out rather than left lying
   * around: it is a viewport-sized painted layer, and the z-90 it needs is a
   * genuine nuisance once it is over — an element stacked that high sits
   * outside the invite dialog's backdrop-filter, so the ring stayed crisp and
   * bright over the dimmed page behind the modal.
   *
   * Server and first client render agree (both dark), so this cannot mismatch
   * on hydration, and everything it removes is decoration — if the JS never
   * arrives the CSS has already opened the page on its own. */
  const [dawnOver, setDawnOver] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setDawnOver(true), (SETTLED + 1.6) * 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    // z-90 while the dark is up, so it covers the fixed header (z-50) too, and
    // still passes under the invite dialog (z-100). The wrapper in the hero is
    // unpositioned on purpose, which is what lets this reach the root stacking
    // context and beat the header.
    <div
      className={`relative grid place-items-center ${dawnOver ? "" : "z-[90]"}`}
    >
      {/* The dark, and the light that ends it. Centred on the ring because it
          is a child of it; sized in vmax so it covers the viewport from
          wherever the ring sits. Everything it does is in globals.css. */}
      {!dawnOver && (
        <div
          aria-hidden="true"
          className="dawn"
          style={{ "--dawn-delay": `${SETTLED}s` } as React.CSSProperties}
        />
      )}

      {/* z-2 puts the lights above the dark field (z-1), which is above the
          mascot (z-auto) — so during the dark phase the six dots are the only
          thing on screen, and the mascot is revealed by them. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute z-[2] aspect-square h-[144%] ${
          dawnOver ? "" : "dawn-lights"
        }`}
        style={{ "--dawn-delay": `${SETTLED}s` } as React.CSSProperties}
      >
        {/* The hairline only appears once there is a circle to describe, so it
            fades in as the last dot lands. Without a rule joining them, six
            dots read as dust on the lens. */}
        <motion.span
          className="absolute inset-0 rounded-full border border-espresso/[0.13]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: reduce ? 0 : SETTLED - 0.3 }}
        />

        {/* The travelling light, held back until the circle has formed.
            Opacity lives on this wrapper and rotation on the child, so toggling
            `filled` cannot restart the lap mid-flight. */}
        {!reduce && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: filled ? 0 : 1 }}
            transition={{
              duration: filled ? 0.45 : 1,
              delay: filled ? 0 : SETTLED,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: LAP,
                ease: "linear",
                repeat: Infinity,
                delay: SETTLED,
              }}
            >
              {/* The tail, as three arcs of decreasing length and increasing
                  opacity. A stroke gradient cannot follow a curved path, so
                  stacking segments is how the taper gets made. All three end at
                  12 o'clock, where the head sits. */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                {[
                  { len: 46, opacity: 0.1 },
                  { len: 27, opacity: 0.22 },
                  { len: 13, opacity: 0.42 },
                ].map((seg) => (
                  <circle
                    key={seg.len}
                    cx="50"
                    cy="50"
                    r="50"
                    fill="none"
                    stroke={ESPRESSO}
                    strokeOpacity={seg.opacity}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    // rotate(-90) moves the path's start to 12 o'clock; the
                    // dash offset then hangs the segment behind it, so the tail
                    // trails the head instead of leading it.
                    transform="rotate(-90 50 50)"
                    strokeDasharray={`${seg.len} ${2 * Math.PI * 50 - seg.len}`}
                    strokeDashoffset={seg.len}
                  />
                ))}
              </svg>

              <span className="absolute left-1/2 top-0 block h-[4.5%] w-[4.5%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-espresso shadow-[0_0_10px_2px_rgba(107,74,56,0.35)]" />
            </motion.div>
          </motion.div>
        )}

        {Array.from({ length: COUNT }, (_, i) => {
          // start at 12 o'clock and walk clockwise, which is the direction the
          // light travels — so seat i is reached at (i / COUNT) of a lap
          const angle = (i / COUNT) * 2 * Math.PI - Math.PI / 2;
          const empty = i === EMPTY;
          const closed = empty && filled;

          return (
            // Three layers, each owning one job, because they animate on
            // different clocks and would otherwise fight over `transform`:
            //   outer  — the seat's position on the ring (never animates)
            //   middle — the journey in from the edge of the page (once)
            //   inner  — colour, and the tick as the light passes (forever)
            <span
              key={i}
              className="absolute left-1/2 top-1/2 block h-[7.5%] w-[7.5%]"
              style={{
                // polar → cartesian in percentages of the ring box, so the
                // whole thing scales with the mascot and never needs a
                // breakpoint
                marginLeft: `${Math.cos(angle) * 50}%`,
                marginTop: `${Math.sin(angle) * 50}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.span
                className="block h-full w-full"
                initial={
                  reduce ? false : { ...ORIGINS[i], opacity: 0, scale: 0.4 }
                }
                animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                transition={{
                  delay: reduce ? 0 : START + i * STAGGER,
                  duration: TRAVEL,
                  // A long, decelerating arrival: fast off the edge, easing
                  // into its place rather than snapping to it.
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <motion.span
                  className="block h-full w-full rounded-full ring-4 ring-page"
                  initial={reduce ? false : { backgroundColor: LATTE }}
                  animate={{
                    backgroundColor: empty
                      ? closed
                        ? ESPRESSO
                        : "rgba(216,185,163,0)"
                      : LATTE,
                    borderColor: closed ? ESPRESSO : LATTE_EDGE,
                    borderWidth: empty ? 2 : 0,
                    // A taken place brightens as the light reaches it; the
                    // vacancy breathes on its own cycle instead, because
                    // nothing is passing through a place nobody is in.
                    scale: closed
                      ? 1.25
                      : reduce
                        ? 1
                        : empty
                          ? [1, 1.16, 1]
                          : [1, 1.22, 1],
                  }}
                  transition={{
                    default: { duration: 0.35, ease: "easeOut" },
                    scale: closed
                      ? { type: "spring", stiffness: 420, damping: 14 }
                      : reduce
                        ? { duration: 0 }
                        : empty
                          ? {
                              delay: SETTLED + 0.6,
                              duration: 4,
                              ease: "easeInOut",
                              repeat: Infinity,
                            }
                          : {
                              // phase-locked to the light: place i ticks when
                              // the head is on top of it, every lap, forever
                              delay: SETTLED + (i / COUNT) * LAP,
                              duration: TICK,
                              ease: "easeInOut",
                              repeat: Infinity,
                              repeatDelay: LAP - TICK,
                            },
                  }}
                />
              </motion.span>
            </span>
          );
        })}
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}
