"use client";

import { useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

/* The product's own artifact as the hero: the deck of personality cards the
 * app writes after its reading. One intro card on top, then the six types.
 *
 * Every card's text is real DOM text rendered on the server, so the six types
 * are crawlable even though only the top card is exposed to a screen reader.
 * Rotations are fixed per card — no Math.random at render — so the server and
 * client draw the identical scatter and hydration stays deterministic. */

type Card = {
  id: string;
  label: string;
  name: string;
  tagline: string;
  circle: string;
  /** Who this type clicks with — real pairing data from the app, rendered at
   *  the card's foot. */
  clicks: string;
};

const INTRO = {
  id: "intro",
  label: "The reading",
  line: "First, whiff reads you.",
  sub: "Five questions, answered in your own words. Then a card like these.",
};

const HOOK = {
  id: "hook",
  label: "The question",
  line: "Which one are you?",
  sub: "whiff reads you in week one. join and find out.",
};

const TYPES: Card[] = [
  {
    id: "spark",
    label: "whiff finds · Spark",
    name: "Spark",
    tagline: "Spontaneous, gets things moving",
    circle:
      "You bring the momentum. Nothing gets scheduled to death while you are here.",
    clicks: "Host · Anchor · Connector",
  },
  {
    id: "scout",
    label: "whiff finds · Scout",
    name: "Scout",
    tagline: "Curious, finds things nobody knew about",
    circle:
      "You bring the discovery. Your Circle ends up somewhere none of them would have found.",
    clicks: "Host · Diver · Spark",
  },
  {
    id: "host",
    label: "whiff finds · Host",
    name: "Host",
    tagline: "Organiser, turns ideas into plans",
    circle: "You bring the structure. Ideas turn into actual Saturdays around you.",
    clicks: "Spark · Scout · Connector",
  },
  {
    id: "connector",
    label: "whiff finds · Connector",
    name: "Connector",
    tagline: "Warm, makes people click",
    circle:
      "You bring the chemistry. Four strangers turn into a group because you are in it.",
    clicks: "Diver · Spark · Anchor",
  },
  {
    id: "anchor",
    label: "whiff finds · Anchor",
    name: "Anchor",
    tagline: "Grounded, easy to be around",
    circle:
      "You bring the calm. You are the one who actually shows up, and the group settles around that.",
    clicks: "Spark · Connector · Host",
  },
  {
    id: "diver",
    label: "whiff finds · Diver",
    name: "Diver",
    tagline: "Skips small talk, goes deep",
    circle:
      "You bring the depth. Conversations get past the weather because you refuse to stay there.",
    clicks: "Connector · Scout · Anchor",
  },
];

/* Intro card, six types, and the hook that closes the cycle. */
const COUNT = TYPES.length + 2;
const HOOK_INDEX = COUNT - 1;

/* Fixed scatter, one angle per card. Small, uneven, and never symmetric — a
 * pile squared by a person, not a machine. */
const SCATTER = [-1.6, 2.7, -3.3, 1.9, -2.5, 3.1, -1.2, 2.2];

/* Cards deeper than this are fully hidden behind the pile. */
const VISIBLE_DEPTH = 3;

export function TypeDeck({
  // The hook card's "join whiff" — the hero wires it to the CTA morph.
  onJoin,
}: {
  onJoin?: () => void;
} = {}) {
  const reduce = useReducedMotion();
  const [head, setHead] = useState(0);
  // Blocks re-entry while the top card is mid-flight.
  const busyRef = useRef(false);

  const advance = () => setHead((h) => (h + 1) % COUNT);
  const retreat = () => setHead((h) => (h - 1 + COUNT) % COUNT);

  const topCard = head >= 1 && head <= TYPES.length ? TYPES[head - 1] : null;

  function onKeyDown(e: React.KeyboardEvent) {
    // The hook card's button lives inside this group and bubbles its keys
    // here; only keys aimed at the deck itself may turn it, or Enter on
    // "join whiff" would flip the card instead of pressing the button.
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!busyRef.current) advance();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!busyRef.current) retreat();
    }
  }

  return (
    // The gap clears the pile's downward spread (the behind-cards' fixed px
    // offsets) so the hint never sits on the paper itself.
    <div className="flex flex-col items-center gap-[clamp(1.35rem,2.4vh,1.6rem)]">
      <div
        role="group"
        aria-roledescription="card deck"
        aria-label="The six whiff personality types. Press Enter or the arrow keys to turn the deck."
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="deck-frame"
      >
        <span className="deck-shadow" aria-hidden="true" />

        {/* Intro card */}
        <DeckCard
          depth={(0 - head + COUNT) % COUNT}
          baseRotate={SCATTER[0]}
          reduce={reduce}
          busyRef={busyRef}
          onAdvance={advance}
        >
          <div className="card-body">
            <p className="card-label">{INTRO.label}</p>
            <p className="card-name text-[max(8.2cqw,1rem)] leading-[1.2]">
              {INTRO.line}
            </p>
            <p className="card-circle-line">{INTRO.sub}</p>
            <p className="card-hint" aria-hidden="true">
              swipe →
            </p>
          </div>
        </DeckCard>

        {/* The six types */}
        {TYPES.map((card, i) => (
          <DeckCard
            key={card.id}
            depth={(i + 1 - head + COUNT) % COUNT}
            baseRotate={SCATTER[i + 1]}
            reduce={reduce}
            busyRef={busyRef}
            onAdvance={advance}
          >
            <div className="card-body">
              <p className="card-label">{card.label}</p>
              <p className="card-name">{card.name}</p>
              <p className="card-tagline">{card.tagline}</p>
              <span className="card-rule" aria-hidden="true" />
              <p className="card-circle-line">{card.circle}</p>
              {/* Who the type clicks with — the app's real pairing data. */}
              <div className="card-clicks">
                <span className="card-rule" aria-hidden="true" />
                <p className="card-clicks-label">clicks with</p>
                <p className="card-clicks-names">{card.clicks}</p>
              </div>
              <p className="card-counter" aria-hidden="true">
                {i + 1} / {TYPES.length}
              </p>
            </div>
          </DeckCard>
        ))}

        {/* The hook. After Diver the deck stops describing and asks. */}
        <DeckCard
          depth={(HOOK_INDEX - head + COUNT) % COUNT}
          baseRotate={SCATTER[HOOK_INDEX]}
          reduce={reduce}
          busyRef={busyRef}
          onAdvance={advance}
        >
          <div className="card-body">
            <p className="card-label">{HOOK.label}</p>
            <p className="card-name text-[max(9.4cqw,1.1rem)] leading-[1.15]">
              {HOOK.line}
            </p>
            <p className="card-circle-line">{HOOK.sub}</p>
            <button
              type="button"
              data-cta
              // Reachable only while it is the top card; behind the pile it
              // is aria-hidden with its whole card, and a hidden tab stop is
              // worse than none.
              tabIndex={head === HOOK_INDEX ? 0 : -1}
              onClick={() => onJoin?.()}
              className="btn-ink mt-[1.2cqh] inline-flex items-center justify-center rounded-full px-[7cqw] py-[2.6cqw] font-display text-[max(4.4cqw,0.72rem)] font-semibold tracking-wide"
            >
              join whiff
            </button>
          </div>
        </DeckCard>
      </div>

      {/* The click affordance the drag gesture can't announce. A screen reader
          lands here right after the deck; the live region below narrates what
          each turn revealed. */}
      <button
        type="button"
        onClick={() => {
          if (!busyRef.current) advance();
        }}
        className="group/next inline-flex items-center gap-1 font-body text-[clamp(0.68rem,1.9vw,0.78rem)] font-semibold tracking-[0.08em] text-ink-faint transition-colors hover:text-ink"
      >
        next card
        {/* Nunito has no U+21B7, so the turn arrow is drawn, not typed */}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-[0.9em] w-[0.9em] transition-transform duration-200 group-hover/next:rotate-45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M3 9.5a5.5 5.5 0 0 1 9.9-2.4" />
          <path d="M13.5 3.5v3.8h-3.8" />
        </svg>
      </button>

      <p className="sr-only" aria-live="polite">
        {head === 0
          ? `Card 1 of ${COUNT}. First, whiff reads you.`
          : head === HOOK_INDEX
            ? `Card ${COUNT} of ${COUNT}. ${HOOK.line} ${HOOK.sub} Use the join whiff button to begin.`
            : `Card ${head + 1} of ${COUNT}. ${topCard!.name}: ${topCard!.tagline}. ${topCard!.circle} Clicks with ${topCard!.clicks.replaceAll(" · ", ", ")}.`}
      </p>
    </div>
  );
}

function DeckCard({
  depth,
  baseRotate,
  reduce,
  busyRef,
  onAdvance,
  children,
}: {
  depth: number;
  baseRotate: number;
  reduce: boolean | null;
  busyRef: React.RefObject<boolean>;
  onAdvance: () => void;
  children: React.ReactNode;
}) {
  const isTop = depth === 0;
  const x = useMotionValue(0);
  // The card leans into the drag — rotation proportional to travel.
  const rotate = useTransform(x, (v) => baseRotate + v / 22);

  function flyOff(direction: number, velocity = 0) {
    if (reduce) {
      // No travel: the card teleports to the bottom of the pile.
      x.jump(0);
      onAdvance();
      return;
    }
    busyRef.current = true;
    // Stiff and near-critically damped: a flick, not a glide. The card is
    // invisible by the time it settles, so the spring only needs to get it
    // clear of the pile fast — restDelta/restSpeed end it early instead of
    // chasing sub-pixel rest 620px off stage.
    animate(x, direction * 620, {
      type: "spring",
      stiffness: 520,
      damping: 42,
      velocity,
      restDelta: 0.5,
      restSpeed: 10,
      onComplete: () => {
        // By now the card is at the bottom of the pile (opacity 0), so the
        // snap back to centre happens out of sight.
        onAdvance();
        x.jump(0);
        busyRef.current = false;
      },
    });
    // Advancing immediately after the card clears its own footprint would
    // read better, but waiting for onComplete keeps state changes serial and
    // the spring is fast enough that nobody waits on it.
  }

  function onDragEnd(
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) {
    const past =
      Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 480;
    if (past) {
      flyOff(Math.sign(info.offset.x || info.velocity.x || 1), info.velocity.x);
    } else if (reduce) {
      x.jump(0);
    } else {
      animate(x, 0, { type: "spring", stiffness: 420, damping: 30 });
    }
  }

  return (
    <motion.div
      aria-hidden={!isTop}
      className="type-card"
      // The grab cursor rides a data attribute + CSS rather than this style
      // object: reduced-motion preference is unknown on the server, and any
      // style derived from it would hydrate mismatched.
      data-top={isTop || undefined}
      style={{ x, rotate, zIndex: COUNT - depth }}
      // initial={false}: the server frame IS the settled frame. Depth is
      // deterministic, so hydration matches and nothing jumps on load.
      initial={false}
      animate={{
        y: depth * 6,
        scale: 1 - depth * 0.035,
        opacity: depth > VISIBLE_DEPTH ? 0 : 1,
      }}
      transition={
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 320, damping: 30 }
      }
      // Drag stays enabled under reduced motion: it is direct manipulation,
      // driven entirely by the visitor's own pointer, and the settle is
      // instant there rather than sprung. It also must not depend on `reduce`,
      // because Motion gives draggable elements a tabIndex — an SSR-visible
      // attribute that would hydrate mismatched for reduced-motion visitors.
      drag={isTop ? "x" : false}
      dragElastic={0.9}
      dragMomentum={false}
      onDragEnd={isTop ? onDragEnd : undefined}
      // Motion cancels the tap gesture once a drag starts, so this only fires
      // for a genuine click — the no-drag way through the deck.
      onTap={
        isTop
          ? (event) => {
              // The hook card's button sits inside the tappable card; a press
              // on it must press the button, not turn the deck.
              if ((event.target as HTMLElement).closest?.("[data-cta]")) return;
              if (!busyRef.current) flyOff(1);
            }
          : undefined
      }
      whileHover={
        isTop && !reduce
          ? { y: -4, boxShadow: "0 24px 48px -18px rgb(36 26 21 / 45%)" }
          : undefined
      }
    >
      <span className="card-corner card-corner-tl" aria-hidden="true" />
      <span className="card-corner card-corner-tr" aria-hidden="true" />
      <span className="card-corner card-corner-bl" aria-hidden="true" />
      <span className="card-corner card-corner-br" aria-hidden="true" />
      {children}
    </motion.div>
  );
}
