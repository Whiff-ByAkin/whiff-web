"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT_EMAIL, LIVE_STATES } from "../config/site";

const STATE_EMAIL_SUBJECT = encodeURIComponent("Bring whiff to my state");
const DEFAULT_TRIGGER_CLASS =
  "header-action rounded-full border border-line bg-ground-lift px-4 py-2 font-display text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ground";

// LIVE_STATES is derived from MARKETS in config/site.ts rather than listed
// here. It used to be a hardcoded ["Minnesota"], which meant opening a market
// in a new state would have left this dialog quietly wrong — the exact kind of
// drift between two surfaces that makes an answer engine hedge on a fact.

// Header dialog showing where whiff is live. Deliberately three elements and
// nothing else: no progress framing (that implies a roadmap we haven't
// promised) and no "quality over quantity" explainer — pre-emptively
// justifying why the list is short is what draws attention to it being short.
export function StatesWhiffIsIn({
  triggerClassName = DEFAULT_TRIGGER_CLASS,
}: {
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeDialog = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeDialog();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeDialog, open]);

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className={triggerClassName}
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
                  onClick={closeDialog}
                  className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
                />
                <motion.div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="states-title"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative w-full max-w-[27rem] overflow-hidden rounded-3xl border border-line bg-ground-lift shadow-[0_40px_80px_-30px_rgba(36,26,21,0.28)]"
                >
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={closeDialog}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ground hover:text-ink"
                  >
                    ✕
                  </button>

                  <div className="px-7 pb-7 pt-10 text-center">
                    <h2
                      id="states-title"
                      className="font-display text-sm font-medium text-ink-muted"
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
                      className="btn-ink mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 font-display text-sm font-semibold tracking-wide"
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
