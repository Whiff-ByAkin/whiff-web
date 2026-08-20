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

  return (
    <div className="mx-auto w-full max-w-[68rem]">
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

      <div className="mt-8 min-w-0 lg:mt-0">
        <section
          id={`panel-${OVERVIEW_ID}`}
          aria-labelledby={`heading-${OVERVIEW_ID}`}
          hidden={activeId !== OVERVIEW_ID}
        >
          <h2
            id={`heading-${OVERVIEW_ID}`}
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
                {/* An index row, not a stacked card. The number, the piece and
                    the way in each own a column from lg up, so the row reaches
                    the same right edge as the rule that closes it — the copy
                    still keeps a reading measure instead of being stretched to
                    fill the width, which is what the empty column was for. */}
                <article className="grid items-start gap-x-8 gap-y-4 lg:grid-cols-[7.5rem_minmax(0,1fr)_auto] xl:gap-x-12">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.13em] text-ink-muted lg:pt-2">
                    {String(index + 1).padStart(2, "0")} · {post.label}
                  </p>

                  <div className="min-w-0">
                    <h3 className="font-display text-[1.35rem] font-semibold leading-tight text-ink sm:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-3 max-w-[62ch] leading-relaxed text-ink/85">
                      {post.paragraphs[0]}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => activate(post.id, true)}
                    className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap font-display text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-ink lg:justify-self-end lg:pt-1"
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
            <section
              key={post.id}
              id={`panel-${post.id}`}
              aria-labelledby={`heading-${post.id}`}
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
                // The aside column used to wait for xl, which left every
                // laptop between 1024 and 1280 reading a 64ch column with a
                // third of the row empty beside it. It splits at lg now, on a
                // narrower rail that widens once there is room for it.
                className="grid gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]"
              >
                <div>
                  <motion.h2
                    id={`heading-${post.id}`}
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
                    <blockquote className="border-l-2 border-stone pl-5 font-display text-[clamp(1.15rem,1.6vw,1.4rem)] font-semibold leading-snug text-ink lg:mt-12">
                      {post.pullquote}
                    </blockquote>
                  )}
                </motion.div>
              </motion.div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
