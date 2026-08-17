"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { POSTS } from "./posts";

const OVERVIEW_ID = "one-paragraph-overview";
const OVERVIEW_LABEL = "If you only read one paragraph";
const OPTIONS = [
  { id: OVERVIEW_ID, label: OVERVIEW_LABEL },
  ...POSTS.map((post) => ({ id: post.id, label: post.label })),
];

const list: Variants = {
  resting: {},
  shown: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

const line: Variants = {
  resting: { opacity: 0, x: -34, filter: "blur(6px)" },
  shown: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const lineCalm: Variants = {
  resting: { opacity: 0, x: 0, filter: "blur(0px)" },
  shown: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.2 } },
};

export function BlogExplorer() {
  const [activeId, setActiveId] = useState(OVERVIEW_ID);
  const reduce = useReducedMotion();
  const item = reduce ? lineCalm : line;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const contentRefs = useRef<Record<string, HTMLHeadingElement | null>>({});

  function activate(id: string, focusContent = false) {
    setActiveId(id);
    if (!focusContent) return;

    requestAnimationFrame(() => {
      const heading = contentRefs.current[id];
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  /** Automatic-activation roving tabs for the desktop editorial rail. */
  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const last = OPTIONS.length - 1;
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    activate(OPTIONS[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="mx-auto grid w-full max-w-[92rem] gap-x-12 gap-y-8 lg:grid-cols-[minmax(13rem,18rem)_minmax(0,1fr)]">
      {/* A native chooser stays compact at 320px and scales to any number of
          posts without inventing a horizontal scrolling control. */}
      <div className="min-w-0 lg:hidden">
        <label
          htmlFor="blog-topic-select"
          className="font-display text-sm font-semibold text-ink"
        >
          Choose what to read
        </label>
        <select
          id="blog-topic-select"
          value={activeId}
          aria-controls={`panel-${activeId}`}
          onChange={(event) => activate(event.target.value)}
          className="mt-2 min-h-11 w-full max-w-full rounded-xl border border-line bg-ground-lift px-3 py-2.5 font-display text-sm font-semibold text-ink"
        >
          {OPTIONS.map((option, index) => (
            <option key={option.id} value={option.id}>
              {index === 0 ? option.label : `${index}. ${option.label}`}
            </option>
          ))}
        </select>
      </div>

      {/* The rail keeps its tab semantics and gains its own bounded scroll
          area, so adding twenty topics does not push the page index offscreen. */}
      <div className="hidden self-start lg:sticky lg:top-28 lg:block">
        <div
          role="tablist"
          aria-label="Pieces to read"
          className="flex max-h-[calc(100svh-8rem)] flex-col gap-1.5 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:var(--color-stone)_transparent] [scrollbar-width:thin]"
        >
          {OPTIONS.map((option, index) => {
            const isActive = option.id === activeId;
            return (
              <button
                key={option.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                role="tab"
                id={`tab-${option.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${option.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => activate(option.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={`group flex w-full min-w-0 items-center gap-3 rounded-2xl border px-4 py-3.5 text-left font-display text-sm font-semibold leading-tight transition-colors ${
                  isActive
                    ? "border-ink/25 bg-ground-lift text-ink"
                    : "border-transparent text-ink-muted hover:bg-ground-lift/70 hover:text-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1 text-[0.68rem] font-bold transition-colors ${
                    isActive
                      ? "bg-ink text-on-ink"
                      : "bg-stone/45 text-ink-muted group-hover:bg-stone"
                  }`}
                >
                  {index === 0 ? "¶" : index}
                </span>
                <span className="min-w-0 whitespace-normal">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0">
        <section
          role="tabpanel"
          id={`panel-${OVERVIEW_ID}`}
          aria-labelledby={`tab-${OVERVIEW_ID}`}
          hidden={activeId !== OVERVIEW_ID}
        >
          <h2
            ref={(element) => {
              contentRefs.current[OVERVIEW_ID] = element;
            }}
            tabIndex={-1}
            className="scroll-mt-28 text-balance font-display text-[clamp(1.7rem,3.6vw,2.7rem)] font-semibold leading-[1.1] tracking-tight text-ink"
          >
            {OVERVIEW_LABEL}
          </h2>

          <ol className="mt-7 border-t border-line">
            {POSTS.map((post, index) => (
              <li key={post.id} className="border-b border-line py-6 sm:py-7">
                <article className="max-w-[68ch]">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.13em] text-ink-muted">
                    {String(index + 1).padStart(2, "0")} · {post.label}
                  </p>
                  <h3 className="mt-2 font-display text-[1.35rem] font-semibold leading-tight text-ink sm:text-2xl">
                    {post.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink/85">
                    {post.paragraphs[0]}
                  </p>
                  <button
                    type="button"
                    onClick={() => activate(post.id, true)}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    Read the full thing <span aria-hidden="true">→</span>
                  </button>
                </article>
              </li>
            ))}
          </ol>
        </section>

        {POSTS.map((post) => {
          const isActive = post.id === activeId;
          return (
            <div
              key={post.id}
              role="tabpanel"
              id={`panel-${post.id}`}
              aria-labelledby={`tab-${post.id}`}
              hidden={!isActive}
            >
              <button
                type="button"
                onClick={() => activate(OVERVIEW_ID, true)}
                className="mb-5 inline-flex min-h-11 items-center gap-1.5 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
              >
                <span aria-hidden="true">←</span> Back to one-paragraph overview
              </button>

              <motion.div
                variants={list}
                initial="resting"
                animate={isActive ? "shown" : "resting"}
                className="grid gap-x-10 gap-y-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]"
              >
                <div>
                  <motion.h2
                    ref={(element) => {
                      contentRefs.current[post.id] = element;
                    }}
                    tabIndex={-1}
                    variants={item}
                    className="scroll-mt-28 text-balance font-display text-[clamp(1.7rem,3.6vw,2.7rem)] font-semibold leading-[1.1] tracking-tight text-ink"
                  >
                    {post.title}
                  </motion.h2>

                  <motion.p
                    variants={item}
                    className="mt-3 max-w-[52ch] font-display text-[1.05rem] font-medium leading-snug text-ink/85"
                  >
                    {post.standfirst}
                  </motion.p>

                  <div className="mt-6 space-y-4">
                    {post.paragraphs.map((paragraph, index) => (
                      <motion.p
                        key={`${post.id}-paragraph-${index}`}
                        variants={item}
                        className={`max-w-[64ch] leading-relaxed text-ink/85 ${
                          index === 0 ? "text-[1.08rem] text-ink/90" : ""
                        }`}
                      >
                        {paragraph}
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
                        {aside.items.map((asideItem) => (
                          <motion.div
                            key={`${post.id}-${asideItem.term}`}
                            variants={item}
                            className="rounded-2xl border border-line bg-ground-lift p-4"
                          >
                            <dt className="font-display text-[0.95rem] font-semibold text-ink">
                              {asideItem.term}
                            </dt>
                            <dd className="mt-1 text-[0.95rem] leading-relaxed text-ink/75">
                              {asideItem.body}
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
