"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

const CONTACT_EMAIL = "hello@whiff-ai.com";
const LIVE_STATES = [
  {
    name: "Minnesota",
  },
];

// Header dialog showing where whiff is currently launching.
export function StatesWhiffIsIn() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="rounded-full border border-line bg-card px-4 py-2 font-display text-sm font-medium text-ink transition-colors hover:border-rust hover:text-rust"
      >
        States
      </motion.button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="states-title"
                  aria-describedby="states-description"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative w-full max-w-[27rem] overflow-hidden rounded-3xl border border-line bg-card shadow-[0_40px_80px_-30px_rgba(63,45,34,0.4)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                  >
                    ✕
                  </button>

                  <div className="border-b border-line bg-cream/55 px-7 pb-6 pt-7">
                    <p className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-rust">
                      Launch progress
                    </p>
                    <h2
                      id="states-title"
                      className="mt-2 max-w-[15rem] font-display text-3xl font-semibold leading-tight text-ink"
                    >
                      states whiff is in
                    </h2>
                    <p
                      id="states-description"
                      className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-soft"
                    >
                      We&rsquo;re launching with progress in mind: quality over
                      quantity, one state at a time.
                    </p>
                  </div>

                  <div className="px-7 py-6">
                    <p className="font-display text-sm font-semibold text-ink">
                      Current state
                    </p>

                    <ul className="mt-3 border-t border-line">
                      {LIVE_STATES.map((state) => (
                        <StateRow key={state.name} state={state} />
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-line bg-cream/45 px-7 py-5">
                    <p className="font-display text-sm font-semibold text-ink">
                      Want whiff where you are?
                    </p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Bring whiff to my state`}
                      className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-rust px-5 py-3 font-display text-sm font-semibold tracking-wide text-white transition-colors hover:bg-rust-edge"
                    >
                      tell us your state
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

type LiveState = (typeof LIVE_STATES)[number];

function StateRow({ state }: { state: LiveState }) {
  return (
    <li className="py-4">
      <p className="font-display text-2xl font-semibold leading-none text-ink">
        {state.name}
      </p>
    </li>
  );
}
