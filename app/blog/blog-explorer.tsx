"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { POSTS } from "./posts";

/* Pick a piece, it shoots out.
 *
 * ── Why every post is in the DOM at all times ────────────────────────────
 * The obvious build is AnimatePresence with only the open post mounted. That
 * would ship a page whose HTML contains exactly one of the three, and the whole
 * point of this page is that a crawler or an answer engine can read all of
 * them. So every panel is rendered and the inactive ones carry `hidden` — the
 * standard tab pattern, fully present in the initial HTML.
 *
 * That rules out mount-driven animation, so the stagger is variant-driven
 * instead: flipping `animate` between "resting" and "shown" replays it without
 * anything unmounting.
 */

const list: Variants = {
  resting: {},
  shown: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

/** The shot: in from the left, out of focus, decelerating hard into place. */
const line: Variants = {
  resting: { opacity: 0, x: -34, filter: "blur(6px)" },
  shown: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

/** Reduced motion gets the same choreography with the travel and the blur
 *  removed — a plain quick fade, never nothing at all, because these elements
 *  rest at opacity 0 and handing motion no animation would leave the page
 *  blank for anyone browsing with the preference on. */
const lineCalm: Variants = {
  resting: { opacity: 0, x: 0, filter: "blur(0px)" },
  shown: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.2 } },
};

export function BlogExplorer() {
  const [activeId, setActiveId] = useState(POSTS[0].id);
  const reduce = useReducedMotion();
  const item = reduce ? lineCalm : line;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /** Roving arrow-key navigation, which is what makes a tablist usable from a
   *  keyboard rather than merely reachable. */
  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const last = POSTS.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? i === last
          ? 0
          : i + 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? i === 0
            ? last
            : i - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActiveId(POSTS[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    // The three-column shape is the whole answer to "stop centring everything".
    // A rail, the prose, and the asides each get their own column on a wide
    // screen instead of one narrow ribbon down the middle.
    <div className="mx-auto grid w-full max-w-[92rem] gap-x-12 gap-y-8 lg:grid-cols-[minmax(13rem,18rem)_minmax(0,1fr)]">
      {/* ── the rail ── */}
      <div
        role="tablist"
        aria-label="Pieces to read"
        // All three choices stay visible as a compact index on phones. From lg
        // up it becomes the sticky vertical rail that follows long prose.
        className="grid grid-cols-3 gap-1.5 pb-2 lg:sticky lg:top-28 lg:h-fit lg:flex lg:flex-col lg:gap-1.5 lg:pb-0"
      >
        {POSTS.map((post, i) => {
          const isActive = post.id === activeId;
          return (
            <button
              key={post.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${post.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${post.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(post.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`group flex min-w-0 flex-col items-start gap-1 rounded-2xl border px-2 py-2.5 text-left font-display text-[0.72rem] font-semibold leading-tight transition-colors sm:flex-row sm:items-center sm:gap-2 sm:px-3 sm:text-sm lg:w-full lg:gap-3 lg:px-4 lg:py-3.5 ${
                isActive
                  ? "border-ink/25 bg-ground-lift text-ink"
                  : "border-transparent text-ink-muted hover:bg-ground-lift/70 hover:text-ink"
              }`}
            >
              {/* A numeral rather than a bullet: three pieces meant to be read
                  in order, and a number says that without a word of copy. */}
              <span
                aria-hidden="true"
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.68rem] font-bold transition-colors ${
                  isActive
                    ? "bg-ink text-on-ink"
                    : "bg-stone/45 text-ink-muted group-hover:bg-stone"
                }`}
              >
                {i + 1}
              </span>
              <span className="min-w-0 whitespace-normal sm:hidden">
                {post.mobileLabel}
              </span>
              <span className="hidden min-w-0 whitespace-normal sm:inline">
                {post.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── the pieces ── */}
      <div className="min-w-0">
        {POSTS.map((post) => {
          const isActive = post.id === activeId;
          return (
            <div
              key={post.id}
              role="tabpanel"
              id={`panel-${post.id}`}
              aria-labelledby={`tab-${post.id}`}
              hidden={!isActive}
              tabIndex={0}
              className="focus-visible:outline-none"
            >
              <motion.div
                variants={list}
                initial="resting"
                animate={isActive ? "shown" : "resting"}
                // Two columns from xl up, always. Every post carries asides or
                // a pullquote precisely so this column is never blank — an
                // empty third of a wide monitor was what made the old layout
                // read as a narrow ribbon down the middle.
                className="grid gap-x-10 gap-y-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]"
              >
                <div>
                  <motion.h2
                    variants={item}
                    className="text-balance font-display text-[clamp(1.7rem,3.6vw,2.7rem)] font-semibold leading-[1.1] tracking-tight text-ink"
                  >
                    {post.title}
                  </motion.h2>

                  <motion.p
                    variants={item}
                    className="mt-3 max-w-[52ch] font-display text-[1.05rem] font-medium leading-snug text-ink/85"
                  >
                    {post.standfirst}
                  </motion.p>

                  {/* Prose is left-aligned and capped at a readable measure.
                      Centred body text is hard to read at any width — the eye
                      loses the start of each line. */}
                  <div className="mt-6 space-y-4">
                    {post.paragraphs.map((p, i) => (
                      <motion.p
                        key={p.slice(0, 32)}
                        variants={item}
                        className={`max-w-[64ch] leading-relaxed text-ink/85 ${
                          i === 0 ? "text-[1.08rem] text-ink/90" : ""
                        }`}
                      >
                        {p}
                      </motion.p>
                    ))}
                  </div>
                </div>

                <motion.div variants={item} className="min-w-0 space-y-8">
                  {post.asides?.map((aside) => (
                    <aside key={aside.heading}>
                      <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
                        {aside.heading}
                      </h3>
                      <dl className="mt-4 space-y-3">
                        {aside.items.map((it) => (
                          <motion.div
                            key={it.term}
                            variants={item}
                            className="rounded-2xl border border-line bg-ground-lift p-4"
                          >
                            <dt className="font-display text-[0.95rem] font-semibold text-ink">
                              {it.term}
                            </dt>
                            <dd className="mt-1 text-[0.95rem] leading-relaxed text-ink/75">
                              {it.body}
                            </dd>
                          </motion.div>
                        ))}
                      </dl>
                    </aside>
                  ))}

                  {post.pullquote && (
                    <blockquote className="border-l-2 border-stone pl-5 font-display text-[clamp(1.15rem,1.6vw,1.4rem)] font-semibold leading-snug text-ink xl:mt-12">
                      {post.pullquote}
                    </blockquote>
                  )}
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
