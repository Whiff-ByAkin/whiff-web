"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

const LIVE_STATES = ["Minnesota"];

// A small "States" button in the header. Clicking it opens a dialog that tells
// visitors, plainly, where whiff is live right now.
export function Status() {
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
                  aria-label="States where whiff is live"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative w-full max-w-sm rounded-3xl border border-line bg-card p-7 shadow-[0_40px_80px_-30px_rgba(63,45,34,0.4)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                  >
                    ✕
                  </button>

                  <h2 className="font-display text-2xl font-semibold text-ink">
                    states we&rsquo;re in
                  </h2>

                  <ul className="mt-5">
                    {LIVE_STATES.map((state) => (
                      <StateRow key={state} name={state} />
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function StateRow({ name }: { name: string }) {
  return (
    <li className="border-b border-line py-3 font-display text-lg font-semibold leading-none text-ink">
      {name}
    </li>
  );
}
