"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FEATURED_ESSAY_PATH, type StoryPreview } from "./data";
import { StorySubmissionForm } from "./story-submission-form";

// Warm tint rotation for the confession wall. Most cards are quiet paper; every
// third/sixth beat is a saturated "pull quote" (sienna or forest) so the wall
// has rhythm and the eye keeps moving down it instead of glazing over.
const TINTS = [
  { card: "border-forest/10 bg-card hover:border-sienna/30", text: "text-forest", sub: "text-forest/55", mark: "text-sienna/25" },
  { card: "border-forest/10 bg-oat/70 hover:border-sienna/30", text: "text-forest", sub: "text-forest/55", mark: "text-terracotta/35" },
  { card: "border-transparent bg-sienna hover:bg-sienna-hover", text: "text-oat", sub: "text-oat/75", mark: "text-oat/40" },
  { card: "border-forest/10 bg-card hover:border-sienna/30", text: "text-forest", sub: "text-forest/55", mark: "text-ochre/40" },
  { card: "border-forest/10 bg-[#f5ecdd] hover:border-sienna/30", text: "text-forest", sub: "text-forest/55", mark: "text-sienna/25" },
  { card: "border-transparent bg-forest hover:bg-forest/90", text: "text-oat", sub: "text-oat/65", mark: "text-oat/35" },
] as const;

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};
export function StoryHub({ stories }: { stories: readonly StoryPreview[] }) {
  const [activeStory, setActiveStory] = useState<StoryPreview | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const reduce = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const dialogOpen = activeStory !== null || submitOpen;
  const hasStories = stories.length > 0;

  useEffect(() => {
    const page = pageRef.current;
    if (page) page.inert = dialogOpen;
    return () => {
      if (page) page.inert = false;
    };
  }, [dialogOpen]);

  return (
    <main id="main" className="relative min-h-[100svh] overflow-x-hidden pb-24">
      {/* a soft fixed warmth behind the wall (the global ambient orbs sit lower) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(80%_50%_at_50%_-8%,rgba(184,92,56,0.12),transparent_60%)]"
      />

      <div ref={pageRef} aria-hidden={dialogOpen ? true : undefined}>
        {/* sticky nav: home + persistent share CTA */}
        <div className="sticky top-0 z-30 border-b border-forest/10 bg-oat/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" aria-label="whiff home" className="inline-flex">
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny logo asset */}
              <img src="/whiff-wordmark.png" alt="whiff" width={303} height={145} className="h-6 w-auto sm:h-7" />
            </Link>
            <button
              type="button"
              onClick={() => setSubmitOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-sienna px-4 py-2 font-serif text-sm italic text-oat shadow-[0_10px_26px_-16px_rgba(120,44,26,0.7)] transition hover:-translate-y-0.5 hover:bg-sienna-hover"
            >
              <span aria-hidden="true" className="text-base leading-none">+</span>
              Share yours
            </button>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          {/* ── hero ── */}
          <motion.section
            variants={reduce ? undefined : heroStagger}
            initial={reduce ? undefined : "hidden"}
            animate={reduce ? undefined : "visible"}
            className="mx-auto max-w-3xl pt-12 text-center sm:pt-16"
          >
            <motion.h1
              variants={reduce ? undefined : heroItem}
              className="text-balance font-serif text-[clamp(2.1rem,7vw,4rem)] font-semibold leading-[1.02] tracking-tight text-forest"
            >
              Tired of dating apps?{" "}
              <span className="italic text-sienna">You are not the only one.</span>
            </motion.h1>

            <motion.p
              variants={reduce ? undefined : heroItem}
              className="mx-auto mt-5 max-w-xl text-balance font-serif text-base leading-relaxed text-forest/72 sm:text-lg"
            >
              Real, anonymous stories about burnout, ghosting, and swiping into
              the void, and a calmer way to meet people. Tap any card to read
              one. Share yours when you are ready.
            </motion.p>

            <motion.div
              variants={reduce ? undefined : heroItem}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <button
                type="button"
                onClick={() => setSubmitOpen(true)}
                className="group inline-flex items-center gap-2 rounded-full bg-sienna px-7 py-3.5 font-serif text-base italic tracking-wide text-oat shadow-[0_16px_40px_-18px_rgba(120,44,26,0.65)] transition hover:-translate-y-0.5 hover:bg-sienna-hover"
              >
                Rant about your experience
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </button>
              {hasStories && (
                <span className="font-serif text-sm italic text-forest/55">
                  {stories.length} moments on the wall
                </span>
              )}
            </motion.div>
          </motion.section>

          {/* ── featured essay ── */}
          <Link
            href={FEATURED_ESSAY_PATH}
            className="group mx-auto mt-14 grid max-w-3xl gap-5 rounded-[8px] border border-forest/12 bg-gradient-to-br from-card to-oat/50 p-5 shadow-[0_30px_80px_-60px_rgba(46,39,35,0.6)] transition hover:-translate-y-0.5 hover:border-sienna/30 sm:grid-cols-[8rem_1fr] sm:p-6"
          >
            <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:border-r sm:border-forest/12 sm:pr-5">
              <p className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-sienna/80">
                Short read
              </p>
              <span aria-hidden="true" className="h-px flex-1 bg-forest/12 sm:w-full sm:flex-none" />
            </div>
            <div className="min-w-0">
              <h2 className="mt-1.5 font-serif text-xl font-semibold leading-tight text-forest sm:text-2xl">
                Why Dating Apps Feel So Exhausting
              </h2>
              <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-forest/70 sm:text-base">
                On why swiping starts to feel like work, and how whiff trades
                it for less swiping and more real context.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-serif text-sm italic text-sienna transition group-hover:text-sienna-hover">
                Open essay
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </span>
            </div>
          </Link>

          {/* ── the wall ── */}
          <div className="mt-16 flex items-end justify-between gap-4 border-b border-forest/12 pb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-forest/60">
                Read what people sent in
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold leading-none text-forest sm:text-3xl">
                {hasStories ? "The story wall" : "Start the wall"}
              </h2>
            </div>
            <span className="hidden shrink-0 rounded-full border border-forest/15 bg-oat/70 px-3 py-1 text-xs text-forest/65 backdrop-blur-md sm:inline-flex">
              {hasStories ? "tap any card to read" : "add yours"}
            </span>
          </div>

          {hasStories ? (
            <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]">
              {stories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  tint={TINTS[index % TINTS.length]}
                  delayMs={Math.min(index * 55, 650)}
                  onOpen={() => setActiveStory(story)}
                />
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSubmitOpen(true)}
              aria-label="Add the first dating app story"
              className="mx-auto mt-6 grid w-full max-w-2xl gap-4 rounded-[8px] border border-dashed border-sienna/40 bg-card/70 p-6 text-left shadow-[0_30px_80px_-60px_rgba(46,39,35,0.6)] transition hover:-translate-y-0.5 hover:border-sienna/60 hover:bg-card sm:grid-cols-[7rem_1fr] sm:p-7"
            >
              <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:border-r sm:border-sienna/20 sm:pr-5">
                <p className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-forest/60">
                  First story
                </p>
                <span aria-hidden="true" className="h-px flex-1 border-t border-dashed border-sienna/30 sm:w-full sm:flex-none" />
              </div>
              <div>
                <p className="max-w-lg text-balance font-serif text-2xl font-semibold leading-tight text-forest sm:text-3xl">
                  &ldquo;Join us to start this movement.&rdquo;
                </p>
                <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-forest/72 sm:text-base">
                  The wall is empty right now. Add your side of the dating app
                  experience and help someone else feel less alone.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-serif text-sm italic text-sienna">
                  Share the first one
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      <StoryDialog story={activeStory} onClose={() => setActiveStory(null)} />
      <SubmitDialog open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </main>
  );
}

function StoryCard({
  story,
  tint,
  delayMs,
  onOpen,
}: {
  story: StoryPreview;
  tint: (typeof TINTS)[number];
  delayMs: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      style={{ animationDelay: `${delayMs}ms` }}
      onClick={onOpen}
      aria-label={`Read ${story.label} story`}
      className={`card-in group mb-4 flex w-full break-inside-avoid flex-col gap-4 rounded-2xl border p-5 text-left shadow-[0_24px_60px_-52px_rgba(46,39,35,0.7)] transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1.5 active:scale-[0.985] sm:p-6 ${tint.card}`}
    >
      <span
        aria-hidden="true"
        className={`-mb-3 font-serif text-5xl leading-none ${tint.mark}`}
      >
        &ldquo;
      </span>
      <p className={`font-serif text-base font-medium leading-snug ${tint.text} sm:text-lg`}>
        {story.quote}
      </p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <span className={`text-[10px] uppercase tracking-[0.2em] ${tint.sub}`}>
          {story.label}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-xs italic ${tint.sub}`}>
          {story.author}
          <span
            aria-hidden="true"
            className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
          >
            &rarr;
          </span>
        </span>
      </div>
    </button>
  );
}

function StoryDialog({
  story,
  onClose,
}: {
  story: StoryPreview | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={story !== null} onClose={onClose} title={story?.label ?? "Story"}>
      {story && (
        <article className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 pr-8 text-[11px] uppercase tracking-[0.22em] text-forest/60">
            <span>{story.author}</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-forest">
            &ldquo;{story.quote}&rdquo;
          </h2>
          <p className="text-lg leading-[1.85] text-forest/76">{story.story}</p>
          {story.takeaway && (
            <div className="rounded-[8px] border border-forest/15 bg-oat/60 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-forest/60">
                What they learned
              </p>
              <p className="mt-2 font-serif text-xl font-semibold leading-snug text-forest">
                {story.takeaway}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest px-5 font-serif text-sm italic text-oat transition hover:bg-sienna"
          >
            close story
          </button>
        </article>
      )}
    </Dialog>
  );
}

function SubmitDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} title="join our anti dating app movement">
      <StorySubmissionForm />
    </Dialog>
  );
}

function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = getFocusableElements(panel);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    window.setTimeout(() => {
      const panel = panelRef.current;
      const firstFocusable = panel ? getFocusableElements(panel)[0] : null;
      firstFocusable?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-oat/70 px-3 pb-3 backdrop-blur-lg md:items-center md:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 cursor-default"
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-forest/15 bg-card p-4 shadow-[0_30px_80px_-24px_rgba(46,39,35,0.5)] md:max-h-[88svh] md:rounded-[8px] md:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-forest/20 bg-card/90 text-forest shadow-[0_12px_30px_-18px_rgba(46,39,35,0.7)] backdrop-blur transition hover:bg-forest hover:text-oat md:right-3 md:top-3 md:h-11 md:w-11"
        >
          x
        </button>
        <p id={titleId} className="sr-only">
          {title}
        </p>
        <div>{children}</div>
      </section>
    </div>
  );
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("aria-hidden"));
}
