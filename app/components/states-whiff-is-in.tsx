"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT_EMAIL } from "../config/site";

const STATE_EMAIL_SUBJECT = encodeURIComponent("Bring whiff to my state");
const LIVE_STATES = ["Minnesota"];

// Header dialog showing where whiff is live. Deliberately three elements and
// nothing else: no progress framing (that implies a roadmap we haven't
// promised) and no "quality over quantity" explainer — pre-emptively
// justifying why the list is short is what draws attention to it being short.
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
        className="rounded-full border border-line bg-card px-4 py-2 font-display text-sm font-medium text-ink transition-colors hover:border-espresso hover:text-espresso"
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
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative w-full max-w-[27rem] overflow-hidden rounded-3xl border border-line bg-card shadow-[0_40px_80px_-30px_rgba(24,24,27,0.28)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-page hover:text-ink"
                  >
                    ✕
                  </button>

                  <div className="px-7 pb-7 pt-10 text-center">
                    <h2
                      id="states-title"
                      className="font-display text-sm font-medium text-ink-soft"
                    >
                      whiff is live in
                    </h2>
                    <ul className="mt-2 space-y-1">
                      {LIVE_STATES.map((state) => (
                        <li
                          key={state}
                          className="font-display text-[2.5rem] font-semibold leading-tight tracking-tight text-ink"
                        >
                          {state}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=${STATE_EMAIL_SUBJECT}`}
                      className="btn-latte mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 font-display text-sm font-semibold tracking-wide"
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
