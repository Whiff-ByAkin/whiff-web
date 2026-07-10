"use client";

import { useEffect, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { SignUpCTA } from "./cta";
import { AnimatedWord, useWordCycle } from "./cycling-word";
import { FLAGS } from "../flags";

// "Meet your [ACTIVITY] [ROLE]" — the two lists cycle in sync by index, so
// the pill (the activity) and the word beside it (who they are to you) swap
// together, e.g. "Meet your gym spotter" -> "Meet your sidequest buddy".
const ACTIVITY_WORDS = [
  "gym",
  "sidequest",
  "pottery class",
  "golden hour walk",
  "birdwatching",
  "hiking",
  "trivia night",
  "farmers market",
  "board game",
  "karaoke",
  "brunch",
  "concert",
];
const ROLE_WORDS = [
  "spotter",
  "buddy",
  "partner",
  "partner",
  "partner",
  "buddy",
  "teammate",
  "companion",
  "rival",
  "partner",
  "buddy",
  "plus-one",
];

// Shared scroll-reveal: fade + lift on mount/entry, then stay put. Since the
// whole page is a single non-scrolling screen, this doubles as the entrance
// animation for everything below the fold.
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const mobileRevealEase = [0.16, 1, 0.3, 1] as const;
const mobileLayoutTransition = {
  type: "spring",
  stiffness: 75,
  damping: 22,
  mass: 0.9,
} as const;
const mobileHeightTransition = {
  duration: 1.15,
  ease: mobileRevealEase,
} as const;
const mobileRows = {
  hidden: { gridTemplateRows: "0fr" },
  visible: { gridTemplateRows: "1fr" },
};
const mobileStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};
const mobileItem = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: mobileRevealEase },
  },
};

const LABEL = "text-[10px] uppercase tracking-[0.24em] text-forest/40 font-sans";

// Outlined line icons (stroke, never filled) drawn in-house to match the
// hand-drawn SVGs elsewhere in the brand. 24×24, currentColor stroke.
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: 24,
  height: 24,
  "aria-hidden": true,
};

// a chat bubble — you mention something
const ChatIcon = () => (
  <svg {...iconProps}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
  </svg>
);

// a heart — whiff learns what you love
const HeartIcon = () => (
  <svg {...iconProps}>
    <path d="M12 20s-7.5-4.9-10-9.8C.5 6.8 2.7 3.5 6 3c2.2-.3 4.3.9 6 3 1.7-2.1 3.8-3.3 6-3 3.3.5 5.5 3.8 4 7.2C19.5 15.1 12 20 12 20z" />
  </svg>
);

// a map pin — you go do it together
const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

// The journey, three beats, labels only.
const STEPS = [
  { icon: <ChatIcon />, label: "You talk. whiff always listens." },
  { icon: <HeartIcon />, label: "It picks up on what you love." },
  { icon: <PinIcon />, label: "It finds someone into it too." },
];

export function HowItWorksSection() {
  const reduce = useReducedMotion();
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const detailsVisible = reduce || showMobileDetails;

  useEffect(() => {
    if (reduce) return;

    const timeout = window.setTimeout(() => setShowMobileDetails(true), 3000);
    return () => window.clearTimeout(timeout);
  }, [reduce]);

  return (
    <LayoutGroup id="how-it-works-reveal">
      <section
        id="how-it-works"
        aria-label="What whiff is and how it works"
        className="relative flex h-full flex-col items-center overflow-hidden border-t border-forest/10 px-6 pt-20 pb-12 md:px-10"
      >
        {/* statement + how it works fill the space above the invite */}
        <motion.div
          layout
          transition={reduce ? { duration: 0 } : mobileLayoutTransition}
          className={`flex flex-1 flex-col items-center justify-center transition-[gap] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-8 ${
            detailsVisible ? "gap-6" : "gap-0"
          }`}
        >
          <motion.div layout transition={reduce ? { duration: 0 } : mobileLayoutTransition}>
            <StatementBlock />
          </motion.div>

          <motion.div
            layout
            initial={false}
            animate={detailsVisible ? "visible" : "hidden"}
            variants={mobileRows}
            transition={reduce ? { duration: 0 } : mobileHeightTransition}
            className={`grid w-full overflow-hidden transition-opacity duration-700 ease-out sm:block sm:overflow-visible sm:opacity-100 ${
              detailsVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden sm:overflow-visible">
              <div className="hidden flex-col items-center gap-6 sm:flex">
                {/* a straight line separating the statement from how it works */}
                <span aria-hidden="true" className="h-px w-full max-w-xs bg-forest/15" />

                <HowBlock />
              </div>

              <div className="flex flex-col items-center gap-6 sm:hidden">
                {/* a straight line separating the statement from how it works */}
                <motion.span
                  aria-hidden="true"
                  className="h-px w-full max-w-xs bg-forest/15"
                  variants={mobileItem}
                />

                <MobileHowBlock active={detailsVisible} />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* request an invite, anchored to the bottom of the screen */}
        <motion.div
          layout
          initial={false}
          animate={detailsVisible ? "visible" : "hidden"}
          variants={mobileRows}
          transition={
            reduce ? { duration: 0 } : { ...mobileHeightTransition, delay: 0.12 }
          }
          className={`grid overflow-hidden transition-[opacity,padding] delay-150 duration-700 ease-out sm:block sm:overflow-visible sm:pb-2 sm:opacity-100 ${
            detailsVisible ? "pb-2 opacity-100" : "pb-0 opacity-0"
          }`}
        >
          <div className="flex min-h-0 flex-col items-center gap-3 overflow-hidden sm:overflow-visible">
            <MeetYourLine />

            <SignUpCTA />
            <p className="font-script text-forest/60 text-xl sm:text-2xl leading-none -rotate-2">
              this is not a dating app
            </p>
          </div>
        </motion.div>
      </section>
    </LayoutGroup>
  );
}

function MeetYourLine() {
  const i = useWordCycle(ACTIVITY_WORDS.length, 1700);

  return (
    <p className="flex items-center gap-2 whitespace-nowrap font-serif text-forest text-sm sm:text-base">
      Meet your
      <span className="inline-flex items-center rounded-full bg-oat ring-1 ring-forest/15 px-3.5 py-1.5 font-semibold">
        <AnimatedWord word={ACTIVITY_WORDS[i]} className="italic text-sienna" />
      </span>
      <AnimatedWord word={ROLE_WORDS[i]} className="font-semibold" />
    </p>
  );
}

/* ─────────────────────────────  how it works  ───────────────────────────── */

function HowBlock() {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
      <motion.h2
        {...(reduce ? {} : reveal())}
        className="font-serif font-semibold text-forest text-[clamp(1.6rem,3.8vw,2.3rem)] leading-tight tracking-tight"
      >
        You talk. whiff does the rest.
      </motion.h2>

      <div className="flex items-start justify-center gap-4 sm:gap-16">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.label}
            {...(reduce ? {} : reveal(0.15 + i * 0.1))}
            className="flex w-24 flex-col items-center gap-3 sm:w-44"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-oat text-forest sm:h-16 sm:w-16">
              {s.icon}
            </span>
            <p className="font-serif font-semibold text-forest text-base leading-snug sm:text-lg">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p
        {...(reduce ? {} : reveal(0.55))}
        className="font-serif italic text-forest/60 text-[clamp(0.95rem,2vw,1.15rem)] leading-snug"
      >
        Then you go do it, together.
      </motion.p>
    </div>
  );
}

function MobileHowBlock({ active }: { active: boolean }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={false}
      animate={reduce || active ? "visible" : "hidden"}
      variants={reduce ? undefined : mobileStagger}
      className="flex flex-col items-center gap-6 text-center"
    >
      <motion.h2
        variants={mobileItem}
        className="font-serif font-semibold text-forest text-[clamp(1.6rem,3.8vw,2.3rem)] leading-tight tracking-tight"
      >
        You talk. whiff does the rest.
      </motion.h2>

      <motion.div variants={mobileStagger} className="flex items-start justify-center gap-4">
        {STEPS.map((s) => (
          <motion.div
            key={s.label}
            variants={mobileItem}
            className="flex w-24 flex-col items-center gap-3"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-oat text-forest">
              {s.icon}
            </span>
            <p className="font-serif font-semibold text-forest text-base leading-snug">
              {s.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        variants={mobileItem}
        className="font-serif italic text-forest/60 text-[clamp(0.95rem,2vw,1.15rem)] leading-snug"
      >
        Then you go do it, together.
      </motion.p>
    </motion.div>
  );
}

/* ───────────────────────────────  the statement  ─────────────────────────────── */

function StatementBlock() {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <motion.div {...(reduce ? {} : reveal())} className="flex items-center gap-2">
        <span className="h-px w-6 bg-forest/25" aria-hidden="true" />
        <p className={LABEL}>our statement</p>
        <span className="h-px w-6 bg-forest/25" aria-hidden="true" />
      </motion.div>

      <motion.h3
        {...(reduce ? {} : reveal(0.08))}
        className="text-balance font-serif font-semibold text-forest text-[clamp(1.9rem,5vw,3rem)] leading-[1.1] tracking-tight"
      >
        We&rsquo;re anti&#8209;dating&#8209;app.
      </motion.h3>

      <motion.p
        {...(reduce ? {} : reveal(0.14))}
        className="max-w-xl text-balance font-serif font-semibold text-forest/85 text-[clamp(0.95rem,4.5vw,1.35rem)] leading-snug sm:text-[clamp(0.8rem,2.3vw,1.35rem)]"
      >
        Because you don&rsquo;t need to match or force chemistry with a hundred people
        to find the one.
      </motion.p>

      <motion.p
        {...(reduce ? {} : reveal(0.22))}
        className="max-w-xl text-balance font-serif font-semibold text-forest/85 text-[clamp(0.8rem,1.8vw,1.05rem)] leading-snug"
      >
        You just need to meet people{" "}
        <span className="underline decoration-terracotta decoration-2 underline-offset-4">
          who are already into the same strange, fun, specific things you are.
        </span>
      </motion.p>

      {/* who it's built for — gated by a feature flag (FLAGS.spectrumPositioning) */}
      {FLAGS.spectrumPositioning && (
        <motion.p
          {...(reduce ? {} : reveal(0.3))}
          className="max-w-xs font-serif italic text-forest/55 text-[11px] leading-snug sm:text-xs"
        >
          Made for the way you actually connect, especially if you&rsquo;re
          autistic, neurodivergent, or just tired of performing online.
        </motion.p>
      )}
    </div>
  );
}
