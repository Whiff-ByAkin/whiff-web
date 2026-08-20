"use client";

import { motion, useReducedMotion } from "motion/react";

/* Four cardinal seats, using the same geometry and visual vocabulary as the
 * mobile CircleMark. Three seats are occupied; the left seat stays open until
 * somebody reaches the CTA. The seats assemble from a nearby swept position,
 * never from the viewport edge, so the complete moment remains local to the
 * mascot on phones and short viewports. */

const COUNT = 4;
const EMPTY = 3;
const START = 0.08;
const STAGGER = 0.07;
const TRAVEL = 0.86;
const SETTLED = START + STAGGER * (COUNT - 1) + TRAVEL;
const SPIN_DURATION = 12;

const INK = "#241a15";
const INK_FAINT = "#9a8b81";
/* The open seat is unpainted, but the keyword `transparent` is not a value
 * Motion can interpolate — animating to or from it logs a warning and snaps.
 * Ink at zero alpha is the same pixel and it tweens, so the seat fills from
 * its own colour instead of fading up through browser-default black. */
const INK_CLEAR = "rgba(36, 26, 21, 0)";

/* Top, right, bottom, left. The initial positions sit farther out and 52deg
 * behind their seats, matching CircleMark's curved approach. Values are
 * percentages of the local square because each animated wrapper fills it. */
const SEATS = [
  { x: 0, y: -50, fromX: 54, fromY: -42 },
  { x: 50, y: 0, fromX: 42, fromY: 54 },
  { x: 0, y: 50, fromX: -54, fromY: 42 },
  { x: -50, y: 0, fromX: -42, fromY: -54 },
];

export function CircleHalo({
  filled = false,
  children,
}: {
  filled?: boolean;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative grid place-items-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-[2] aspect-square h-[142%]"
        style={{ "--circle-settled": `${SETTLED}s` } as React.CSSProperties}
      >
        {/* The halo owns the orbit, while the mascot remains in the sibling
            layer below. It makes one measured revolution after assembly and
            then rests, leaving the hero calm once the entrance is complete. */}
        <motion.div
          className="absolute inset-0 [will-change:transform]"
          initial={{ rotate: 0 }}
          animate={{ rotate: reduce ? 0 : 360 }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  delay: SETTLED,
                  duration: SPIN_DURATION,
                  ease: "linear",
                }
          }
        >
          <span className="circle-bloom absolute inset-0 rounded-full" />
          <motion.span
            className="absolute inset-0 rounded-full border border-line"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reduce ? 0 : 0.5,
              delay: reduce ? 0 : SETTLED - 0.28,
              ease: "easeOut",
            }}
          />

          {SEATS.map((seat, index) => {
            const empty = index === EMPTY;
            const closed = empty && filled;

            return (
              <motion.span
                key={index}
                className="absolute inset-0 block"
                initial={{
                  x: `${seat.fromX}%`,
                  y: `${seat.fromY}%`,
                  opacity: 0,
                }}
                animate={{ x: `${seat.x}%`, y: `${seat.y}%`, opacity: 1 }}
                transition={{
                  delay: reduce ? 0 : START + index * STAGGER,
                  duration: reduce ? 0 : TRAVEL,
                  ease: [0.2, 0.82, 0.24, 1],
                }}
              >
                <motion.span
                  className={`absolute left-1/2 top-1/2 block h-[8%] w-[8%] -translate-x-1/2 -translate-y-1/2 rounded-full ring-[3px] ring-ground ${
                    empty && !closed ? "seat-searching" : ""
                  }`}
                  initial={false}
                  animate={{
                    backgroundColor: empty && !closed ? INK_CLEAR : INK,
                    borderColor: empty && !closed ? INK_FAINT : INK,
                    borderWidth: empty && !closed ? 2 : 0,
                    scale: closed ? 1.18 : 1,
                  }}
                  transition={{
                    duration: closed ? 0.32 : 0.18,
                    type: closed ? "spring" : "tween",
                    stiffness: 360,
                    damping: 18,
                  }}
                />
              </motion.span>
            );
          })}
        </motion.div>
      </div>

      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
