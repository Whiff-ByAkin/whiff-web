"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT_EMAIL } from "../config/site";

const INSTAGRAM = "https://www.instagram.com/discover_whiff/";

export function Contact() {
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
        className="header-action rounded-full border border-line bg-ground-lift px-2.5 py-1.5 font-display text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-ground min-[360px]:px-4 min-[360px]:py-2 min-[360px]:text-sm"
      >
        Contact
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
                  aria-label="Contact whiff"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative w-full max-w-sm rounded-3xl border border-line bg-ground-lift p-7 text-center shadow-[0_40px_80px_-30px_rgba(36,26,21,0.28)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ground hover:text-ink"
                  >
                    ✕
                  </button>

                  <h2 className="font-display text-2xl font-semibold text-ink">
                    say hello
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                    questions, press, or partnerships. we&rsquo;d love to hear
                    from you.
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="btn-ink inline-flex w-full items-center justify-center rounded-full px-6 py-3 font-display font-semibold tracking-wide"
                    >
                      email us
                    </a>
                    <a
                      href={INSTAGRAM}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full border border-line bg-ground px-6 py-3 font-display font-medium text-ink transition-colors hover:border-ink hover:bg-ground-lift"
                    >
                      message us on Instagram
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
